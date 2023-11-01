/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
import React, { useContext } from 'react';
import { ExchangeForm } from 'components/ExchangeForm';
import { Network, Wrapper } from 'config';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { useHistory } from 'react-router-dom';
import { LoadingCard } from 'components/LoadingCard/LoadingCard';
import { CurrencyAmount } from '@uniswap/sdk-core';
import ButtonContext, { ExchangeStep } from '../contexts/ButtonContext';

export const Exchange = React.memo(() => {
  const [{ connectedChain }] = useSetChain();
  const [{ wallet }] = useConnectWallet();
  const {
    wrapper,
    wrapDirection,
    flipWrapDirection,
    inputCurrencyList,
    inputCurrency,
    setInputCurrency,
    inputAmount,
    setInputAmount,
    outputCurrency,
    outputAmount,
    inputCurrencyBalance,
    outputCurrencyBalance,
    currentExchangeRatio,
    exchangeProgress,
    approve,
    exchange,
    reset,
  } = useContext(ButtonContext);
  const history = useHistory();

  const network = connectedChain ? (Number(connectedChain.id) as Network) : Network.Mainnet;

  // console.log('signer', signer);
  // console.log('ready', ready);
  // console.log('address', address);
  // console.log('network', network);
  //
  // console.log(wrapDirection);
  // console.log(setWrapDirection);

  // const networkName = provider && provider.network && provider.network.name
  //   ? provider.network.name
  //   : '';

  // console.log('currentExchangeRatio:', currentExchangeRatio);

  // ToDo: Add inputError to ExchangeForm if input exceeds balance
  //  Also disableSubmit if inputError != null

  const submitHandler = () => {
    switch (exchangeProgress.exchangeStep) {
      case ExchangeStep.start:
        approve();
        break;
      case ExchangeStep.approved:
        exchange();
        break;
      default:
        reset();
        break;
    }
  };

  // ToDo: Figure out how to make this work elegantly without glitching
  // const setOutputAmountHandler = useCallback((amount: BigNumber | null) => {
  //   if (!amount) {
  //     setInputAmount(null);
  //   } else if (currentExchangeRatio) {
  //     setInputAmount(amount.mul(currentExchangeRatio.to).div(currentExchangeRatio.from));
  //   }
  // }, [currentExchangeRatio]);
  const setOutputAmountHandler = () => {
    return;
  };

  switch (exchangeProgress.exchangeStep) {
    case ExchangeStep.approving:
    case ExchangeStep.approved:
    case ExchangeStep.exchanging:
    case ExchangeStep.completed:
      return (
        <LoadingCard
          exchangeStep={exchangeProgress.exchangeStep}
          targetCurrencyAmount={
            outputAmount &&
            outputCurrency &&
            CurrencyAmount.fromRawAmount(outputCurrency, outputAmount.toString())
          }
          walletBalance={
            outputCurrencyBalance &&
            outputCurrency &&
            CurrencyAmount.fromRawAmount(outputCurrency, outputCurrencyBalance.toString())
          }
          transactionId={exchangeProgress.value?.transactionHash}
          networkName={'Ethereum Mainnet'}
          buttonHandler={submitHandler}
        />
      );
    case ExchangeStep.error:
      return (
        <LoadingCard
          exchangeStep={exchangeProgress.exchangeStep}
          message={exchangeProgress.reason.message}
          buttonHandler={submitHandler}
        />
      );
    default:
      return (
        <ExchangeForm
          wrapper={wrapper}
          setWrapper={(nextWrapper: Wrapper) => {
            history.replace(`/${nextWrapper.toString()}`);
          }} // ToDo - Get rid of setWrapper?
          inputCurrency={inputCurrency}
          setInputCurrency={setInputCurrency}
          inputCurrencyList={inputCurrencyList}
          outputCurrency={outputCurrency}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          inputBalance={inputCurrencyBalance}
          outputAmount={outputAmount}
          setOutputAmount={setOutputAmountHandler}
          wrapDirection={wrapDirection}
          toggleWrapDirection={flipWrapDirection}
          disableSubmit={!wallet}
          submitHandler={submitHandler}
        />
      );
  }
});

Exchange.displayName = 'Exchange';
