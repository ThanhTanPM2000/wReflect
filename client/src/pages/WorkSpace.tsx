import React from 'react';
import Navbar from '../components/WorkSpace/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const WorkSpace = (): JSX.Element => {
  
  return (
    <>
        <Router>
            <Route path="/workspace" component={Navbar} />
        </Router>
     
    </>
  );
};

export default WorkSpace;
