import React from 'react';
import { Avatar, Layout, Dropdown } from 'antd';

type Props = {
  email: string | null;
  picture: string | null;
};

const { Header } = Layout;

const TopNavBar = ({ email, picture }: Props) => {
  return (
    <>
      {/* <div className="topNavBar">
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <img height="50px" src="/logo.png" alt="wReflect Logo" />{' '}
          </div>
          <div style={{ flexGrow: 1, textAlign: 'right' }}>
            <Avatar src={picture} size="large" />
          </div>
        </div>
      </div> */}
      <Header className="site-layout-background topNavBar" style={{ padding: 0, backgroundColor: '#fff' }}>
        <div style={{ textAlign: 'right' }}>
          <>
            <span style={{ marginRight: '4px' }}>Hi, {`${email}`}</span>
            <Avatar className="avatarSetting" src={`${picture}`} size="default" />
          </>
        </div>
      </Header>
    </>
  );
};

export default TopNavBar;
