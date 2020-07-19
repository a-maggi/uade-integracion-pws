import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "pages/HomePage/index";
import SignInPage from "pages/SignInPage";
import SignPage from "pages/SignPage";
export default function App() {
  return (
      <Router>
        <Switch>
          <Route path="/panel" component={HomePage} />
          <Route exact path="/sign" component={SignPage} />
          <Route exact path="/login" component={SignInPage} />
        </Switch>
      </Router>
  );
}
