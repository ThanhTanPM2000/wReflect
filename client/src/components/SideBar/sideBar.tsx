import React from 'react';
import { Menu, Tabs } from 'antd';
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
  CalendarOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { SubMenu } = Menu;

type Props = {
  email: null | string;
  isAdmin: null | boolean;
};

const SideBar = ({ email, isAdmin }: Props) => {
  const location = useLocation();

  return (
    <>
      {/* <Sider className="site-layout-background"> */}
      {email && (
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item></Menu.Item>
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
          <Menu.Item style={{ alignSelf: 'bot' }} key="7" icon={<LogoutOutlined />}>
            <Logout>
              <>Sign out</>
            </Logout>
          </Menu.Item>
        </Menu>
      )}
      {/* </Sider> */}
    </>
  );
};

export default SideBar;
