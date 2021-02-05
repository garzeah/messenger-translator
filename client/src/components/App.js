import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Messenger from "../pages/Messenger";
import history from "../history";
import "./App.css";

const App = () => {
	return (
		<div className="App">
			<Router history={history}>
				<Switch>
					<Route exact path="/" component={Register} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/Messenger" component={Messenger} />
				</Switch>
			</Router>
		</div>
	);
};

export default App;
