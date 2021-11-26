/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './Navbar.css';
import { Layout, Menu, Breadcrumb, Row } from 'antd';
import Logo1 from '../../image/logo1.png';
import {
  BarChartOutlined,
  SettingOutlined,
  PieChartOutlined,
  StockOutlined,
  TeamOutlined,
  CarryOutOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

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
        <Sider
          onMouseLeave={() => {
            onCollapse(true);
          }}
          onMouseEnter={() => {
            onCollapse(false);
          }}
          collapsed={collapsed}
          onCollapse={onCollapse}
        >
          {/* <div className="logo" /> */}
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item>
              <img src={Logo1} style={{ height: '45px', width: '150px' }} alt="logo-wreflect" />
            </Menu.Item>
            <SubMenu key="sub1" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="3" icon={<PieChartOutlined />}>
                Board
              </Menu.Item>
              <Menu.Item key="4" icon={<StockOutlined />}>
                Health Check
              </Menu.Item>
              <Menu.Item key="5" icon={<CarryOutOutlined />}>
                Task
              </Menu.Item>
              <Menu.Item key="6" icon={<CalendarOutlined />}>
                Manager
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="1" icon={<BarChartOutlined />}>
              Analyst
            </Menu.Item>
            <Menu.Item key="2" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 10 }} />
          <Content style={{ margin: '0 16px', height: '55px' }}>
            <Breadcrumb style={{ margin: '16px 0', textAlign: 'center' }}>
              <Breadcrumb.Item>WorkSpace</Breadcrumb.Item>
              <Breadcrumb.Item>My Portfolio</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 600 }}>
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
