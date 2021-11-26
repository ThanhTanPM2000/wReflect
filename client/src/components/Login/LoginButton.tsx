import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    <div className="sign-in">
      {!isAuthenticated && <a onClick={() => loginWithRedirect()}>Sign in</a>}
    </div>
  );
};

export default LoginButton;
