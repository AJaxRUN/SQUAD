const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 4000;

app.use(express.static(__dirname));
let clients = 0;

io.on('connection', (socket) => { 
    socket.on("newClient", () => {
        if(clients < 2) {
            if(clients === 1) {
                socket.emit('createPeer');
            }
        }
        else {
            socket.emit('sessionActive');
        }
        clients ++;
    });
    socket.on('offer', (offer) => {
        socket.broadcast.emit('backOffer', offer);
    });
    socket.on('answer', sendAnswer = (answer) => {
        socket.broadcast.emit('backAnswer', answer);
    });
    socket.on('disconnect', disconnect);
});

const disconnect = () => {
    if(clients > 0) {
        clients --;
    }
}

http.listen(port, () => console.log(`App active on port ${port}`));