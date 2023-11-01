import Onboard from '@web3-onboard/core';
import { init } from '@web3-onboard/react';
import walletConnectModule from '@web3-onboard/walletconnect';
import injectedModule from '@web3-onboard/injected-wallets';
import coinbaseWalletModule from '@web3-onboard/coinbase';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getDefaultProvider, BrowserProvider, Signer } from 'ethers';
import { Network } from '../config';

export const ENDPOINT = 'https://eth-mainnet.g.alchemy.com/v2/msPtPlRdHn9GWMh7YJkZ4Vt1RmG5Moy2';

const WALLET_CONNECT_PROJECT_ID = '9cd51cf8d352a6ec2223b9a249097ae6';

const injected = injectedModule();
const coinbase = coinbaseWalletModule();
const walletConnect = walletConnectModule({
  version: 2,
  handleUri: (uri: string) => console.log(uri),
  projectId: WALLET_CONNECT_PROJECT_ID,
  requiredChains: [1],
});

const SUPPORTED_WALLETS = [injected, coinbase, walletConnect];

export default Onboard({
  wallets: SUPPORTED_WALLETS,
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: ENDPOINT,
    },
  ],
  appMetadata: {
    name: 'Wrap Ampleforth',
    description: 'Wrap and Unwrap Ampl into/from WAMPL',
    explore: 'https://wrap.ampleforth.org',
  },
});
