import React, { useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { HomePage } from './scenes/HomePage';
import { TopNavBar } from './scenes/TopNavBar';
import { SideBar } from './scenes/SideBar';
import { Me } from './types';

type Props = {
  me: null | Me;
};

const { Sider, Content } = Layout;

const Routes = ({ me }: Props): JSX.Element => {
  const isLoggedIn = !!me;
  const email = me?.email || null;
  const isAdmin = me?.isAdmin || null;

  const [isCollapse, setIsCollapse] = useState(true);

  return (
    <Router>
      <Switch>
        <Route>
          <TopNavBar email={email} />
          <Layout style={{ minHeight: '90vh', overflow: 'hidden' }}>
            {isLoggedIn && (
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
            )}
            <Layout className="site-layout">
              <Content
                style={{ padding: '0 24px' }}
                className={isLoggedIn ? 'flex flex-jc-c' : 'flex flex-jc-c flex-ai-c'}
              >
                <Switch>
                  {isLoggedIn && <Route path="/teams" component={TopNavBar}></Route>}
                  <Route path="/home">
                    <HomePage />
                  </Route>
                  {!isLoggedIn && <Redirect to="/home" />}
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Route>
        <Route path="/" component={HomePage} />
        <Route path="/workspace" />
      </Switch>
    </Router>
  );
};

export default Routes;
