import React, { useState } from 'react';
import { 
	Mic as MicIcon,
	MicOff as MicOffIcon,
	PhoneOff as CallEndIcon
} from 'react-feather'
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
			<IconButton onClick={props.disconnectCall}><CallEndIcon /></IconButton>
			<IconButton onClick={toggleMic}>
			{
				isMicOn ?
				<MicIcon /> :
				<MicOffIcon />
			}
			</IconButton>
		</div>
	);
}

interface ToolbarProps {
	disconnectCall: () => void;
	toggleMicInCall: (value: boolean) => Promise<boolean>;
}