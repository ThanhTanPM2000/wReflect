import React from 'react';
import { Layout } from 'antd';
import { Router, Switch, Redirect, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { HomePage } from './pages/HomePage';
import { SideBar } from './components/SideBar';
import { Header } from './components/Header';
import { Me } from './types';
import { newMember } from './pages/NewMember/newMember';
import { Team } from './pages/TeamPage';
import { TopNavBar } from './components/TopNavBar';
import TeamDetail from './pages/TeamDetailPage/teamDetail';
import { ProfileUser } from './components/ProfileUser';
import { DashBoard } from './components/DashBoard';
import { UserManagements } from './components/UserManagements';

import workspaces from './store/workspaces';

type Props = {
  me: null | Me;
};

const { Footer, Content } = Layout;
const customHistory = createBrowserHistory();

const Routes = ({ me }: Props): JSX.Element => {
  const isLoggedIn = !!me;
  const email = me?.email || null;
  const isAdmin = me?.isAdmin || null;
  const name = me?.name || null;
  const picture = me?.picture || null;

  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Router history={customHistory}>
        <Switch>
          {!isLoggedIn ? (
            <>
              <Route path="/" component={() => <HomePage email={email} picture={picture} />} />
              {/* <HomePage /> */}
              {/* </Route> */}
              <Redirect to="/" />
            </>
          ) : (
            <Route path="/">
              <SideBar email={email} isAdmin={isAdmin} />
              <Layout className="site-layout">
                <TopNavBar email={email} picture={picture} />
                <Content style={{ margin: '10px 16px', height: '100%', overflow: 'auto' }}>
                  <Switch>
                    <>
                      {isAdmin ? (
                        <>
                          <Route path="/dashboard" component={DashBoard} />
                          <Route path="/user-managements" component={UserManagements} />
                          <Redirect to="/user-managements" />
                        </>
                      ) : (
                        <>
                          <Route exact path="/" component={Team} />
                          <Route path="/teams" exact component={Team} />
                          <Route
                            path="/teams/:id"
                            render={({ match }) => <TeamDetail teamId={parseInt(match.params.id)} />}
                          />
                          <Route
                            path="/profileUser"
                            component={() => <ProfileUser email={email} picture={picture} name={name} />}
                          />
                          <Redirect from="/" exact to="/teams" />
                        </>
                      )}
                    </>
                  </Switch>
                </Content>
                <Footer style={{ textAlign: 'center', padding: '0 0' }}>wReflect ©2022</Footer>
              </Layout>
            </Route>
          )}
          {/* <Header email={email} /> */}
        </Switch>
      </Router>
    </Layout>
  );
};

export default Routes;
