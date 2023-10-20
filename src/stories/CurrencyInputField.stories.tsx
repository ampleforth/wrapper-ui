import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import theme from 'theme';
import {
  CurrencyInputField,
  CurrencyInputFieldProps,
} from 'components/CurrencyInputField/CurrencyInputField';
import { BigNumber } from '@ethersproject/bignumber';
import { Token } from '@uniswap/sdk-core';
import { Asset, getConfig, Network } from '../config';

export default {
  title: 'components/CurrencyInputField',
  component: CurrencyInputField,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as Meta;

const overridingTheme = createMuiTheme({
  ...theme,
  palette: {
    ...theme.palette,
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#000000',
    },
    text: {
      primary: '#000000',
    },
  },
});

const Template: Story<CurrencyInputFieldProps> = (args) => {
  const { amount, currency } = args;
  const [inputAmount, setInputAmount] = React.useState<BigNumber | null>(amount);
  const [loanCurrency, setLoanCurrency] = useState<Token>(
    currency || getConfig(Network.Kovan).assets[Asset.USDT],
  );

  return (
    <ThemeProvider theme={overridingTheme}>
      <CurrencyInputField
        {...args}
        currency={loanCurrency}
        amount={inputAmount}
        onUpdateAmount={setInputAmount}
        onCurrencySelect={setLoanCurrency}
      />
      {`${inputAmount}`}
    </ThemeProvider>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  amount: null,
  currency: getConfig(Network.Kovan).assets[Asset.USDT],
  currencies: [
    getConfig(Network.Kovan).assets[Asset.USDT]!,
    getConfig(Network.Kovan).assets[Asset.AMPL]!,
  ],
  label: 'Enter Desired Loan',
};

export const WithoutTokenSelector = Template.bind({});
WithoutTokenSelector.args = {
  amount: null,
  currency: getConfig(Network.Kovan).assets[Asset.USDT],
  label: 'Enter Desired Loan',
};

export const WithError = Template.bind({});
WithError.args = {
  amount: null,
  currency: getConfig(Network.Kovan).assets[Asset.USDT],
  label: 'Enter Desired Loan',
  error: 'Entered balance is too high.',
};

export const WithHelperText = Template.bind({});
WithHelperText.args = {
  amount: null,
  currency: getConfig(Network.Kovan).assets[Asset.USDT],
  label: 'Enter Desired Loan',
  helperText: 'Balance: 1024 USDT',
};
