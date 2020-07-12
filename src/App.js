import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "pages/HomePage";
import SignInPage from "pages/SignInPage";
import SignPage from "pages/SignPage";
export default function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/sign" component={SignPage} />
          <Route exact path="/sign-in" component={SignInPage} />
        </Switch>
      </Router>
  );
}
