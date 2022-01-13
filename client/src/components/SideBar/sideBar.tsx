import React, { useState, useContext } from 'react';

import { Menu, Layout, Modal } from 'antd';
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
import { useQuery, useSubscription } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';

import { auth } from '../../apis';
import { BoardSubscription } from '../../grapql-client/subcriptions';
import selfContext from '../../contexts/selfContext';

const { Sider } = Layout;
const { SubMenu } = Menu;

type Props = {
  email: null | string;
  isAdmin: null | boolean;
};

const SideBar = ({ email, isAdmin }: Props) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const me = useContext(selfContext);

  const onClickLogout = () => {
    Modal.confirm({
      title: 'Are you sure want to sign out',
      centered: true,
      okText: 'Sign Out',
      cancelText: 'Cancel',
      onOk: async () => {
        auth.logout();
        window.location.reload();
      },
    });
  };

  // useSubscription<BoardSubscription.updateBoardResult, BoardSubscription.updateBoardVars>(
  //   BoardSubscription.updateBoard,
  //   {
  //     variables: {
  //       meId: me?.id,
  //     },
  //     onSubscriptionData: ({ client, subscriptionData: { data, loading } }) => {
  //       if (!loading && data?.updateBoard) {
  //         console.log('updated board', data.updateBoard);
  //         client.cache.modify({
  //           id: client.cache.identify(data.updateBoard),
  //           fields: {
  //             columns: () => {
  //               return data?.updateBoard.columns;
  //             },
  //           },
  //         });
  //       }
  //     },
  //   },
  // );

  return (
    <>
      {email && (
        <Sider
          className="sidebar"
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
                  <Menu.Item key="4" icon={<StockOutlined />}>
                    Health Check
                  </Menu.Item>
                  <Menu.Item key="5" icon={<CarryOutOutlined />}>
                    Task
                  </Menu.Item>
                </SubMenu>
                <Menu.Item icon={<UserOutlined />} key="account">
                  <Link to="/me">Account</Link>
                </Menu.Item>
              </>
            )}

            <Menu.Item onClick={() => onClickLogout()} style={{ marginTop: 'auto' }} key="10" icon={<LogoutOutlined />}>
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
