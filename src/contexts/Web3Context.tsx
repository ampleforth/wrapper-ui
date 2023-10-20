import Onboard from '@web3-onboard/core';
import { init } from '@web3-onboard/react';
import walletConnectModule from '@web3-onboard/walletconnect';
import injectedModule from '@web3-onboard/injected-wallets';
import coinbaseWalletModule from '@web3-onboard/coinbase';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getDefaultProvider, BrowserProvider, Signer } from 'ethers';
import { Provider as MulticallProvider } from 'ethers-multicall';
import { Network } from '../config';

const INFURA_PROJECT_ID = 'dee1a87a734042fcabc2fd116a7b776d';
const INFURA_ENDPOINT = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
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

// class Provider extends BrowserProvider {}

// const Web3Context = createContext<{
//   address?: string
//   wallet: Wallet | null
//   onboard?: API
//   provider: Provider | null
//   multicallProvider: MulticallProvider | null
//   defaultProvider: BrowserProvider
//   signer?: Signer
//   selectWallet:() => Promise<boolean>
//   disconnectWallet:() => Promise<boolean>
//   ready: boolean
//     }>({
//       selectWallet: async () => false,
//       disconnectWallet: async () => false,
//       ready: false,
//       wallet: null,
//       provider: null,
//       multicallProvider: null,
//       defaultProvider: getDefaultProvider(),
//     });

// interface Subscriptions {
//   wallet: (wallet: Wallet) => void
//   network: (networkId: number) => void
//   address: React.Dispatch<React.SetStateAction<string | undefined>>
// }

export default init({
  wallets: SUPPORTED_WALLETS,
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: INFURA_ENDPOINT,
    },
  ],
  appMetadata: {
    name: 'Wrap Ampleforth',
    description: 'Wrap and Unwrap Ampl into/from WAMPL',
  },
});

// type Props = {
//   children?: React.ReactNode;
// };

// const defaultProps: Props = {
//   children: null,
// };

// const Web3Provider: React.FC = ({ children }: Props) => {
//   const [address, setAddress] = useState<string>();
//   const [wallet, setWallet] = useState<Wallet | null>(null);
//   const [onboard, setOnboard] = useState<API>();
//   const [provider, setProvider] = useState<Provider | null>(null);
//   const [multicallProvider, setMulticallProvider] = useState<MulticallProvider | null>(null);
//   const [networkId, setNetworkId] = useState<number>(Network.Mainnet);
//   const [defaultProvider] = useState<BrowserProvider>(getDefaultProvider());
//   const [signer, setSigner] = useState<Signer>();
//   const [ready, setReady] = useState(false);

//   const updateWallet = useCallback((newWallet: Wallet) => {
//     setWallet(newWallet);
//     if (newWallet && newWallet.name) localStorage.setItem('selectedWallet', newWallet.name);
//     const ethersProvider = new Provider(newWallet.provider, 'any');
//     ethersProvider.on('network', (newNetwork, oldNetwork) => {
//       // When a Provider makes its initial connection, it emits a "network"
//       // event with a null oldNetwork along with the newNetwork. So, if the
//       // oldNetwork exists, it represents a changing network
//       if (oldNetwork) {
//         window.location.reload();
//         // setNetworkId(newNetwork.chainId);
//         // updateWallet(newWallet);
//       }
//     });
//     const rpcSigner = ethersProvider.getSigner();
//     const localMulticallProvider = new MulticallProvider(ethersProvider);
//     setSigner(rpcSigner);
//     setProvider(ethersProvider);
//     localMulticallProvider.init().then(() => {
//       setMulticallProvider(localMulticallProvider);
//     });
//   }, []);

//   useEffect(() => {
//     const onboardAPI = initOnboard(networkId, {
//       address: setAddress,
//       wallet: (w: Wallet) => {
//         if (w?.provider?.selectedAddress) {
//           updateWallet(w);
//         } else {
//           setProvider(null);
//           setWallet(null);
//         }
//       },
//       network: (newNetworkId: number) => {
//         if (newNetworkId !== networkId && newNetworkId in Network) {
//           setNetworkId(newNetworkId);
//         }
//       },
//     });
//     setOnboard(onboardAPI);
//   }, [networkId, updateWallet]);

//   const selectWallet = async (): Promise<boolean> => {
//     if (!onboard) return false;
//     const walletSelected = await onboard.walletSelect();
//     if (!walletSelected) return false;
//     const isReady = await onboard.walletCheck();
//     setReady(isReady);
//     if (isReady) updateWallet(onboard.getState().wallet);
//     return isReady;
//   };

//   useEffect(() => {
//     (async () => {
//       const previouslySelectedWallet = localStorage.getItem('selectedWallet');
//       if (previouslySelectedWallet && onboard) {
//         const walletSelected = await onboard.walletSelect(previouslySelectedWallet);
//         setReady(walletSelected);
//       } else {
//         await selectWallet();
//       }
//     })();
//   }, [onboard]);

//   const disconnectWallet = async (): Promise<boolean> => {
//     if (!onboard) return false;
//     onboard.walletReset();
//     localStorage.removeItem('selectedWallet');
//     await selectWallet();
//     return true;
//   };

//   return (
//     <Web3Context.Provider
//       value={{
//         address,
//         wallet,
//         onboard,
//         provider,
//         multicallProvider,
//         signer,
//         selectWallet,
//         disconnectWallet,
//         ready,
//         defaultProvider,
//       }}
//     >
//       {children}
//     </Web3Context.Provider>
//   );
// };

// Web3Provider.defaultProps = defaultProps;

// export { Web3Provider };

// export default Web3Context;
