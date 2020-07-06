import SimplePeer from 'simple-peer';


export type peerObjectsType = Map<string, SimplePeer.Instance>;

export type streamObjectsType = Map<string, MediaStream>;

export interface payloadInterface {
	signal: SimplePeer.SignalData;
	callerId: string;
}

export interface layoutProps {
	streamObjects: streamObjectsType;
}
