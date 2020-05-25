package main

import(
	"log"
	// "os"
	"fmt"
	"net/http"
	uuidGen "github.com/google/uuid"
)

var newRoomIds []string

func createRoomId(res http.ResponseWriter, req *http.Request) {

	uuid, err := uuidGen.NewUUID()
	if err != nil {
		log.Fatalln(err)
	}
	roomId := uuid.String()

	newRoomIds = append(newRoomIds, roomId)
	fmt.Fprintf(res, roomId)
	//Check uniqueness of uuid --- required??
}	

func roomHandler(res http.ResponseWriter, req *http.Request) {
	id := strings.TrimPrefix(req.URL.Path, "/room/")
	for 
}

func main() {
	// port := os.Getenv("PORT")
	// if port == "" {
	// 	log.Fatal("$PORT must be set")
	// }
	server := SocketServer()
	go server.Serve()
	defer server.Close()

	http.Handle("/data/", server)
	http.HandleFunc("/room/", roomHandler)
	http.HandleFunc("/createRoomId", createRoomId)
    http.Handle("/", http.FileServer(http.Dir("./")))

    log.Println("Serving at localhost:8080...")
    // log.Fatal(http.ListenAndServe(":"+port, nil))
    log.Fatal(http.ListenAndServe(":8080", nil))
}