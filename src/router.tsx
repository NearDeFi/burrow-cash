import { Redirect } from "react-router";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Borrow, Portfolio, Supply } from "./screens";

const AppRouter = () => {
	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/" render={() => <Redirect to="/supply" />} />
					<Route path="/supply" component={Supply} />
					<Route path="/borrow" component={Borrow} />
					<Route path="/portfolio" component={Portfolio} />
				</Switch>
			</div>
		</Router>
	);
};

export default AppRouter;
