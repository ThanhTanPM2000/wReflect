import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/css/style.css';

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from, useQuery, useLazyQuery } from '@apollo/client';
import config from './config';
import { onError } from '@apollo/client/link/error';
import { message, Spin } from 'antd';
import { Team } from './types';

const httpLink = new HttpLink({
  uri: `${config.SERVER_BASE_URL}/graphql`,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message: messageData, extensions }) => {
      if (extensions.code === '404') return;
      message.error(`${messageData}`);
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({
    addTypename: true,
    resultCaching: true,
    typePolicies: {
      Query: {
        fields: {
          team: {
            read(_, { args, toReference }) {
              return toReference({
                __typename: 'Team',
                id: args?.teamId,
              });
            },
          },
          // teams: {
          //   read(existing, { args }) {
          //     const data = existing && existing.slice(args?.offset, args?.offset + args?.limit);
          //     console.log('list data is', data, args);
          //     return data;
          //   },
          // },
        },
      },
    },
  }),
  link: from([errorLink, httpLink]),
});

ReactDOM.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
