import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SideBar } from './components/SideBar';
import { Header } from './components/Header';
import { Me } from './types';
import { Team } from './pages/TeamPage';
import { TopNavBar } from './components/TopNavBar';
import TeamDetail from './components/TeamDetail/teamDetail';
import { ProfileUser } from './components/ProfileUser';
import { DashBoard } from './components/DashBoard';
import { UserManagements } from './components/UserManagements';
type Props = {
  me: null | Me;
};

const { Footer, Content } = Layout;

const Routes = ({ me }: Props): JSX.Element => {
  const isLoggedIn = !!me;
  const email = me?.email || null;
  const isAdmin = me?.isAdmin || null;

  const picture = me?.picture || null;

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
                  <Content
                    style={{ margin: '0 16px', height: '100%' }}
                    // className={isLoggedIn ? 'flex flex-dir-c flex-ai-c' : 'flex flex-dir-c flex-jc-c flex-ai-c'}
                  >
                    <Switch>
                      {isLoggedIn && (
                        <>
                          <Route path="/workspace" component={Team}></Route>
                          <Redirect to="/workspace" />
                        </>
                      )}
                    </Switch>
                    <Route path="/team-detail" component={TeamDetail} />
                    <Route path="/profileUser" component={ProfileUser}>
                      <ProfileUser email={email} picture={picture} />
                    </Route>
                    <Route path="/dashboard" component={DashBoard} />
                    <Route path="/user-Managements" component={UserManagements} />
                  </Content>
                  <Footer style={{ textAlign: 'center' }}>wReflect ©2022</Footer>
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
