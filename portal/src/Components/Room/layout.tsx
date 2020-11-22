import React, { useState, useEffect, RefObject, createRef, useRef } from 'react';
import { Card } from '@material-ui/core';
import { layoutProps } from './types'; 
import './layout.css';
import { closeStream } from './common';

function createRefs(length: number) {
	const videoRefs = new Array<RefObject<HTMLVideoElement>>(length);
	for(let i=0; i<length; i++)
		videoRefs[i] = createRef<HTMLVideoElement>();
	return videoRefs;
}

function calculateLayout(participantsLength: number) {
	const maxWidth = 100;
	const maxHeight = 100;
	if(participantsLength > 0 && participantsLength <= 2) {
		const w=(Math.floor(maxWidth/participantsLength)).toString()+'%';
		const h=maxHeight.toString()+'%';
		return {height:h, width:w};
	}
	else if(participantsLength > 2 && participantsLength <= 4) {
		const w=(Math.floor(maxWidth/2)-1).toString()+'%';
		const h=(Math.floor(maxHeight/2)-1).toString()+'%';
		return {height: h, width: w};
	}
	else {
		const w=(Math.floor(maxWidth/3)-1).toString()+'%';
		const h=(Math.floor(maxHeight/2)-1).toString()+'%';
		return {height: h, width: w};
	}
}

function setSrcObjectAndPlay(ref: RefObject<HTMLVideoElement>, stream: MediaStream|null|undefined) {
	if(ref.current && stream) {
		ref.current.srcObject = stream;
		ref.current.play();
	}
}

export function Layout(props: layoutProps) {
	const [myStream, setMyStream] = useState<MediaStream>();
	const videoRefs = useRef<Array<RefObject<HTMLVideoElement>>>([]);
	
	useEffect(() => {
		async function setStream() {
			const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
			setMyStream(stream);
		}
		setStream();
	}, []);

	useEffect(() => {
		return () => {
			if(myStream)
				closeStream(myStream);
		};
	}, [myStream]);

	useEffect(() => {
		let i: number, result: IteratorResult<MediaStream>;
		const iterator = props.streamObjects.values();
		for(i=0, result = iterator.next();
			i<videoRefs.current.length && !result.done; i++, result = iterator.next()
		)
			setSrcObjectAndPlay(videoRefs.current[i], result.value);	

		if(i < videoRefs.current.length)
			setSrcObjectAndPlay(videoRefs.current[i], myStream);
	}, [props.streamObjects, myStream]);


	function createVideoElements() {
		const length = Math.min(props.streamObjects.size+1, 6);
		videoRefs.current = createRefs(length);
	
		const { height, width } = calculateLayout(length);
		const videoElements = videoRefs.current.map((videoRef, index) => {
			return (
				<Card key={index} className='cardLayout' style={{height, width}}>
					<video autoPlay className='video' ref={videoRef} />
				</Card>
			);
		});
		return videoElements;
	}

	return (
		<div className='mycontainer'>
			<div className='wrapper'>
				{createVideoElements()}
			</div>
		</div>
	);
}

