const express = require('express');
const http = require('http');
const app = express();
const { v4: uuidv4 } = require('uuid');
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

const users = {};
const rooms = [];
const socketToRoom = {};
const port = 8080;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));

app.get('/getRoomId', (req, res) => {
	let newRoomId;
	do
		newRoomId = uuidv4();
	while(users[newRoomId]);
	rooms.push(newRoomId);
	res.send({'success': true, 'roomId': newRoomId});
});

app.get('/doesRoomExist', (req, res) => {
	const roomId = req.query.roomId;
	const doesRoomExist = rooms.includes(roomId);
	res.send({'success': true, doesRoomExist});
});

io.on('connection', socket => {
	socket.on('joinRoom', roomID => {
		if (rooms.includes(roomID)) {    
			if (users[roomID]) {
				const length = users[roomID].length;
				if (length === 4) {
					socket.emit('roomFull');
					return;
				}
				users[roomID].push(socket.id);
			}
			else
				users[roomID] = [socket.id];
			socketToRoom[socket.id] = roomID;
			const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
			// console.log('all users')
			socket.emit('allUsers', usersInThisRoom);
		}
		else
			socket.emit('invalidRoom', {});
	});

	socket.on('sendingSignal', payload => {
		console.log('sending signal:');
		// console.log(payload);
		io.to(payload.userToSignal).emit('userJoined', { signal: payload.signal, callerId: socket.id });
	});

	socket.on('returningSignal', payload => {
		console.log('returning signal:');
		// console.log(payload);
		io.to(payload.callerId).emit('receivingReturnedSignal', { signal: payload.signal, callerId: socket.id });
	});

	socket.on('disconnect', () => {
		const roomID = socketToRoom[socket.id];
		let room = users[roomID];
		io.in(roomID).emit('removeClient', socket.id);
		if(room && room.length) {
			room = room.filter(id => id !== socket.id);
			users[roomID] = room;
		}
	});
});

server.listen(port, () => console.log(`server is running on port ${port}`));
