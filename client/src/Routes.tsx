import React, { useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SideBar } from './components/SideBar';
import { TopNavBar } from './components/TopNavBar';
import { Header } from './components/Header';
import { Me } from './types';

type Props = {
  me: null | Me;
};

const { Sider, Content } = Layout;

const Routes = ({ me }: Props): JSX.Element => {
  const isLoggedIn = !!me;
  const email = me?.email || null;
  const isAdmin = me?.isAdmin || null;
  const picture = me?.picture || null;

  const [isCollapse, setIsCollapse] = useState(true);

  return (
    <Router>
      <Switch>
        <Route>
          <Layout style={{ minHeight: '130vh', overflow: 'hidden' }}>
            {isLoggedIn && (
              <>
                <Sider
                  onMouseEnter={() => setIsCollapse(false)}
                  onMouseLeave={() => setIsCollapse(true)}
                  style={{ overflow: 'hidden' }}
                  collapsible
                  collapsed={isCollapse}
                  onCollapse={(collapse) => setIsCollapse(collapse)}
                >
                  <SideBar email={email} isAdmin={isAdmin} />
                </Sider>
                <Layout className="site-layout">
                  <TopNavBar email={email} picture={picture} />
                  <Content
                    style={{ padding: '0 24px' }}
                    className={isLoggedIn ? 'flex flex-dir-c flex-ai-c' : 'flex flex-dir-c flex-jc-c flex-ai-c'}
                  >
                    <Switch>
                      {isLoggedIn && (
                        <>
                          <Route path="/workspace" component={() => <div>Hello world</div>}></Route>
                          <Redirect to="/workspace" />
                        </>
                      )}
                    </Switch>
                  </Content>
                </Layout>
              </>
            )}
            {!isLoggedIn && <Redirect to="/home" />}
            {/* <Header email={email} /> */}
            <Route path="/home">
              {/* <HomePage /> */}
              <HomePage email={email} />
            </Route>
          </Layout>
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
