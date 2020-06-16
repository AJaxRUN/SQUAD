import React, { useRef } from 'react';
import { peerAndStreamInterface } from './types';
import './index.css';
import './pictureInPicture.css';

export function PictureInPictureVideo(props: PictureInPictureVideoProps) {
	const peerVideo = useRef<HTMLVideoElement>(null);
	const myVideo = useRef<HTMLVideoElement>(null);
	return (
		<div className='fillParent'>
			<video className='fillMaxParent' ref={peerVideo}/>
			<video className='pictureInPictureVideo' ref={myVideo}/>
		</div>
	);
}

interface PictureInPictureVideoProps {
	setIsPictureInPictureMode: (value: boolean) => void;
	peerAndStreamObjects: Array<peerAndStreamInterface>;
}