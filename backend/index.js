const Peer = require("simple-peer");
const io = require('socket.io-client');
let socket = io.connect();
let video = document.querySelector('video');
var roomID = window.location.hash;
roomID = roomID.slice(1,roomID.length);
let peersRef = [];
console.log("Id:",roomID)
navigator.mediaDevices.getUserMedia({video:true, audio:true})
    .then(stream => {
        video.srcObject = stream;
        video.play();
        socket.emit("join room", roomID);
        
        socket.on("all users", users => {
            users.forEach(userID => {
                const peer = createPeer(userID, socket.id, stream);
                peersRef.push({
                    peerID: userID,
                    peer,
                })
            })
        })

        socket.on("user joined", payload => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            
            peersRef.push({
                peerID: payload.callerID,
                peer,
            })
        });

        socket.on("receiving returned signal", payload => {
            const item = peersRef.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });

        socket.on("removeClient", peerId => {
            console.log("Hii:",peerId)
            if(document.getElementById("peerVideo"+peerId)) {
                console.log("disconnecting")
                document.getElementById("peerVideo"+peerId).remove();
            }
        });

    })
    .catch(err => console.log(err));

    const createVideo = (stream, id) => {
        video = document.createElement("video");
        video.id = "peerVideo" + id;
        video.class = "embed-responsive-item";
        video.srcObject = stream;
        document.querySelector("#peerDiv").appendChild(video);
        video.play();
    }

function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
    });

    peer.on("stream", (stream) => {
        console.log("Received stream createPeer:", callerID);
        createVideo(stream, userToSignal);
    });

    peer.on("signal", signal => {
        if(signal.type && (signal.type.toString()).toLowerCase() == "offer") {
            console.log("received offer:", signal)
            socket.emit("sending signal", { userToSignal, callerID, signal })
        }
    })

    return peer;
}

function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
    }); 

    peer.on("stream", (stream) => {
        console.log("Received stream addPeer:", callerID);
        createVideo(stream, callerID);
    });

    peer.on("signal", signal => {
        if(signal.type && (signal.type.toString()).toLowerCase() == "answer") {
            console.log("received answer:", signal)
            socket.emit("returning signal", { signal, callerID })
        }
    })

    peer.signal(incomingSignal);

    return peer;
}