import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export function useNotificationHook(initialValue: boolean = false) {
	const [isOpen, setIsOpen] = useState(initialValue);
	function handleClose() {
		setIsOpen(false);
	}

	return {isNotificationOpen: isOpen, closeNotification: handleClose};
}

export function NotificationOuterComponent(config: NotificationConfig) {
	const location: locationInterface = (config.location !== undefined ? config.location : {vertical: 'top', horizontal: 'right'});		
	return function NotificationComponent(props: NotificationComponentProps) {
		return (
			<Snackbar anchorOrigin={location} open={props.isOpen} autoHideDuration={6000} onClose={config.handleClose}>
				<MuiAlert elevation={6} variant='filled' onClose={config.handleClose} severity={config.severity}>
					{config.message}
				</MuiAlert>
			</Snackbar>
		);
	}
}

interface NotificationConfig {
	severity: 'success'|'info'|'warning'|'error';
	message: string;
	location?: locationInterface;
	handleClose: () => void;
}

interface locationInterface {
	vertical: 'top'|'bottom';
	horizontal: 'left'|'right'|'center';
}

interface NotificationComponentProps {
	isOpen: boolean;
}