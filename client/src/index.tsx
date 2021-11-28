import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/css/style.css';

ReactDOM.render(
  // // <Auth0Provider
  // //   domain="dev-m0ubghav.us.auth0.com"
  // //   clientId="0zjlxvwKZX46iUQYc0ArIqE29oqvHuSL"
  // //   redirectUri={window.location.origin}
  // // >
  //   <App />
  // </Auth0Provider>,
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
