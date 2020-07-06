import React from 'react';
import './App.css';
import { VideoCallRoom } from './components/videoCallRoom';
import {
	BrowserRouter as Router,
	Switch,
	Route,  
	Redirect
} from "react-router-dom";
import { JoinCreateRoom } from './components/joinCreateRoom';

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path="/room/*"><VideoCallRoom /></Route>
					<Route path="/home"><JoinCreateRoom /></Route>

					<Redirect from="/" to="/home" />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
