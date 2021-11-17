import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <Auth0Provider
    domain="dev-m0ubghav.us.auth0.com"
    clientId="0zjlxvwKZX46iUQYc0ArIqE29oqvHuSL"
    redirectUri={window.location.origin} 
  >
    <App />
  </Auth0Provider>
  ,

  document.getElementById('root'),
);
