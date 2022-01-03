import React from 'react';
import { Avatar, Layout } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import DropDown from './components/DropDown';
import { useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { useApolloClient } from '@apollo/client';
type Props = {
  email: string | null;
  picture: string | null;
};

const { Header } = Layout;

const TopNavBar = ({ email, picture }: Props) => {
  

  return (
    <>
      <Header style={{ paddingRight: '20px' }} className="topNavBar">
        <div className="flex-1">
          {/* <div style={{ flexGrow: 1 }} className="titleLogo">
            wReflect
          </div> */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ marginRight: '10px' }}>Hi, {`${email}`}</span>
            <Avatar className="avatarSetting" src={`${picture}`} size="default" />
          </div>
          {/* <div style={{ marginRight: 20 }}>
            <DropDown email={email} picture={picture} />
          </div> */}
        </div>
      </Header>
    </>
  );
};

export default TopNavBar;
