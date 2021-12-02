import React, { useState, useEffect } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import config from './config';

import { Me } from './types';
import { setUpdateLoginState, user } from './apis';
import Routes from './Routes';

import 'antd/dist/antd.css';

const client = new ApolloClient({
  uri: `${config.SERVER_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});

const App = (): JSX.Element => {
  const [me, setMe] = useState<null | Me>(null);
  setUpdateLoginState((newMe: null | Me) => {
    setMe(newMe);
    localStorage.setItem('email', newMe?.email || '');
  });
  useEffect(() => {
    (async function () {
      await user.me();
    })();
  }, []);
  return (
    <ApolloProvider client={client}>
      <Routes me={me} />;
    </ApolloProvider>
  );
};

export default App;
