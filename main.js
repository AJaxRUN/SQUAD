const Peer = require("simple-peer");
const io = require('socket.io-client');
let socket = io();
let video = document.querySelector('video');
let client = {};

//get stream
navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(stream => {
        socket.emit('newClient');
        video.srcObject = stream;
        video.play();

        //used to initialize a peer
        const initPeer = (type) => {
            console.log("Init peer: "+ type)
            let peer = new Peer({ 
                initiator:(type =='init')?true:false,
                stream: stream,
                trickle: false
            });
            peer.on('stream', (stream) => {
                console.log("On stream signal")
                createVideo(stream);
            })
            peer.on('close', () => {
                document.getElementById("peerVideo").remove();
                peer.destroy();
            })
            return peer;
        }

        //For peer of type init - to send offer 
        const makePeer = () => {
            client.gotAnswer = false;
            let peer = initPeer('init');
            peer.on('signal', (data) => {
                console.log("make peer signal:")
                if(!client.gotAnswer) {
                    socket.emit('offer', data);
                }
            });
            client.peer = peer;
        }

        //When another client gives offer and we have to send offer
        const frontAnswer = (offer) => {
            let peer = initPeer('notInit');
            console.log("front answer:")
            peer.on('signal', (data) => {
                console.log("front signal:")
                socket.emit('answer', data);
            });
            peer.signal(offer);
        }

        const signalAnswer = (answer) => {
            console.log("Signal Answer!")
            client.gotAnswer = true;
            let peer = client.peer;
            peer.signal(answer);
        }

        const createVideo = (stream) => {
            video = document.createElement("video");
            video.id = "peerVideo";
            video.class = "embed-responsive-item";
            video.srcObject = stream;
            document.querySelector("#peerDiv").appendChild(video);
            video.play();
        }

        const sessionActive = () =>{ 
            alert("Session Active, comeback later!");
        }

        //Events for calling these functions
        socket.on('backOffer', frontAnswer);
        socket.on('backAnswer', signalAnswer);
        socket.on('sessionActive', sessionActive);
        socket.on('createPeer', makePeer);
    })
    .catch(err => console.log(err));
