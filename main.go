package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	socketio "github.com/googollee/go-socket.io"
)

var connections []socketio.Conn

// var connPool map[socketio.Conn]string

type sendingSignal struct {
	UserToSignal string
	CallerID     string
	Signal       interface{}
}

type returningSignal struct {
	CallerID string
	Signal   string
}

type answer struct {
	Id     string
	Signal string
}

func getConnectionsCSV() string {
	var cons string
	for i, s := range connections {
		cons += string(s.ID())
		if i != len(connections)-1 {
			cons += ","
		}
	}
	return cons
}

func main() {
	// port := "3000"
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}

	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		return nil
	})

	server.OnEvent("/", "newClient", func(s socketio.Conn, room string) {
		fmt.Println("New client:" + room)
		fmt.Println("allUsers")
		s.Emit("allUsers", getConnectionsCSV())
		connections = append(connections, s)
	})

	server.OnEvent("/", "sendingSignal", func(s socketio.Conn, msg string) {
		fmt.Println("Sending Signal:" + s.ID())
		var res sendingSignal
		json.Unmarshal([]byte(msg), &res)
		for _, so := range connections {
			if string(so.ID()) == res.UserToSignal {
				fmt.Println("User joined")
				so.Emit("userJoined", string(msg))
			}
		}
	})

	server.OnEvent("/", "returningSignal", func(s socketio.Conn, msg string) {
		fmt.Println("returning signal:" + s.ID())
		var res returningSignal
		var ans answer
		json.Unmarshal([]byte(msg), &res)
		ans.Id = string(s.ID())
		ans.Signal = res.Signal
		str, err := json.Marshal(ans)
		if err != nil {
			log.Fatalln(err)
		}
		for _, so := range connections {
			if string(so.ID()) == res.CallerID {
				so.Emit("receiveReturnedSignal", string(str))
			}
		}
	})

	server.OnError("/", func(s socketio.Conn, e error) {
		fmt.Println("meet error:", e)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("closed", reason)
		var index int
		if len(connections) > 0 {
			for i, so := range connections {
				if so.ID() == s.ID() {
					index = i
				} else {
					so.Emit("disconnect", string(s.ID()))
				}
			}
			connections = append(connections[:index], connections[index+1:]...)
		}
	})

	go server.Serve()
	defer server.Close()

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./")))
	log.Println("Serving at localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
