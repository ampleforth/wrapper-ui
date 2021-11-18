import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getConfig, Network } from '../config';

// TODO: fetch current network from web3provider and use to determine proper uri
export const client = (network: Network) => new ApolloClient({
  uri: getConfig(network).graph.trancheUri,
  cache: new InMemoryCache(),
});

export const uniswapClient = (network: Network) => new ApolloClient({
  uri: getConfig(network).graph.uniswapUri,
  cache: new InMemoryCache(),
});
