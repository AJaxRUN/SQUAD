import React from 'react'
import Home from './Components/Home/Home'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import CreatePortal from './Components/CreatePortal/CreatePortal'
import Room from './Components/Room/Room'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/createPortal" component={CreatePortal} />
          <Route exact path="/portal/:id" component={Room} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
