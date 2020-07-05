import React from 'react';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "pages/HomePage";

export default function App() {
  return (
    <Container maxWidth="sm">
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
        </Switch>
      </Router>
    </Container>
  );
}
