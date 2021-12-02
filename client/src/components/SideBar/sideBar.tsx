import React, { useState } from 'react';
import { Menu, Tabs, Layout } from 'antd';
import { useLocation } from 'react-router-dom';

import { Logout } from '../Logout';

import {
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  PieChartOutlined,
  StockOutlined,
  TeamOutlined,
  CarryOutOutlined,
  HomeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { TabPane } = Tabs;
const { SubMenu } = Menu;

type Props = {
  email: null | string;
  isAdmin: null | boolean;
};

const SideBar = ({ email, isAdmin }: Props) => {
  const location = useLocation();
  const [isCollapse, setIsCollapse] = useState(true);

  return (
    <>
      {email && (
        <Sider
          className="sidebar"
          onMouseEnter={() => setIsCollapse(false)}
          onMouseLeave={() => setIsCollapse(true)}
          collapsed={isCollapse}
          onCollapse={(collapse) => setIsCollapse(collapse)}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item icon={<HomeOutlined />} key="/WorkSpace">
              <span>Home</span>
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
            <Menu.Item style={{ alignContent: "end"}} key="7" icon={<LogoutOutlined />}>
              <Logout>
                <>Sign out</>
              </Logout>
            </Menu.Item>
          </Menu>
        </Sider>
      )}
      {/* </Sider> */}
    </>
  );
};

export default SideBar;
