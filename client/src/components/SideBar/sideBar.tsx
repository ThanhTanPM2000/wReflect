import React, { useState, useContext } from 'react';

import { Menu, Layout, Modal, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { Logout } from '../Logout';

import {
  SettingOutlined,
  LogoutOutlined,
  StockOutlined,
  TeamOutlined,
  CarryOutOutlined,
  GoldOutlined,
  UsergroupDeleteOutlined,
  BarChartOutlined,
  UserOutlined,
  AimOutlined,
} from '@ant-design/icons';

import { auth } from '../../apis';
import selfContext from '../../contexts/selfContext';
import Avatar from 'antd/lib/avatar/avatar';

const { Sider } = Layout;
const { SubMenu } = Menu;

type Props = {
  email: null | string;
  isAdmin: null | boolean;
};

const SideBar = ({ isAdmin }: Props) => {
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

  return (
    <>
      {me && (
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
          <div className="flex flex-dir-r flex-ai-c flex-jc-c">
            <Tooltip title={me?.email} placement="left">
              <Avatar crossOrigin="use-credentials"    src={me?.picture} />
            </Tooltip>
          </div>
          <Menu className="flex flex-1" theme="dark" defaultSelectedKeys={['1']} mode="inline">
            {isAdmin ? (
              <>
                <Menu.Item key="2" icon={<BarChartOutlined />}>
                  <Link to="/dashboard">Dashboard</Link>
                </Menu.Item>
                {/* <Menu.Item key="3" icon={<UsergroupDeleteOutlined />}>
                  <Link to="/user-managements">User Managements</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<SettingOutlined />}>
                  Settings
                </Menu.Item> */}
              </>
            ) : (
              <>
                <Menu.Item style={{ marginTop: 20 }} icon={<GoldOutlined />} key="Teams">
                  <Link to="/teams">Teams</Link>
                </Menu.Item>
                {/* <Menu.Item icon={<AimOutlined />} key="actionTracker">
                  <Link to="/actions-tracker">Actions Tracker</Link>
                </Menu.Item> */}
                {/* <SubMenu className="flex-1" key="sub1" icon={<TeamOutlined />} title="Team">
                  <Menu.Item key="5" icon={<StockOutlined />}>
                    Health Check
                  </Menu.Item>
                  <Menu.Item key="6" icon={<CarryOutOutlined />}>
                    Task
                  </Menu.Item>
                </SubMenu> */}
                {/* <Menu.Item icon={<UserOutlined />} key="account">
                  <Link to="/me">Account</Link>
                </Menu.Item> */}
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
