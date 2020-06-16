import SimplePeer from 'simple-peer';

export interface peerAndStreamInterface {
	peerObject: SimplePeer.Instance;
	streamObject: MediaStream | null;
}
