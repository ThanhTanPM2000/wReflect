import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import HomeImage from '../image/image-body.png';

import Header from '../components/Header/Header';

const HomePage = () => {
  return (
    <Router>
      <Route path="/">
        <Header />
        <img src={HomeImage} alt="" />
      </Route>
    </Router>
  );
};

export default HomePage;
