import {
	BrowserRouter as Router, Route, Switch
} from "react-router-dom";
import { Borrow, Supply } from "./screens";

const AppRouter = () => {
	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/" component={() => {return <div> Home </div>}} />
					<Route path="/supply" component={Supply} />
					<Route path="/borrow" component={Borrow} />
				</Switch>
			</div>
		</Router>
	);
}

export default AppRouter;

