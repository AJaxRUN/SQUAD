package main

import (
    "log"
	"fmt"
	"github.com/googollee/go-socket.io"
)


// type Room struct {
// 	roomId		string
// 	noClients	int	
// 	clients		[]Client
// }

// type Client struct {
// 	userName	string
// 	conn		socketio.Conn
// }

// var ConnPool map[string]Room

var connPool []socketio.Conn
var connections int

func makeOffer() {
	connPool[0].Emit("createPeer")
}

func sendOffer(offer string) {
	connPool[1].Emit("backOffer", offer)
}

func sendAnswer(answer string) {
	connPool[0].Emit("backAnswer", answer)
}

// This func must be Exported, Capitalized, and comment added.
func SocketServer() *socketio.Server{
	
	server, err := socketio.NewServer(nil)
    if err != nil {
        log.Fatal(err)
    }

    server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		// fmt.Println("connected:", s.ID())
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
			connections--
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
		//To remove connections from connpool on disconnecting
		if len(connPool) > 0 {
			connections--
			if connPool[0] == s {
				connPool = connPool[1:len(connPool)]
			} else {
				connPool = connPool[:len(connPool)-1]
			}
		}
		s.Join("disconnectId: "+s.ID())
	})

	return server
}