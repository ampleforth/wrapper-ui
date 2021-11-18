import React, { createContext, useContext } from 'react';
import { ApolloProvider } from '@apollo/client';
import Web3Context from './Web3Context';
import { Network } from '../config';
import { client } from '../queries/client';

const SubgraphContext = createContext<{}>({});

export type SubgraphContextProps = {
  children?: React.ReactNode;
};

const defaultProps: SubgraphContextProps = {
  children: null,
};

const SubgraphProvider: React.FC<SubgraphContextProps> = ({
  children,
}: SubgraphContextProps) => {
  const { provider } = useContext(Web3Context);
  return (
    <ApolloProvider client={client(provider?.network?.chainId || Network.Mainnet)}>
      {children}
    </ApolloProvider>
  );
};

SubgraphProvider.defaultProps = defaultProps;

export { SubgraphProvider };

export default SubgraphContext;
