import "regenerator-runtime/runtime";
import { Redirect } from "react-router";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Borrow, Portfolio, Supply, Terms, Privacy } from "./screens";
import { Layout } from "./components";

const App = () => {
  return (
    <Router>
      <Switch>
        <Layout>
          <Route exact path="/" render={() => <Redirect to="/supply" />} />
          <Route path="/supply" component={Supply} />
          <Route path="/borrow" component={Borrow} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
        </Layout>
      </Switch>
    </Router>
  );
};

export default App;
