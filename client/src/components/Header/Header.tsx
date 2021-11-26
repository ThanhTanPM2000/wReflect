import React from 'react';
import './Header.css';

import LoginButton from '../Login/LoginButton';
import LogoutButton from '../Login/LogoutButton';

import Logo from '../../image/logo.png';

const Header = () => {
  return (
    <div className="header">
      <div className="menu">
        <div className="navbar">
          <img className="logo" src={Logo} alt="logo-wreflect" />
          <div className="nav-link">
            <a href="">Team</a>
            <a href="">Reflect</a>
            <a href="">Health&nbsp;Check</a>
            <a href="/WorkSpace">WorkSpace</a>
          </div>
          <div className="login">
            <LoginButton />
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
