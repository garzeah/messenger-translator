import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import "./App.css";

const App = () => {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/" component={Register} />
					<Route exact path="/login" component={Login} />
				</Switch>
			</Router>
		</div>
	);
};

export default App;
