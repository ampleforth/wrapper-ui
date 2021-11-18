/* eslint-disable max-len */
import React, {
  createContext, useCallback, useContext, useEffect, useState,
} from 'react';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import { BigNumber } from 'ethers';
import Web3Context from './Web3Context';
import {
  balanceOfMulti,
  approveWrapping,
  buttonWrap,
  buttonWrapWithRouter,
  buttonUnwrap,
  buttonUnwrapWithRouter,
  unbuttonWrap,
  unbuttonUnwrap,
  wrapperToUnderlyingMulti,
  totalSupplyMulti,
} from '../transactions';
import {
  getConfig, Network, NetworkConfig, WrapDirection, Wrapper,
} from '../config';

// const INFURA_PROJECT_ID = 'c9958dc347184301bf8af58c68d5a18e'; // ToDo: Update with a real non-testing project ID
// const INFURA_ENDPOINT = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;

export enum ExchangeStep {
  start,
  approving,
  approved,
  exchanging,
  completed,
  error,
}

export type ExchangeProgress = {
  exchangeStep: ExchangeStep;
  reason: any;
  value: any;
}

export type ExchangeRatio = {
  from: BigNumber;
  to: BigNumber;
}

const ButtonContext = createContext<{
  buttonWrap:(underylingAmount: string, buttonToken: Token) => Promise<CurrencyAmount<Token>>,
  wrapper: Wrapper,
  wrapDirection: WrapDirection,
  flipWrapDirection: () => void,
  inputCurrencyList: Token[],
  inputCurrency: Token | null,
  setInputCurrency: (inputCurrency: Token | null) => void,
  inputAmount: BigNumber | null;
  setInputAmount: (inputAmount: BigNumber | null) => void;
  outputCurrency: Token | null,
  outputAmount: BigNumber | null;
  inputCurrencyBalance: BigNumber | null;
  outputCurrencyBalance: BigNumber | null;
  currentExchangeRatio: ExchangeRatio | null;
  exchangeProgress: ExchangeProgress;
  approve: () => void;
  exchange: () => void;
  reset: () => void;
    }>({
      // getTokenBalances: async (tokens: Token[]) => tokens.map((token) => CurrencyAmount.fromRawAmount(token, 0)),
      buttonWrap: () => Promise.reject(Error('Unitialized')),
      wrapper: Wrapper.button,
      wrapDirection: WrapDirection.wrapping,
      flipWrapDirection: () => {},
      inputCurrencyList: [],
      inputCurrency: null,
      setInputCurrency: () => {},
      inputAmount: null,
      setInputAmount: () => {},
      outputCurrency: null,
      outputAmount: null,
      inputCurrencyBalance: null,
      outputCurrencyBalance: null,
      currentExchangeRatio: null,
      exchangeProgress: { exchangeStep: ExchangeStep.start, reason: null, value: null },
      approve: () => {},
      exchange: () => {},
      reset: () => {},
    });

export type ButtonContextProps = {
  wrapper: Wrapper;
  children?: React.ReactNode;
};

const defaultProps: ButtonContextProps = {
  wrapper: Wrapper.button,
  children: null,
};

function getTokenPairs(
  wrapper: Wrapper,
  networkChainId: number | undefined,
): Map<WrapDirection, Map<Token, Token>> {
  return networkChainId ? getConfig(networkChainId as Network).pairs.get(wrapper) || new Map() : new Map();
}

