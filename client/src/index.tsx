import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/css/style.css';

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from, split } from '@apollo/client';
import config from './config';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';
import { message } from 'antd';
import { getMainDefinition } from '@apollo/client/utilities';
import { Opinion, Team } from './types';

const httpLink = new HttpLink({
  uri: `${config.SERVER_BASE_URL}/graphql`,
  credentials: 'include',
});

const wsLink = new WebSocketLink({
  uri: `${config.SERVER_BASE_URL.replace('http', 'ws')}/graphql`,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message: messageData, extensions }) => {
      console.log(message);
      if (extensions?.code === '404') return;
      message?.error(`${messageData}`);
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
          teams: {
            merge: true,
          },
          team: {
            read(_, { args, toReference }) {
              console.log('data is', args);
              return toReference({
                __typename: 'Team',
                id: args?.teamId,
              });
            },
          },
          board: {
            read(_, { args, toReference }) {
              return toReference({
                __typename: 'Board',
                id: args?.boardId,
              });
            },
            merge: true,
          },
        },
      },
      Column: {
        fields: {
          opinions: {
            merge(existing = [], incoming: Opinion[]) {
              return [...incoming];
            },
          },
        },
      },
      Board: {
        fields: {
          team: {
            merge(existing: Team) {
              return existing ?? null;
            },
          },
        },
      },
    },
  }),
  link: from([errorLink, splitLink]),
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
