import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';

import { useQuery } from '@apollo/client';

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
import { getUsers } from './grapql-client/queries/UserQueries';

type Props = {
  me: null | Me;
};

const { Footer, Content } = Layout;

const Routes = ({ me }: Props): JSX.Element => {
  const isLoggedIn = !!me;
  const email = me?.email || null;
  const isAdmin = me?.isAdmin || null;
  const name = me?.name || null;
  const picture = me?.picture || null;

  const { data } = useQuery(getUsers);

  return (
    <Router>
      <Switch>
        <Route>
          <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
            {isLoggedIn && (
              <>
                <SideBar email={email} isAdmin={isAdmin} />
                <Layout className="site-layout">
                  <TopNavBar email={email} picture={picture} />
                  <Content style={{ margin: '10px 16px', height: '100%', overflow: 'auto' }}>
                    <Switch>
                      {isLoggedIn &&  (
                        <>
                          {isAdmin ? (
                            <>
                              <Route path="/dashboard" component={DashBoard} />
                              <Route path="/user-managements" component={UserManagements} />
                              <Redirect to="/user-managements" />
                            </>
                          ) : (
                            <>
                              <Route path="/workspace" component={Team}></Route>
                              <Redirect to="/workspace" />
                              <Route
                                exact
                                path="/teams/:id"
                                render={({ match }) => <TeamDetail teamId={parseInt(match.params.id)} />}
                              />
                              <Route path="/profileUser" component={ProfileUser}>
                                <ProfileUser email={email} picture={picture} name={name} />
                              </Route>
                            </>
                          )}
                        </>
                      )}
                    </Switch>
                    <Route exact path="/teams/:id" render={({ match }) => <TeamDetail teamId={parseInt(match.params.id)} />} />
                    <Route path="/profileUser" component={ProfileUser}>
                      <ProfileUser email={email} picture={picture} name={name} />
                    </Route>
                    <Route path="/dashboard" component={DashBoard} />
                    <Route path="/user-Managements" component={UserManagements} />
                  </Content>
                  <Footer style={{ textAlign: 'center', padding: '0 0' }}>wReflect ©2022</Footer>
                </Layout>
              </>
            )}
            {!isLoggedIn && <Redirect to="/home" />}
            {/* <Header email={email} /> */}
            <Route path="/home">
              {/* <HomePage /> */}
              <HomePage email={email} picture={picture} />
            </Route>
          </Layout>
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
