import React, { useState, useEffect, useRef } from 'react'
import {
  Row,
  Button,
  Spinner
} from 'react-bootstrap'
import './PortalHome.css'
import axios from 'axios'
import Peer from 'simple-peer'
// import io from 'socket.io-client'
// const socket = io('http://localhost:8080');
// let client = {gotAnswer: false, peer: ''};

const PortalHome = (props: any) => {
    // const hostVideo = useRef(null);
    // const partcipantVideo = useRef(null);
    // const [ streamSettings, setStreamSettings ] = useState({ 
    //     video: true, 
    //     audio: true,
    //     screen: false
    // });

    // const makePeer = () => {
    //     client.gotAnswer = false;
    //     let peer = initPeer('init');
    //     peer.on('signal', (data:any) => {
    //         console.log("make peer signal:")
    //         if(!client.gotAnswer) {
    //             socket.emit('offer', data);
    //         }
    //     });
    //     client.peer = peer;
    // }

    // //When another client gives offer and we have to send offer
    // const frontAnswer = (offer:any) => {
    //     let peer = initPeer('notInit');
    //     console.log("front answer:")
    //     peer.on('signal', (data:any) => {
    //         console.log("front signal:")
    //         socket.emit('answer', data);
    //     });
    //     peer.signal(offer);
    // }

    // const signalAnswer = (answer:any) => {
    //     console.log("Signal Answer!")
    //     client.gotAnswer = true;
    //     let peer = client.peer;
    //     //@ts-ignore
    //     peer.signal(answer);
    // }

    // const sessionActive = () =>{ 
    //     alert("Session Active, comeback later!");
    // }

    // //Events for calling these functions
    // socket.on('backOffer', frontAnswer);
    // socket.on('backAnswer', signalAnswer);
    // socket.on('sessionActive', sessionActive);
    // socket.on('createPeer', makePeer);

    // useEffect(() => {
    //     if(hostVideo !== null) {
    //         navigator.mediaDevices.getUserMedia({video: streamSettings.video, audio: streamSettings.audio})
    //             .then(stream => {
    //                 socket.emit('newClient');
    //                 //@ts-ignore
    //                 hostVideo.current.srcObject = stream;
    //                 //@ts-ignore
    //                 hostVideo.current.play();
    //                 const initPeer = (type:string) => {
    //                     console.log("Init peer: "+ type)
    //                     let peer = new Peer({ 
    //                         initiator:(type =='init')?true:false,
    //                         stream: stream,
    //                         trickle: false
    //                     });
    //                     peer.on('stream', (stream:any) => {
    //                         console.log("On stream signal")
    //                         //@ts-ignore
    //                         partcipantVideo.current.srcObject = stream
    //                         //@ts-ignore
    //                         partcipantVideo.current.play()
    //                     })
    //                     peer.on('close', () => {
    //                         setStreamSettings({
    //                             video: false,
    //                             audio: false,
    //                             screen: false,
    //                         })
    //                         peer.destroy();
    //                     })
    //                     return peer;
    //                 }

    //             })
    //             .catch(err => console.log(err));
    //     } 
    // }, [streamSettings, hostVideo, partcipantVideo]);

    // return (
    //     <div className="d-flex h-100 page_bg">
    //         <div className="video_container">
    //             <video ref={hostVideo} className="host_video" />
    //             <video ref={partcipantVideo} className="participant_video" />
    //         </div>
    //     </div>
    // );
    return (
            <div className="h-100 page_bg">
                    <div className="video_box">asdasdasdasadaiusfafehfhfofw ermeggmegogoeg</div>
                    <div className="video_box">wefwefwfefwf ermeggmegogoeg</div>

            </div>
        );
}

  
export default PortalHome;