import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Messenger from "../pages/Messenger";
import "./App.css";

const App = () => {
	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Register} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/Messenger" component={Messenger} />
				</Switch>
			</BrowserRouter>
		</div>
	);
};

export default App;
