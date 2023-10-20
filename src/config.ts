import { Token } from '@uniswap/sdk-core';

// Sentinel address for native ETH
export const NATIVE_ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

/* eslint-disable no-unused-vars */
export enum Network {
  Mainnet = 1,
  Kovan = 42,
}

export const enum Asset {
  ETH,
  USDT,
  AMPL,
  WETH,
  WBTC,
  aAMPL,
  bETH,
  bBTC,
  ubAAMPL,
  ubAMPL,
  WAMPL,
}

export enum Wrapper {
  button='button',
  unbutton='unbutton',
}

export const enum WrapDirection {
  wrapping='wrapping',
  unwrapping='unwrapping'
}

export const assetPairs: { [key in Wrapper]: Asset[][] } = {
  [Wrapper.button]: [
    [Asset.ETH, Asset.bETH],
    [Asset.WETH, Asset.bETH],
    [Asset.WBTC, Asset.bBTC],
  ],
  [Wrapper.unbutton]: [
    [Asset.AMPL, Asset.WAMPL],
  ],
};

const SUBGRAPH_BASE_URI = 'https://api.thegraph.com/subgraphs/name';

type GraphConfig = {
  trancheUri: string;
  uniswapUri: string;
}

export type NetworkConfig = {
  network: {
    name: string;
    chainId: number;
    networkId: number;
  };
  assets: Partial<Record<Asset, Token>>,
  wrapperRouters: {
      // some assets need to go through custom adapter for deposit / withdraw
      // i.e. native assets like ETH need to be wrapped to WETH before depositing
      // map input / output token addresses to deposit / withdraw router address
      [key: string]: string;
  };
  pairs: Map<Wrapper, Map<WrapDirection, Map<Token, Token>>>;
  graph: GraphConfig;
}

export type Config = {
  [key in Network]: NetworkConfig;
}

const config: Config = {
  [Network.Mainnet]: {
    network: {
      name: 'mainnet',
      chainId: 1,
      networkId: 1,
    },
    assets: {
      [Asset.ETH]: new Token(1, NATIVE_ETH_ADDRESS, 18, 'ETH', 'Ether'),
      [Asset.USDT]: new Token(1, '0xdac17f958d2ee523a2206206994597c13d831ec7', 6, 'USDT', 'Tether'),
      [Asset.AMPL]: new Token(1, '0xd46ba6d942050d489dbd938a2c909a5d5039a161', 9, 'AMPL', 'Ampleforth'),
      [Asset.WETH]: new Token(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18, 'WETH', 'Wrapped Ether'),
      [Asset.WBTC]: new Token(1, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 8, 'WBTC', 'Wrapped BTC'),
      [Asset.aAMPL]: new Token(1, '0x1e6bb68acec8fefbd87d192be09bb274170a0548', 9, 'aAMPL', 'Aave interest bearing AMPL'),
      [Asset.bETH]: new Token(1, '0x125c7b36bea62ba3266257521667154446412921', 18, 'bETH', 'Button ETH'),
      [Asset.bBTC]: new Token(1, '0x69d4d3629e1aFEE0C4E75B6B345B482979A77112', 8, 'bBTC', 'Button BTC'),
      [Asset.ubAAMPL]: new Token(1, '0xF03387d8d0FF326ab586A58E0ab4121d106147DF', 18, 'ubAAMPL', 'Unbuttoned AAVE AMPL'),
      [Asset.WAMPL]: new Token(1, '0xEDB171C18cE90B633DB442f2A6F72874093b49Ef', 18, 'WAMPL', 'Wrapped Ampleforth'),
    },
    pairs: new Map(),
    graph: {
      trancheUri: `${SUBGRAPH_BASE_URI}/marktoda/tranche`,
      uniswapUri: `${SUBGRAPH_BASE_URI}/Uniswap/uniswap-v3-subgraph`,
    },
    wrapperRouters: {
      [NATIVE_ETH_ADDRESS]: '0xB08c5e2E8E73d0FB9842171496B2da04E8E80A0D',
    },
  },
  [Network.Kovan]: {
    network: {
      name: 'kovan',
      chainId: 42,
      networkId: 42,
    },
    assets: {
      [Asset.ETH]: new Token(1, NATIVE_ETH_ADDRESS, 18, 'ETH', 'Ether'),
      [Asset.USDT]: new Token(42, '0xaff4481d10270f50f203e0763e2597776068cbc5', 18, 'USDT', 'Tether'),
      [Asset.AMPL]: new Token(42, '0x3e0437898a5667a4769b1ca5a34aab1ae7e81377', 9, 'AMPL', 'Ampleforth'),
      [Asset.WETH]: new Token(42, '0xd0a1e359811322d97991e03f863a0c30c2cf029c', 18, 'WETH', 'Wrapped Ether'),
      [Asset.WBTC]: new Token(42, '0xa0a5ad2296b38bd3e3eb59aaeaf1589e8d9a29a9', 8, 'WBTC', 'Wrapped BTC'),
      [Asset.aAMPL]: new Token(42, '0x3e0437898a5667a4769b1ca5a34aab1ae7e81377', 9, 'aAMPL', 'Aave interest bearing AMPL'),
      [Asset.bETH]: new Token(42, '0x80ee392d7f9fe19ccfdbc5365983e7fc4c68ca4e', 18, 'bETH', 'Button ETH'),
      [Asset.bBTC]: new Token(42, '0x414fec543d85f2ef95a98221ec214cec745862e0', 8, 'bBTC', 'Button BTC'),
      [Asset.ubAMPL]: new Token(42, '0xebb66682be59c7de222afd7e884c065b5f1ca9ca', 18, 'ubAMPL', 'Unbuttoned AMPL'),
    },
    pairs: new Map(),
    graph: {
      trancheUri: `${SUBGRAPH_BASE_URI}/marktoda/tranche`,
      uniswapUri: `${SUBGRAPH_BASE_URI}/marshallteach007/uniswapv3kovan`,
    },
    wrapperRouters: {
      [NATIVE_ETH_ADDRESS]: '0xd5A424b9132719B9E056858D2F3445a855Cfc476',
    },
  },
};

Object.values(config).forEach((networkConfig: NetworkConfig) => {
  Object.entries(assetPairs).forEach(([key, value]) => {
    const wrapper: Wrapper = Wrapper[key as keyof typeof Wrapper];
    const tokenPairs = value.map(
      (assetList: Asset[]) => assetList.map((asset) => networkConfig.assets[asset]),
    ).filter((tokenpair: (Token|undefined)[]) => tokenpair.every(
      (token) => token !== undefined,
    )) as [Token, Token][];
    const wrappingMap = new Map<Token, Token>(tokenPairs);
    const unwrappingMap = new Map<Token, Token>(
      tokenPairs.map((pair) => pair.reverse() as [Token, Token]),
    );

    const innerMap: Map<WrapDirection, Map<Token, Token>> = new Map([
      [WrapDirection.wrapping, wrappingMap],
      [WrapDirection.unwrapping, unwrappingMap],
    ]);

    networkConfig.pairs.set(wrapper, innerMap);
  });
});

export function getConfig(network: Network): NetworkConfig {
  console.log({network})
  return config[network];
}
