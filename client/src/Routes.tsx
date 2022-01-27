import React from 'react';
import { Layout } from 'antd';
import { Router, Switch, Redirect, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { HomePage } from './pages/HomePage';
import { SideBar } from './components/SideBar';
import { User } from './types';
import { Team } from './pages/TeamPage';
import { ManageMembers } from './pages/ManageMembersPage';
import { Board } from './pages/BoardPage';
import { AccountSetting } from './pages/AccountSettingPage';
import { UserManagements } from './components/UserManagements';
import { ProfileUser } from './pages/ProfileUserPage';
import { NotFound } from './pages/NotFoundPage';
import { ManageBoardPage } from './pages/ManageBoardPage';
import { Footer } from 'antd/lib/layout/layout';
import TeamDetail from './pages/TeamDetailPage/teamDetail';

type Props = {
  me: null | User;
};

const { Content } = Layout;
const customHistory = createBrowserHistory();

const Routes = ({ me }: Props) => {
  const isLoggedIn = !!me;
  const email = me?.email || null;
  const isAdmin = me?.isAdmin || null;
  const picture = me?.picture || null;

  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Router history={customHistory}>
        <Switch>
          {isLoggedIn ? (
            <>
              <SideBar email={email} isAdmin={isAdmin} />
              <Layout className="site-layout">
                {/* <TopNavBar email={email} picture={picture} /> */}
                <Content className="flex flex-1" style={{ margin: '10px 16px', gap: '10px', overflow: 'auto' }}>
                  <Switch>
                    {/* <Route exact path="/" component={Team} /> */}
                    {isAdmin ? (
                      <Switch>
                        <Route path="/user-managements" component={UserManagements} />
                        <Redirect to="/user-managements" />
                      </Switch>
                    ) : (
                      <Switch>
                        <Route path="/teams" exact component={Team} />
                        <>
                          <Switch>
                            <Route
                              path="/manage-members/:teamId"
                              render={({ match }) => <ManageMembers teamId={match.params.teamId} />}
                            />
                            <Route
                              path="/board/:teamId/:boardId"
                              render={({ match }) => (
                                <Board teamId={match.params.teamId} boardId={match.params.boardId} />
                              )}
                            />
                            <Route
                              path="/team-details/:teamId"
                              render={({ match }) => <TeamDetail teamId={match.params.teamId} />}
                            />
                            <Route path="/me" component={ProfileUser} />
                            <Route path="/account" component={AccountSetting} />
                            <Route
                              path="/manage-board/:teamId"
                              render={({ match }) => <ManageBoardPage teamId={match.params.teamId} />}
                            />
                            <Redirect from="/" exact to="/teams" />
                            <Route path="/not-found" component={NotFound} />
                            <Redirect to="/not-found" />
                          </Switch>
                        </>
                      </Switch>
                    )}
                  </Switch>
                </Content>
                <Footer>
                  <span>wReflect ©2022</span>
                </Footer>
              </Layout>
            </>
          ) : (
            <Switch>
              <Route path="/" component={() => <HomePage email={email} picture={picture} />} />
              <Redirect to="/" />
            </Switch>
          )}
        </Switch>
      </Router>
    </Layout>
  );
};

export default Routes;
