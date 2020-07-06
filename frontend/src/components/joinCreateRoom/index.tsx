import React, { createRef } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card'
import { getNewRoomId, roomExists } from '../../utils/fetchCalls';
import { useHistory } from 'react-router-dom';

export function JoinCreateRoom() {
	const history = useHistory();
	const inputRef = createRef<HTMLInputElement>();
   
	async function createMeeting() {
		const response = await getNewRoomId();
		if(response.success)
			history.push('/room/'+response.roomId);
		else
			alert('An error was encountered please try again later');
	}

	async function joinMeeting() {
		const roomId = inputRef.current?.value;
		if(roomId) {
			const response = await roomExists(roomId);
			if(response.success && response.doesRoomExist)
				history.push('/room/'+roomId);
			else if(response.success)
				alert('No such room exists');
			else
				alert('An error was encountered. Please try again later');
		}
	}
	
	return (
		<Card>
			<input type='text' name='room' ref={inputRef} />
			<Button onClick={joinMeeting}>Join a meeting</Button>
			<Button onClick={createMeeting}>Create a Meeting</Button>
		</Card>
	);
}