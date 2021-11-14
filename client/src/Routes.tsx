import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const Routes = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route path="/homepage" />
        <Route path="/workspace" />
      </Switch>
    </Router>
  );
};

export default Routes;
