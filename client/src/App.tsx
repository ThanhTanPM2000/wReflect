import React, { useState } from 'react';

import { onError } from '@apollo/client/link/error';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';

import { User } from './types';
import { message, notification } from 'antd';
import config from './config';
import Routes from './Routes';
import { setUpdateLoginState, user } from './apis';
import SelfContext from './contexts/selfContext';

import './styles/less/ant.less';

const httpLink = new HttpLink({
  uri: `${config.SERVER_BASE_URL}/graphql`,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message: messageData }) => {
      // notification.error({
      //   message: `Notification`,
      //   description: message,
      //   placement: 'bottomLeft',
      // });
      message.error(`${messageData}`);
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({
    addTypename: true,
  }),
  link: from([errorLink, httpLink]),
});

const App = (): JSX.Element => {
  const [me, setMe] = useState<null | User>(null);
  const [constructor, setContructor] = useState(true);

  setUpdateLoginState((newMe: null | User) => {
    setMe(newMe);
    localStorage.setItem('email', newMe?.email || '');
  });

  if (constructor) {
    setContructor(false);
    (async function () {
      await user.me();
    })();
  }
  // useEffect(() => {}, []);
  return (
    <ApolloProvider client={client}>
      <SelfContext.Provider value={me}>
        <Routes me={me} />
      </SelfContext.Provider>
    </ApolloProvider>
  );
};

export default App;
