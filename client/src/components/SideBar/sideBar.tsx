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
  GoldOutlined,
  CalendarOutlined,
  UsergroupDeleteOutlined,
  BarChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';

const { Sider } = Layout;
const { SubMenu } = Menu;

type Props = {
  email: null | string;
  isAdmin: null | boolean;
};

const SideBar = ({ email, isAdmin }: Props) => {
  const [isCollapse, setIsCollapse] = useState(true);

  const { data } = useQuery<TeamQueries.getTeamIdsResult>(TeamQueries.getTeamIds, {
    fetchPolicy: 'cache-first', // Used for first execution
    notifyOnNetworkStatusChange: true,
  });

  const teamId = data?.getTeamIds[0]?.id;
  const boardId = data?.getTeamIds[0]?.boards[0].id;

  return (
    <>
      {email && (
        <Sider
          className="sidebar"
          width={200}
          onMouseEnter={() => setIsCollapse(false)}
          onMouseLeave={() => setIsCollapse(true)}
          collapsible
          collapsed={isCollapse}
          onCollapse={(collapse) => setIsCollapse(collapse)}
        >
          <div className="ant-layout-logo flex flex-dir-r flex-ai-c ">
            <span style={{ marginLeft: '10px' }}>wR</span>
            <span className="title" style={isCollapse ? { opacity: 0 } : { opacity: 1, transition: '0.7s' }}>
              eflect
            </span>
          </div>
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
                <Menu.Item icon={<GoldOutlined />} style={{ marginTop: 20 }} key="Teams">
                  <Link to="/teams">Teams</Link>
                </Menu.Item>
                <SubMenu className="flex-1" key="sub1" icon={<TeamOutlined />} title="Team">
                  <Menu.Item icon={<TrophyOutlined />} key="TeamDetail">
                    <Link to={`/teams/${teamId}`}>Team Details</Link>
                  </Menu.Item>
                  <Menu.Item icon={<TeamOutlined />} key="ManageMembers">
                    <Link to={`/manage-members/${teamId}`}>Members</Link>
                  </Menu.Item>
                  <Menu.Item key="3" icon={<PieChartOutlined />}>
                    <Link to={`/board/${teamId}/${boardId}`}>Board</Link>
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
