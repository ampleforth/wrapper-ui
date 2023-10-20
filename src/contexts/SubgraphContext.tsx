import React, { createContext } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useSetChain } from '@web3-onboard/react'
import { BrowserProvider } from 'ethers';
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
  const [{ connectedChain }] = useSetChain()
  return (
    <ApolloProvider
      client={client(
        connectedChain ? Number(connectedChain.id) as Network : Network.Mainnet)
      }
    >
      {children}
    </ApolloProvider>
  );
};

SubgraphProvider.defaultProps = defaultProps;

export { SubgraphProvider };

export default SubgraphContext;
