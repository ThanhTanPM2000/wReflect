import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import WorkSpace from './pages/WorkSpace';
import HomePage from './pages/HomePage';

const App = (): JSX.Element => {
  return (
    <>
      <Router>
        <HomePage />
        <WorkSpace />
      </Router>
    </>
  );
};

export default App;
