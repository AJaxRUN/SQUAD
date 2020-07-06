export async function getNewRoomId(): Promise<getNewRoomIdResponse> {
	const response = await fetch('/getRoomId');
	return response.json();
}

export async function roomExists(roomId: string): Promise<roomExistsResponse> {
	const url = new URL('/doesRoomExist', window.location.href);
	const params = {'roomId': roomId};
	url.search = new URLSearchParams(params).toString();

	const response = await fetch(url.toString());
	return response.json();
}

interface baseResponse {
	success: boolean;
	message?: string;
}

interface getNewRoomIdResponse extends baseResponse {
	roomId: string;
}

interface roomExistsResponse extends baseResponse {
	doesRoomExist: boolean;
}