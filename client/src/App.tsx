import 'antd/dist/antd.css';
import React, { useState, useEffect } from 'react';
import { onError } from '@apollo/client/link/error';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';

import { Me } from './types';
import config from './config';
import Routes from './Routes';
import { setUpdateLoginState, user } from './apis';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  uri: `${config.SERVER_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
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
