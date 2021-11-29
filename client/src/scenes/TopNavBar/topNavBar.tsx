import React from 'react';
import { Menu, Dropdown, Button } from 'antd';

import { Login } from '../Login';
import { Logout } from '../Logout';

type Props = {
  email: null | string;
};

const LoginSection = ({ email }: Props) => {
  if (email) {
    const menu = (
      <Menu>
        <Menu.Item key="sign-out">
          <Logout>
            <>Sign out</>
          </Logout>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown placement="bottomRight" overlay={menu}>
        <Button type="text">{`Hello, ${email}`}</Button>
      </Dropdown>
    );
  }
  return (
    <Login isLoggedIn={!!email}>
      <Button>Login / Sign up</Button>
    </Login>
  );
};

const TopNavBar = ({ email }: Props) => {
  return (
    <div className="topNavBar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <div style={{ flexGrow: 1 }}>
          <img height="50px" src="/logo.png" alt="wReflect Logo" />{' '}
        </div>
        <div style={{ flexGrow: 1, textAlign: 'right' }}>
          <LoginSection email={email} />
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
