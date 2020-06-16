import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { PictureInPictureVideo } from './pictureInPicture';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import { peerAndStreamInterface } from './types';

export function VideoCallRoom() {
	const socket = useRef<SocketIOClient.Socket>();
	const unconnectedPeers = useRef<Array<SimplePeer.Instance>>([]);
	const [myMediaStream, setMyMediaStream] = useState<MediaStream>();
	const [peerAndStreamObjects, setpeerAndStreamObjects] = useState<Array<peerAndStreamInterface>>([]);
	
	useEffect(() => {
		getUserMediaFromBrowser(true, true, false);
		initialiseSocket();
	}, []);

	function initialiseSocket() {
		socket.current = io();
		socket.current.emit('newClient');
		socket.current.on('gotNewOffer', gotNewOffer);
		socket.current.on('gotReturnOffer', gotReturnOffer);
		socket.current.on('createPeer', createPeer);
	}

	async function getUserMediaFromBrowser(needVideo: boolean, needAudio: boolean, isScreenSharing: boolean) {
		const mediaStream = await navigator.mediaDevices.getUserMedia({ video: needVideo, audio: needAudio});
		setMyMediaStream(mediaStream);
	}

	function gotNewOffer(offer: SimplePeer.SignalData) {
		const peer = initPeer('notInit');
		console.log('gotNewOffer');
		peer.on('signal', data => {
			console.log('front signal:')
			socket.current!.emit('answer', JSON.stringify(data));
		});
		peer.signal(offer);
	}

	function gotReturnOffer(answer: string | SimplePeer.SignalData) {
		console.log("Signal Answer!");
		if(unconnectedPeers.current.length > 1) {
			const peer = unconnectedPeers.current.pop()!;
			peer.signal(answer);
		}
	}

	function createPeer() {
		const peer = initPeer('init');
		peer.on('signal', (data) => {
			console.log("make peer signal:")
			socket.current!.emit('offer', JSON.stringify(data));
		});
	}

	function addNewPeerStream(peer: SimplePeer.Instance,stream: MediaStream) {
		const temppeerAndStreamObjects = [...peerAndStreamObjects];
		const index = peerAndStreamObjects.findIndex(({peerObject}) => peer === peerObject);
		temppeerAndStreamObjects[index] = {
			peerObject: peer,
			streamObject: stream
		};
		setpeerAndStreamObjects(temppeerAndStreamObjects);
	}

	function initPeer(type: 'init'|'notInit') {
		const peer = new SimplePeer({
			initiator: (type === 'init'),
			stream: myMediaStream
		});
		peer.on('stream', (stream: MediaStream) => {
			console.log('On stream signal');
			addNewPeerStream(peer, stream);
		});
		peer.on('close', () => {
			const tempPeerAndStreamObjects = peerAndStreamObjects.filter(({peerObject}) => peerObject !== peer);
			peer.destroy();
			setpeerAndStreamObjects(tempPeerAndStreamObjects);
		});
		const tempPeerAndStreamObjects = [...peerAndStreamObjects];
		tempPeerAndStreamObjects.push({peerObject: peer, streamObject: null});
		setpeerAndStreamObjects(tempPeerAndStreamObjects);
		unconnectedPeers.current.push(peer);
		return peer;
	}
	
	return (
		<div className='fillWindow'>
		</div>
	);
}

