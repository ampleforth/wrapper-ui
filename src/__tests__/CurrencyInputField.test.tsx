import React from 'react';
import { render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { CurrencyInputField, toDisplayAmount, parseInput } from 'components/CurrencyInputField/CurrencyInputField';
import { Asset, getConfig } from 'config';

test('renders', () => {
  render(<CurrencyInputField amount={null} label="Enter desired loan" currency={getConfig().asset[Asset.USDT]} onUpdateAmount={() => {}} />);
  const currencyInputField = screen.getByText(/USDT/i);
  expect(currencyInputField).toBeInTheDocument();
});

test('toDisplayAmount - null', () => {
  const inputAmount = null;
  const output = toDisplayAmount(inputAmount, 9, null);
  expect(output).toBe('');
});

test('toDisplayAmount - whole number', () => {
  const inputAmount = BigNumber.from('23000000000');
  const output = toDisplayAmount(inputAmount, 9, null);
  expect(output).toBe('23');
});

test('toDisplayAmount - whole number ending zeros', () => {
  const inputAmount = BigNumber.from('100000000000');
  const output = toDisplayAmount(inputAmount, 9, null);
  expect(output).toBe('100');
});

test('toDisplayAmount - mixed number', () => {
  const inputAmount = BigNumber.from('23950000000');
  const output = toDisplayAmount(inputAmount, 9, 0);
  expect(output).toBe('23.95');
});

test('toDisplayAmount - fraction 1', () => {
  const inputAmount = BigNumber.from('9654300');
  const output = toDisplayAmount(inputAmount, 9, 0);
  expect(output).toBe('0.0096543');
});

test('toDisplayAmount - fraction 2', () => {
  const inputAmount = BigNumber.from('700000000');
  const output = toDisplayAmount(inputAmount, 9, 0);
  expect(output).toBe('0.7');
});

test('toDisplayAmount - trailingZeros != 0', () => {
  const inputAmount = BigNumber.from('300000000');
  const output = toDisplayAmount(inputAmount, 9, 2);
  expect(output).toBe('0.300');
});

test('toDisplayAmount - initial render test', () => {
  const inputAmount = BigNumber.from('476885145125');
  const output = toDisplayAmount(inputAmount, 9, null);
  expect(output).toBe('476.885145125');
});

test('parseInput - empty string', () => {
  const inputString = '';
  const { result, trailingZeros } = parseInput(inputString, 9);

  expect(result).toBeNull();
  expect(trailingZeros).toBe(null);
});

test('parseInput - zero', () => {
  const inputString = '0';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).toEqual(BigNumber.from(0));
  expect(trailingZeros).toBe(null);
});

test('parseInput - leading zeros', () => {
  const inputString = '0012';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).toEqual(BigNumber.from(12000000000));
  expect(trailingZeros).toBe(null);
});

test('parseInput - number ends in non-trailing zeros', () => {
  const inputString = '20';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).toEqual(BigNumber.from(20000000000));
  expect(trailingZeros).toBe(null);
});

test('parseInput - whole number', () => {
  const inputString = '23';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).not.toBeNull();
  expect(result).toEqual(BigNumber.from(23000000000));
  expect(trailingZeros).toBe(null);
});

test('parseInput - fraction', () => {
  const inputString = '0.0096543';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).not.toBeNull();
  expect(result).toEqual(BigNumber.from(9654300));
  expect(trailingZeros).toBe(0);
});

test('parseInput - fraction w/ trailing zeros and no leading zero', () => {
  const inputString = '.00965430';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).not.toBeNull();
  expect(result).toEqual(BigNumber.from(9654300));
  expect(trailingZeros).toBe(1);
});

test('parseInput - mixed number', () => {
  const inputString = '23.95';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).not.toBeNull();
  expect(result).toEqual(BigNumber.from(23950000000));
  expect(trailingZeros).toBe(0);
});

test('parseInput - mixed number w/ trailing zeros', () => {
  const inputString = '23.950';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).not.toBeNull();
  expect(result).toEqual(BigNumber.from(23950000000));
  expect(trailingZeros).toBe(1);
});

test('parseInput - whole number with decimal at the end', () => {
  const inputString = '10.';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).not.toBeNull();
  expect(result).toEqual(BigNumber.from(10000000000));
  expect(trailingZeros).toBe(0);
});

test('parseInput - whole number with decimal and zero', () => {
  const inputString = '10.0';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).not.toBeNull();
  expect(result).toEqual(BigNumber.from(10000000000));
  expect(trailingZeros).toBe(1);
});

test('parseInput - too many decimals', () => {
  const inputString = '10.12345678910';
  const { result, trailingZeros } = parseInput(inputString, 9);
  expect(result).not.toBeNull();
  expect(result).toEqual(BigNumber.from(10123456789));
  expect(trailingZeros).toBe(0);
});

test('roundTrip - mixed number', () => {
  const inputString = '69.4200';

  const { result, trailingZeros } = parseInput(inputString, 9);

  const output = toDisplayAmount(result, 9, trailingZeros);

  expect(output).toEqual(inputString);
});

test('roundTrip - whole number w/ trailing zeros', () => {
  const inputString = '20';

  const { result, trailingZeros } = parseInput(inputString, 9);

  const output = toDisplayAmount(result, 9, trailingZeros);

  expect(output).toEqual(inputString);
});
