import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Tags, TokenList, Version } from '@uniswap/token-lists';

const defaultTokenListUrl =
  'https://buttonwood-protocol.github.io/buttonwood-token-list/buttonwood.tokenlist.json';
const defaultWrapperMapUrl =
  'https://buttonwood-protocol.github.io/buttonwood-token-list/buttonwood.wrappermap.json';

export interface WrapperPair {
  readonly unwrapped: string;
  readonly wrapped: string;
}

export interface WrapperMap {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly wrappers: {
    button: WrapperPair[];
    unbutton: WrapperPair[];
  };
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}

const TokenListContext = createContext<{
  tokenList: TokenList | null;
  wrapperMap: WrapperMap | null;
  getLogoURI: (address: string) => string | null;
}>({
  tokenList: null,
  wrapperMap: null,
  getLogoURI: () => null,
});

type Props = {
  children?: React.ReactNode;
};

const defaultProps: Props = {
  children: null,
};

const fetchJson = async (url: string): Promise<any | null> => {
  try {
    const res = await fetch(url);
    return res.json();
  } catch (err) {
    return null;
  }
};

const TokenListProvider: React.FC = ({ children }: Props) => {
  const [tokenList, setTokenList] = useState<TokenList | null>(null);
  const [wrapperMap, setWrapperMap] = useState<WrapperMap | null>(null);

  useEffect(() => {
    Promise.all([fetchJson(defaultTokenListUrl), fetchJson(defaultWrapperMapUrl)]).then(
      ([freshTokenList, freshWrapperMap]: [TokenList | null, WrapperMap | null]) => {
        if (freshTokenList) {
          setTokenList(freshTokenList);
        }
        if (freshWrapperMap) {
          setWrapperMap(freshWrapperMap);
        }
      },
    );
  }, []);

  const getLogoURI = useCallback(
    (address: string): string | null =>
      tokenList?.tokens?.find((token) => token.address === address)?.logoURI || null,
    [tokenList],
  );

  return (
    <TokenListContext.Provider
      value={{
        tokenList,
        wrapperMap,
        getLogoURI,
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
};

TokenListProvider.defaultProps = defaultProps;

export { TokenListProvider };

export default TokenListContext;
