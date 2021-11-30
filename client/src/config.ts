// const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_RESPONSE_TYPE, SERVER_BASE_URL, REDIRECT_URI } = window.test2;
// const config = {
//   AUTH0_WEBAUTH_CONFIG: {
//     domain: AUTH0_DOMAIN,
//     clientID: AUTH0_CLIENT_ID,
//     responseType: AUTH0_RESPONSE_TYPE,
//     redirectUri: REDIRECT_URI,
//   },
//   SERVER_BASE_URL: SERVER_BASE_URL,
// };

const config = {
  AUTH0_WEBAUTH_CONFIG: {
    domain: 'dev-m0ubghav.us.auth0.com',
    clientID: '0zjlxvwKZX46iUQYc0ArIqE29oqvHuSL',
    responseType: 'code',
    redirectUri: 'https://localhost:3000/home',
  },
  SERVER_BASE_URL: 'http://localhost:4000',
};

export default config;
