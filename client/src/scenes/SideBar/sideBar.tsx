import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

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
        <Menu theme="light" mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/connect">
            <Link to="/teams">Link WABA</Link>
          </Menu.Item>
        </Menu>
      )}
      {/* </Sider> */}
    </>
  );
};

export default SideBar;
