import React from 'react';
import { Avatar, Layout } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import DropDown from './components/DropDown';
type Props = {
  email: string | null;
  picture: string | null;
};

const { Header } = Layout;

const TopNavBar = ({ email, picture }: Props) => {
  return (
    <>
      <Header className="topNavBar">
        <div className="flex flex-1 flex-dir-r flex-jc-sa">
          <div style={{ flexGrow: 1 }} className="titleLogo">
            wReflect
          </div>
          <div style={{ flexGrow: 1, textAlign: 'right', marginRight: 10 }}>
            <span style={{ marginRight: '4px' }}>Hi, {`${email}`}</span>
            <Avatar className="avatarSetting" src={`${picture}`} size="default" />
          </div>
          <div style={{ marginRight: 20 }}>
            <DropDown email={email} picture={picture} />
          </div>
        </div>
      </Header>
    </>
  );
};

export default TopNavBar;
