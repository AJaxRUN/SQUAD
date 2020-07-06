import React, { useState } from 'react';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import CallEndIcon from '@material-ui/icons/CallEnd';
import IconButton from '@material-ui/core/IconButton';
import './toolbar.css';

export function Toolbar(props: ToolbarProps) {
	const [isMicOn, setIsMicOn] = useState(true);
	
	async function toggleMic() {
		const toggledValue = !isMicOn;
		const success = await props.toggleMicInCall(toggledValue);
		if(success)
			setIsMicOn(toggledValue);
	}

	return (
		<div className='toolbar'>
			<IconButton onClick={props.disconnectCall}><CallEndIcon fontSize='large' color='secondary' /></IconButton>
			<IconButton onClick={toggleMic}>
			{
				isMicOn ?
				<MicIcon fontSize='large' /> :
				<MicOffIcon fontSize='large' />
			}
			</IconButton>
		</div>
	);
}

interface ToolbarProps {
	disconnectCall: () => void;
	toggleMicInCall: (value: boolean) => Promise<boolean>;
}