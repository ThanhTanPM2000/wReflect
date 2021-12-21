import React, { useState } from 'react';

import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { Logout } from '../Logout';

import {
  SettingOutlined,
  LogoutOutlined,
  PieChartOutlined,
  StockOutlined,
  TeamOutlined,
  CarryOutOutlined,
  TrophyOutlined,
  HomeOutlined,
  CalendarOutlined,
  UsergroupDeleteOutlined,
  BarChartOutlined,
  RollbackOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

type Props = {
  email: null | string;
  isAdmin: null | boolean;
};

const SideBar = ({ email, isAdmin }: Props) => {
  const [isCollapse, setIsCollapse] = useState(true);

  return (
    <>
      {email && (
        <Sider
          className="sidebar"
          onMouseEnter={() => setIsCollapse(false)}
          onMouseLeave={() => setIsCollapse(true)}
          collapsible
          collapsed={isCollapse}
          onCollapse={(collapse) => setIsCollapse(collapse)}
        >
          <div className="ant-layout-logo"></div>
          <Menu className="flex flex-1" theme="dark" defaultSelectedKeys={['1']} mode="inline">
            {isAdmin ? (
              <>
                <Menu.Item key="7" icon={<BarChartOutlined />}>
                  <Link to="/dashboard">Dashboard</Link>
                </Menu.Item>

                <Menu.Item key="8" icon={<UsergroupDeleteOutlined />}>
                  <Link to="/user-managements">User Managements</Link>
                </Menu.Item>
                <Menu.Item key="9" icon={<SettingOutlined />}>
                  Settings
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item icon={<TrophyOutlined />} style={{ marginTop: 20 }} key="Teams">
                  <Link to="/teams">Teams</Link>
                </Menu.Item>
                <SubMenu className="flex-1" key="sub1" icon={<TeamOutlined />} title="Team">
                  <Menu.Item icon={<TeamOutlined />} key="ManageMembers">
                    <Link to="/manage-members">Members</Link>
                  </Menu.Item>
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
                <Menu.Item icon={<UserOutlined />} key="account">
                  <Link to="/me">Account</Link>
                </Menu.Item>
              </>
            )}

            <Menu.Item style={{ marginBottom: '20px' }} key="10" icon={<LogoutOutlined />}>
              <Logout>
                <>Sign out</>
              </Logout>
            </Menu.Item>
          </Menu>
        </Sider>
      )}
    </>
  );
};

export default SideBar;
