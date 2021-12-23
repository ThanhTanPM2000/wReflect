import React from 'react';
import { Layout } from 'antd';
import { Router, Switch, Redirect, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { HomePage } from './pages/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SigupPage/signupPage';
import ForgotPassword from './pages/ForgotPassword/forgotPassword';
import { SideBar } from './components/SideBar';
import { Me } from './types';
import { Team } from './pages/TeamPage';
import { TopNavBar } from './components/TopNavBar';
import TeamDetail from './pages/TeamDetailPage/teamDetail';
import { AccountSetting } from './pages/AccountSettingPage';
import { DashBoard } from './components/DashBoard';
import { UserManagements } from './components/UserManagements';
import { ProfileUser } from './pages/ProfileUserPage';
import { NotFound } from './pages/NotFoundPage';

type Props = {
  me: null | Me;
};

const { Footer, Content } = Layout;
const customHistory = createBrowserHistory();

const Routes = ({ me }: Props): JSX.Element => {
  const isLoggedIn = !!me;
  const email = me?.email || null;
  const isAdmin = me?.isAdmin || null;
  const picture = me?.picture || null;

  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Router history={customHistory}>
        <Switch>
          {!isLoggedIn ? (
            <Switch>
              <Route path='/loginpage' component={LoginPage} />
              <Route path='/signuppage' component={SignUpPage} />
              <Route path='/forgotpassword' component={ForgotPassword}/>
              <Route path="/" component={() => <HomePage email={email} picture={picture} />} />
              <Redirect to="/" />
            </Switch>
          ) : (
            <>
              <SideBar email={email} isAdmin={isAdmin} />
              <Layout className="site-layout">
                <TopNavBar email={email} picture={picture} />
                <Content style={{ margin: '10px 16px', height: '100%', overflow: 'auto' }}>
                  <Switch>
                    {/* <Route exact path="/" component={Team} /> */}
                    {isAdmin ? (
                      <Switch>
                        <Route path="/dashboard" component={DashBoard} />
                        <Route path="/user-managements" component={UserManagements} />
                        <Redirect to="/user-managements" />
                      </Switch>
                    ) : (
                      <Switch>
                        <Route path="/teams" exact component={Team} />
                        <Route
                          path="/teams/:id"
                          render={({ match }) => <TeamDetail teamId={parseInt(match.params.id)} />}
                        />
                        <Route path="/me" component={ProfileUser} />
                        <Route path="/account" component={AccountSetting} />
                        <Redirect from="/" exact to="/teams" />
                        <Route path="/not-found" component={NotFound} />
                        <Redirect to="/not-found" />
                      </Switch>
                    )}
                  </Switch>
                </Content>
                <Footer style={{ textAlign: 'center', padding: '0 0' }}>wReflect ©2022</Footer>
              </Layout>
            </>
          )}
        </Switch>
      </Router>
    </Layout>
  );
};

export default Routes;
