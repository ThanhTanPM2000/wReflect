import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from '../components/Header/Header'

const HomePage = () => {
  return (
    <Router>
      <Route path="/">
        <Header />
      </Route>
    </Router>
  );
};

export default HomePage;
