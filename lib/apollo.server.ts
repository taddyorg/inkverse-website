import pkg from '@apollo/client';
const { ApolloClient, InMemoryCache, createHttpLink } = pkg;

export function getApolloClient(request: Request) {
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: createHttpLink({
      uri: 'http://localhost:3010/api/graphql',
      headers: {
        ...Object.fromEntries(request.headers),
      },
      credentials: request.credentials ?? "include",
    }),
  });
  return client;
}