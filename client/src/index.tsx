import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/css/style.css';

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from, useQuery, useLazyQuery } from '@apollo/client';
import config from './config';
import { onError } from '@apollo/client/link/error';
import { message, Spin } from 'antd';

const httpLink = new HttpLink({
  uri: `${config.SERVER_BASE_URL}/graphql`,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message: messageData }) => {
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

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
