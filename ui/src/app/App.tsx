import React from 'react';
import Nav from '../features/nav';
import {
	Switch,
	Route,
} from "react-router-dom";
import Pages from '../pages';
import './App.scss';

function App() {
  return (
    <div className="App bp3-dark">
		<Nav />
		<Switch>
			<Route path="/realms" component={Pages.Realms}></Route>
			<Route path="/groups" component={Pages.Groups}></Route>
			<Route path="/users" component={Pages.Users}></Route>
			<Route path="/roles" component={Pages.Roles}></Route>
			<Route path="/permissions" component={Pages.Permissions}></Route>
			<Route path="/policies" component={Pages.Policies}></Route>
			<Route path="/api-keys" component={Pages.Keys}></Route>
			<Route exact path="/" component={Pages.Realms}></Route>
		</Switch>
    </div>
  );
}

export default App;
