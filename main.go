package main

import (
    "log"
	"net/http"
	// "os"
	"fmt"
	"github.com/googollee/go-socket.io"
)

var connPool []socketio.Conn //To hold all the connections
var connections int //Number of connections

func makeOffer() {
	connPool[0].Emit("createPeer")
}

func sendOffer(offer string) {
	connPool[1].Emit("backOffer", offer)
}

func sendAnswer(answer string) {
	connPool[0].Emit("backAnswer", answer)
}

func main() {
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

	server.OnEvent("/", "newClient", func(s socketio.Conn, msg string) {
		fmt.Println("New client")
		connPool = append(connPool, s)
		connections++

		if connections == 2 {
			makeOffer()
		}
		if connections > 2 {
			s.Emit("sessionActive")
		}
	})
	
	server.OnEvent("/", "offer", func(s socketio.Conn, msg string) {
		fmt.Println("offer received")
		sendOffer(msg)
	})

	server.OnEvent("/", "answer", func(s socketio.Conn, msg string) {
		fmt.Println("answer received")
		sendAnswer(msg)
	})

	server.OnError("/", func(s socketio.Conn, e error) {
		fmt.Println("meet error:", e)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("closed", reason)
	})

	go server.Serve()
	defer server.Close()

    http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./")))
    log.Println("Serving at localhost:8080...")
    log.Fatal(http.ListenAndServe(":"+port, nil))
}