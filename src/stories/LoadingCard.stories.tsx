import React from 'react';
import { Meta, Story } from '@storybook/react';
import { LoadingCard, LoadingCardProps } from 'components/LoadingCard/LoadingCard';
import { BigNumber } from 'ethers';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import { ExchangeStep } from 'contexts/ButtonContext';
import { Asset, getConfig, Network } from '../config';

const Tether = getConfig(Network.Kovan).assets[Asset.USDT]!;

export default {
  title: 'components/LoadingCard',
  component: LoadingCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<LoadingCardProps> = (args) => (
  <LoadingCard {...args} />
);

export const Approving = Template.bind({});
Approving.args = {
  exchangeStep: ExchangeStep.approving,
  message: 'Predeposit Approving messages!',
};

export const Approved = Template.bind({});
Approved.args = {
  exchangeStep: ExchangeStep.approved,
};

export const Exchanging = Template.bind({});
Exchanging.args = {
  exchangeStep: ExchangeStep.exchanging,
};

const tetherToken = new Token(
  Network.Kovan,
  Tether.address, Tether.decimals, Tether.symbol, Tether.name,
);

export const Completed = Template.bind({});
Completed.args = {
  exchangeStep: ExchangeStep.completed,
  targetCurrencyAmount: CurrencyAmount.fromRawAmount(tetherToken, 1000),
  walletBalance: CurrencyAmount.fromRawAmount(tetherToken, BigNumber.from(12345).toString()),
  transactionId: '0xb637d62170670e0dcc0aba494dc3750430f5e3ae4040e0fe41c25ee64695c495',
  networkName: 'kovan',
};

export const Error = Template.bind({});
Error.args = {
  exchangeStep: ExchangeStep.error,
  message: 'Bad stuff happened. Oh no!',
};
