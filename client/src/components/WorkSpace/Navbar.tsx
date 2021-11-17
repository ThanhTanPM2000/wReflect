/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './Navbar.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { VideoCameraOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
    console.log(collapsed);
  };
  // collapsible collapsed={collapsed} onCollapse={onCollapse}
  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              Option 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              Option 2
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>WorkSpace</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              TNT
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>wReflect ©2022 </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Navbar;
