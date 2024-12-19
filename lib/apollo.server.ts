import pkg from '@apollo/client';
const { ApolloClient, InMemoryCache, createHttpLink } = pkg;
import config from '@/config';
export function getApolloClient(request: Request) {
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: createHttpLink({
      uri: config.SERVER_URL,
      headers: {
        ...Object.fromEntries(request.headers),
      },
      credentials: request.credentials ?? "include",
    }),
  });
  return client;
}