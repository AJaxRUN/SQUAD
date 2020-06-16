import React from 'react';
import './App.css';
import { VideoCallRoom } from './components/videoCallRoom';

import {
	BrowserRouter as Router,
	Switch,
	Route,  
	Link,
	Redirect
} from "react-router-dom";

import { Login } from './components/loginSignup/login'
function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
				<Route path="/login" render={() => <Login isAuthed={true} />}/>
				<Route path="/home" render={()=> <VideoCallRoom />} />        
				<Redirect from="/" to="/login" />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
