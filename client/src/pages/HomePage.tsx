import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginButton from '../components/Login/LoginButton';
import LogoutButton from '../components/Login/LogoutButton';
import Profile from '../components/Login/Profile';

const HomePage = () => {
  return (
    <Router>
      <Route path="/">
        <div>
          <LoginButton />
          <LogoutButton />
          <Profile />
        </div>
      </Route>
    </Router>
  );
};

export default HomePage;