const ButtonProvider: React.FC<ButtonContextProps> = ({
  wrapper,
  children,
}: ButtonContextProps) => {
  const {
    ready,
    provider,
    multicallProvider,
    signer,
  } = useContext(Web3Context);

  const readSessionStorage = useCallback((key:string) => sessionStorage.getItem(`${wrapper}-${key}`), [wrapper]);
  const writeSessionStorage = useCallback((key:string, value: any) => sessionStorage.setItem(`${wrapper}-${key}`, value), [wrapper]);
  const readPastOrDefault = useCallback((key: string, updateState: (value: string) => void, defaultValue: any) => {
    const pastValue = readSessionStorage(key);
    if (pastValue) {
      updateState(pastValue);
    } else {
      updateState(defaultValue);
      writeSessionStorage(key, defaultValue);
    }
  }, [readSessionStorage, writeSessionStorage]);

  const [wrapDirection, setWrapDirection] = useState<WrapDirection>(WrapDirection.wrapping);

  useEffect(() => {
    readPastOrDefault('wrapDirection', (value: string) => setWrapDirection(value as WrapDirection), wrapDirection);
  }, []);

  const [config, setConfig] = useState<NetworkConfig | null>(null);
  const [tokenPairs, setTokenPairs] = useState<Map<WrapDirection, Map<Token, Token>>>(new Map());
  const [tokenBalances, setTokenBalances] = useState<Map<Token|null, BigNumber>|null>(null);
  const [exchangeRatios, setExchangeRatios] = useState<Map<Token|null, Map<Token|null, ExchangeRatio>>>(new Map());
  const [inputCurrency, setInputCurrency] = useState<Token|null>(null);
  const [outputCurrency, setOutputCurrency] = useState<Token|null>(null);
  const [inputAmount, setInputAmount] = useState<BigNumber|null>(null);
  const [outputAmount, setOutputAmount] = useState<BigNumber|null>(null);

  useEffect(() => {
    if (provider?.network?.chainId && ready) {
      setConfig(getConfig(provider.network.chainId));
    }
  }, [provider, provider?.network?.chainId, ready]);

  useEffect(() => {
    if (provider?.network?.chainId && ready) {
      const newTokenPairs = getTokenPairs(
        wrapper,
        provider.network.chainId,
      );
      setTokenPairs(newTokenPairs);
    }
  }, [wrapper, wrapDirection, provider, provider?.network?.chainId, ready]);

  useEffect(() => {
    if (signer && multicallProvider) {
      const tokens: Token[] = [...tokenPairs.values()].flatMap((tokenMaps) => [...tokenMaps.keys()]);
      balanceOfMulti(multicallProvider, signer, tokens)
        .then((balances) => {
          setTokenBalances(new Map(balances.map((balance: BigNumber, index: number) => [tokens[index], balance])));
        })
        .catch((reason) => console.log(reason));
    }
  }, [signer, multicallProvider, tokenPairs]);

  useEffect(() => {
    if (signer && multicallProvider) {
      const wrappingPairs = Array.from(tokenPairs.get(WrapDirection.wrapping) || new Map<Token, Token>());

      const unwrappedTokens = wrappingPairs.map((pair) => pair[0]);
      const wrappedTokens = wrappingPairs.map((pair) => pair[1]);

      totalSupplyMulti(multicallProvider, signer, wrappedTokens)
        .then((totalSupplies) => {
          wrapperToUnderlyingMulti(multicallProvider, signer, totalSupplies, wrappedTokens)
            .then((totalUnderlyings) => {
              const calculatedExchangeRatios: Map<Token, Map<Token, ExchangeRatio>> = new Map(
                totalUnderlyings.flatMap((totalUnderlying: BigNumber, index: number) => [
                  [
                    unwrappedTokens[index], new Map([
                      [wrappedTokens[index], ({ from: totalUnderlying, to: totalSupplies[index] })],
                    ]),
                  ],
                  [
                    wrappedTokens[index], new Map([
                      [unwrappedTokens[index], ({ from: totalSupplies[index], to: totalUnderlying })],
                    ]),
                  ],
                ]),
              );
              setExchangeRatios(calculatedExchangeRatios);
            });
        })
        .catch((reason) => console.log(reason));
    }
  }, [signer, multicallProvider, tokenPairs]);

  useEffect(() => {
    const inputCurrencyList = [...(tokenPairs.get(wrapDirection)?.keys() || [])];
    if (inputCurrencyList && inputCurrencyList.length) {
      const pastInputCurrencyAddress: string | null = readSessionStorage('inputCurrencyAddress');
      const nextInputCurrency = inputCurrencyList.find((currency) => currency.address === pastInputCurrencyAddress) || inputCurrencyList[0];
      setInputCurrency(nextInputCurrency || null);
      writeSessionStorage('inputCurrencyAddress', nextInputCurrency.address);

      const pastInputAmount: string | null = readSessionStorage('inputAmount');
      const nextInputAmount: BigNumber | null = (pastInputAmount && BigNumber.from(pastInputAmount)) || null;
      setInputAmount(nextInputAmount);
      writeSessionStorage('inputAmount', nextInputAmount?.toString() || '');
    } else {
      setInputCurrency(null);
    }
  }, [wrapDirection, tokenPairs]);

  const flipWrapDirection = useCallback(() => {
    if (inputCurrency && outputCurrency) {
      const nextWrapDirection = (wrapDirection === WrapDirection.wrapping) ? WrapDirection.unwrapping : WrapDirection.wrapping;
      setInputCurrency(outputCurrency);
      writeSessionStorage('inputCurrencyAddress', outputCurrency.address);

      setInputAmount(outputAmount);
      writeSessionStorage('inputAmount', outputAmount?.toString() || '');

      setOutputAmount(inputAmount);

      setWrapDirection(nextWrapDirection);
      writeSessionStorage('wrapDirection', nextWrapDirection);
    }
  }, [inputCurrency, outputCurrency, inputAmount, outputAmount, wrapDirection]);

  useEffect(() => {
    if (inputCurrency) {
      const nextOutputCurrency = tokenPairs.get(wrapDirection)?.get(inputCurrency) || null;
      setOutputCurrency(nextOutputCurrency);

      const currentExchangeRatio = exchangeRatios?.get(inputCurrency)?.get(outputCurrency) || null;
      if (!inputAmount) {
        setOutputAmount(null);
      } else if (currentExchangeRatio) {
        setOutputAmount(inputAmount.mul(currentExchangeRatio.to).div(currentExchangeRatio.from));
      }
    }
  }, [tokenPairs, wrapDirection, inputCurrency, inputAmount, exchangeRatios]);

  const [exchangeProgress, setExchangeProgress] = useState<ExchangeProgress>({
    reason: null,
    value: null,
    exchangeStep: ExchangeStep.start,
  });

  const approve = useCallback(() => {
    console.log([signer, ready, wrapper, wrapDirection, inputCurrency, inputAmount, outputCurrency]);
    if (signer && ready && inputCurrency && inputAmount && outputCurrency) {
      const inputCurrencyAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(inputCurrency, inputAmount.toString());

      setExchangeProgress({ reason: null, value: null, exchangeStep: ExchangeStep.approving });
      if (wrapDirection === WrapDirection.wrapping) {
        approveWrapping(signer, inputCurrencyAmount, outputCurrency)
          .then(() => setExchangeProgress({ reason: null, value: null, exchangeStep: ExchangeStep.approved }))
          .catch((reason) => setExchangeProgress({ reason, value: null, exchangeStep: ExchangeStep.error }));
      } else {
        setExchangeProgress({ reason: null, value: null, exchangeStep: ExchangeStep.approved });
      }
    }
  }, [signer, ready, wrapper, wrapDirection, inputCurrency, inputAmount, outputCurrency]);

  const exchange = useCallback(() => {
    if (signer && ready && config && inputCurrency && inputAmount && outputCurrency) {
      const inputCurrencyAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(inputCurrency, inputAmount.toString());

      setExchangeProgress({ reason: null, value: null, exchangeStep: ExchangeStep.exchanging });
      let promise: Promise<CurrencyAmount<Token>>;
      if (wrapper === Wrapper.button) {
        if (wrapDirection === WrapDirection.wrapping) {
          if (config.wrapperRouters[inputCurrency.address]) {
            // if the input currency needs wrapper router (like native token ETH), do so
            promise = buttonWrapWithRouter(signer, inputCurrencyAmount.quotient.toString(), outputCurrency, config.wrapperRouters[inputCurrency.address]);
            console.log('wrapping with router');
          } else {
            promise = buttonWrap(signer, inputCurrencyAmount.quotient.toString(), outputCurrency);
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (config.wrapperRouters[outputCurrency.address]) {
            // if the input currency needs wrapper router (like native token ETH), do so
            promise = buttonUnwrapWithRouter(signer, inputCurrencyAmount, config.wrapperRouters[outputCurrency.address]);
            console.log('unwrapping with router');
          } else {
            promise = buttonUnwrap(signer, inputCurrencyAmount);
          }
        }
      } else if (wrapDirection === WrapDirection.wrapping) {
        promise = unbuttonWrap(signer, inputCurrencyAmount.quotient.toString(), outputCurrency);
      } else {
        promise = unbuttonUnwrap(signer, inputCurrencyAmount);
      }
      promise.then((value) => setExchangeProgress({ reason: null, value, exchangeStep: ExchangeStep.completed }))
        .catch((reason) => {
          console.log('reason:', reason);
          setExchangeProgress({ reason, value: null, exchangeStep: ExchangeStep.error });
        });
    }
  }, [signer, ready, wrapper, wrapDirection, inputCurrency, inputAmount, outputCurrency]);

  const reset = useCallback(() => {
    setInputAmount(null);
    setOutputAmount(null);
    setExchangeProgress({ reason: null, value: null, exchangeStep: ExchangeStep.start });
  }, []);

  return (
    <ButtonContext.Provider
      value={{
        wrapper,
        // getTokenBalances,
        buttonWrap: () => Promise.reject(Error('Unitialized')),
        wrapDirection,
        flipWrapDirection,
        inputCurrencyList: [...(tokenPairs.get(wrapDirection)?.keys() || [])],
        inputCurrency,
        setInputCurrency: (iC: Token | null) => { setInputCurrency(iC); writeSessionStorage('inputCurrencyAddress', iC?.address || null); },
        inputAmount,
        setInputAmount: (iA: BigNumber | null) => { setInputAmount(iA); writeSessionStorage('inputAmount', iA || ''); },
        outputCurrency,
        outputAmount,
        inputCurrencyBalance: tokenBalances?.get(inputCurrency) || null,
        outputCurrencyBalance: tokenBalances?.get(outputCurrency) || null,
        currentExchangeRatio: exchangeRatios?.get(inputCurrency)?.get(outputCurrency) || null,
        exchangeProgress,
        approve,
        exchange,
        reset,
      }}
    >
      {children}
    </ButtonContext.Provider>
  );
};

ButtonProvider.defaultProps = defaultProps;

export { ButtonProvider };

export default ButtonContext;
