"use client";

import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { AUTH_TOKEN } from "@/constants";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { OperationDefinitionNode } from "graphql";

// HTTP link to the GraphQL server
const httpLink = new HttpLink({
  uri: "http://localhost:4000",
});

// Auth middleware to attach token
const authLink = setContext(
  (_, { headers }: { headers?: Record<string, string> }) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  }
);

// WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: () => ({
      authToken: localStorage.getItem(AUTH_TOKEN),
    }),
  },
});

// Split based on operation type
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query) as OperationDefinitionNode;
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Apollo Client instance
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
