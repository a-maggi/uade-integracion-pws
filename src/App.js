import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "pages/HomePage";
import SignPage from "pages/SignPage";
export default function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/sign" component={SignPage} />
        </Switch>
      </Router>
  );
}
