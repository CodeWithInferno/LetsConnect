// lib/apollo-client.js
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000", // Your GraphQL server URL
  cache: new InMemoryCache(), // Apollo's caching mechanism
});

export default client;
