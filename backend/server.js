const express = require("express");
const http = require("http");
const app = express();
const { v4: uuidv4 } = require('uuid');
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};
const rooms = [];
const socketToRoom = {};
const port = 3000;

app.use(express.static(__dirname));

app.get("/getRoomId", (req, res) => {
    var newRoomId = uuidv4();
    while(users[newRoomId]) {
        newRoomId = uuidv4();
    }
    rooms.push(newRoomId);
    res.send(newRoomId)
});

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (rooms.includes(roomID)){    
            if (users[roomID]) {
                const length = users[roomID].length;
                if (length === 4) {
                    socket.emit("room full");
                    return;
                }
                users[roomID].push(socket.id);
            } else {
                users[roomID] = [socket.id];
            }
            socketToRoom[socket.id] = roomID;
            const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
            // console.log("all users")
            socket.emit("all users", usersInThisRoom);
        }
        else {
            socket.emit("invalid room", {})
        }
    });

    socket.on("sending signal", payload => {
        // console.log("sending signal:",payload.callerID)
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        // console.log("returning signal:",payload.callerID)
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        io.in(roomID).emit("removeClient",socket.id)
        if (room && room.length) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
        // if(!room || room === []) {
        //     rooms.pop(roomID);
        //     console.log("after:",rooms)
        // }
    });

});

server.listen(port, () => console.log(`server is running on port ${port}`));
