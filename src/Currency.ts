import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import { BigNumber } from 'ethers';

export function getCurrencyAmount(currency: Token, value: string): CurrencyAmount<Token> {
  return CurrencyAmount.fromRawAmount(currency, value);
}

export function fromBaseUnits(amount: BigNumber, decimals: number): BigNumber {
  return amount
    .div(BigNumber.from(10)
      .pow(decimals));
}

export function toBaseUnits(amount: BigNumber, decimals: number): BigNumber {
  return amount
    .mul(BigNumber.from(10)
      .pow(decimals));
}
