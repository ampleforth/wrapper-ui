import React from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Asset, getConfig, Network } from 'config';
import { Story, Meta } from '@storybook/react';
import { ExchangeForm, ExchangeFormProps } from 'components/ExchangeForm';

export default {
  title: 'components/ExchangeForm',
  component: ExchangeForm,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ExchangeFormProps> = (args) => {
  const { inputAmount: argInputAmount } = args;
  const [inputAmount, setInputAmount] = React.useState<BigNumber | null>(argInputAmount);

  return (
    <ExchangeForm
      {...args}
      inputAmount={inputAmount}
      setInputAmount={setInputAmount}
    />
  );
};

export const Primary = Template.bind({});
Primary.args = {
  inputCurrencyList: [getConfig(Network.Kovan).assets[Asset.USDT]!],
  inputAmount: null,
  inputBalance: null,
  disableSubmit: false,
  submitHandler: () => console.log('Submit!'),
};
