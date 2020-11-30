import React, { useRef, useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import { peerObjectsType, streamObjectsType, payloadInterface } from './types';
import { Layout } from './layout';
import { Toolbar } from './toolbar';
import { useHistory } from 'react-router-dom';
import { closeStream } from './common';
import './index.css';

async function getUserMediaFromBrowser(constraints: MediaStreamConstraints) {
	const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
	return mediaStream;
}

function roomFull() {
	alert('The room is full. Please try again later.');
}

function invalidRoom() {
	alert('The room ID is invalid');
}

function closePeersAndStream(peers: peerObjectsType, stream: MediaStream|undefined|null) {
	peers.forEach(value => {
		value.destroy();
	});
	closeStream(stream);
}

function Room() {
	const socket = useRef<SocketIOClient.Socket>();
	const myMediaStream = useRef<MediaStream>();
	const peerObjects = useRef<peerObjectsType>(new Map());
	const history = useHistory();

	const [streamObjects, setStreamObjects] = useState<streamObjectsType>(new Map()); 

	useEffect(() => {
		socket.current = io()
		async function initialise() {
			myMediaStream.current = await getUserMediaFromBrowser({audio: false, video: true});
			peerObjects.current.forEach(peer => {
				if(myMediaStream.current)
					peer.addStream(myMediaStream.current);
			});
		}
		initialise();
		const roomId = window.location.href.substring(window.location.href.lastIndexOf('/')+1);
		console.log(roomId)
		if(socket.current) {
			console.log("Socket id:" + socket.current.id)
			socket.current.emit('joinRoom', roomId);
			socket.current.on('roomFull', roomFull);
			socket.current.on('allUsers', receiveAllUsers);
			socket.current.on('invalidRoom', invalidRoom);
			socket.current.on('userJoined', newUserInRoom);
			socket.current.on('receivingReturnedSignal', gotReturnOffer);
			socket.current.on('removeClient', removeClient);
		}
	}, []);
	
	function receiveAllUsers(users: Array<string>) {
		console.log(users);
		users.forEach(userToSignal => {
			const peer = initPeer('init', userToSignal);
			console.log("receiveing users/....")
			peer.on('signal', (signal: SimplePeer.SignalData) => {
				if(signal.type && signal.type.toString().toLowerCase() === 'offer' && socket.current)
					socket.current.emit('sendingSignal', { userToSignal, signal });
			});
		});
	}

	function newUserInRoom(payload: payloadInterface) {
		const { callerId, signal } = payload;
		const peer = initPeer('notInit', callerId);
		peer.on('signal', (signal: SimplePeer.SignalData) => {
			if(signal.type && (signal.type.toString()).toLowerCase() === 'answer' && socket.current)
				socket.current.emit('returningSignal', { signal, callerId });
		});
		peer.signal(signal);
	}

	function gotReturnOffer(payload: payloadInterface) {
		const { callerId, signal } = payload;
		const peer = peerObjects.current.get(callerId);
		if(peer)
			peer.signal(signal);
	}

	function addStream(id: string, stream: MediaStream) {
		setStreamObjects(prevStream => {
			const tempStream = new Map(prevStream);
			tempStream.set(id, stream);
			return tempStream;
		});
	}

	function deleteStream(id: string) {
		setStreamObjects(prevStream => {
			const tempStream = new Map(prevStream);
			tempStream.delete(id);
			return tempStream;
		});
	}

	function removeClient(id: string) {
		console.log('Deleting connections');
		const peer = peerObjects.current.get(id);
		peerObjects.current.delete(id);
		if(peer)
			peer.destroy();
		deleteStream(id);
	}

	function initPeer(type: 'init'|'notInit', userId: string) {
		console.log(myMediaStream);
		const peer = new SimplePeer({
			initiator: (type === 'init'),
			stream: myMediaStream.current
		});
		peer.on('stream', (stream: MediaStream) => {
			console.log('Received stream');
			console.log(stream);
			addStream(userId, stream);
		});
		peer.on('close', () => {
			console.log('Deleting connection');
			peerObjects.current.delete(userId);
			deleteStream(userId);
			peer.destroy();
		});
		peerObjects.current.set(userId, peer);
		return peer;
	}

	function disconnectCall() {
		if(socket.current) {
			socket.current.disconnect();
			closePeersAndStream(peerObjects.current, myMediaStream.current);
		}
		history.push('/home');
	}

	async function toggleMicInCall(value: boolean) {
		try {
			const mediaStream = await getUserMediaFromBrowser({'video': true, 'audio': value});
			myMediaStream.current = mediaStream;
			return true;
		}
		catch(e) {
			console.log(e);
			return false;
		}
	}

	return (
		<div className='fillWindow'>
			<Layout streamObjects={streamObjects}/>
			<Toolbar disconnectCall={disconnectCall} toggleMicInCall={toggleMicInCall} />
		</div>
	);
}

export default Room;