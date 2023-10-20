import React, { useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Box, Button, InputAdornment, TextField,
} from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { Token } from '@uniswap/sdk-core';
import { TokenSelector } from './TokenSelector';

const regexHelper = (/^(0*)(\d*)(\.?)?(\d*?[1-9])?(0+)?$/);

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
  },
  currencyInputField: {
    width: '100%',
    borderRadius: 20,
    '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
    '& .MuiInputLabel-outlined': {
      fontSize: '2rem',
      '&.MuiInputLabel-shrink': {
        fontSize: '1.5rem',
      },
    },
    '& p': {
      color: theme.palette.secondary.dark,
      textAlign: 'end',
    },
  },
  box: {
    width: '100%',
  },
  MuiOutlinedInputRoot: {
    borderRadius: 20,
    padding: 0,
    backgroundColor: theme.palette.background.paper,
  },
  loanAmountUnit: {
    borderRadius: 10,
    border: 0,
    padding: '5px 10px',
    marginRight: 20,
    fontSize: 15,
    fontWeight: 'bold',
  },
}));

export interface ParseInputResults {
  result: BigNumber | null,
  trailingZeros: number | null,
}

export interface CurrencyInputFieldProps {
  /**
   * Amount
   */
  amount: BigNumber | null;
  /**
   * Input currency for the loan
   */
  currency: Token;
  /**
   * Input currency for the loan
   */
  currencies?: Token[];
  /**
   * Label Prompt
   */
  label?: string;
  /**
   * Callback fired when the amount is changed
   */
  onUpdateAmount?: (amount: BigNumber | null) => void;
  /**
   * Callback fired when the currency is changed
   */
  onCurrencySelect?: (currency: Token) => void;
  /**
   * Error
   */
  error?: string | null;
  /**
   * helperText
   */
  helperText?: string | null;
}

function sanitizeInput(value: string | null): string | null {
  if (!value) return null;

  const filteredValue = value.replace(/[^\d.]/g, '');
  if (filteredValue.includes('.')) {
    const output = filteredValue.split('.');
    return `${output.shift()}.${output.join('')}`;
  }
  return filteredValue;
}

export function parseInput(value: string | null, decimals: number): ParseInputResults {
  const sanitizedValue = sanitizeInput(value);
  if (!sanitizedValue || !decimals) {
    return {
      result: null,
      trailingZeros: null,
    };
  }
  const truncatedValue = sanitizedValue.indexOf('.') < 0 ? sanitizedValue : sanitizedValue.substring(0, sanitizedValue.indexOf('.') + decimals + 1);
  const [, leadingZeros, wholeNum, point, fraction, trail] = (
    truncatedValue.match(regexHelper) || []);

  const amountOfPadding = (point)
    ? decimals - (fraction?.length || 0) : decimals;

  return {
    result: BigNumber.from(`${leadingZeros || ''}${wholeNum || ''}${fraction || ''}`).mul(BigNumber.from(10).pow(amountOfPadding)),
    trailingZeros: (!point) ? null : (trail?.length || 0),
  };
}

export function toDisplayAmount(
  actualNumber: BigNumber | null,
  decimals: number,
  trailingZeros: number | null,
): string {
  if (actualNumber === null) return '';

  let numAsString = actualNumber?.toString();
  if (numAsString?.length <= decimals) {
    numAsString = `0.${'0'.repeat(decimals - numAsString?.length)}${numAsString}`;
  } else {
    numAsString = `${numAsString.slice(0, numAsString?.length - decimals)}.${numAsString.slice(numAsString?.length - decimals)}`;
  }

  const [, , wholeNum, , fraction] = (numAsString.match(regexHelper) || []);
  return `${wholeNum || '0'}${trailingZeros === null && !fraction ? '' : '.'}${fraction || ''}${'0'.repeat(trailingZeros || 0)}`;
}

export const CurrencyInputField = ({
  amount = null,
  currency,
  currencies,
  label = undefined,
  onUpdateAmount,
  onCurrencySelect,
  error = null,
  helperText = null,
}: CurrencyInputFieldProps) => {
  const classes = useStyles();
  const [trailingZeros, setTrailingZeros] = useState<number | null>(null);
  const [displayTokenSelector, setDisplayTokenSelector] = useState<boolean>(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { result, trailingZeros: trailingZerosOutput } = parseInput(
      event.target.value, currency.decimals,
    );
    setTrailingZeros(trailingZerosOutput);
    if (onUpdateAmount) {
      onUpdateAmount(result);
    }
  };
  const onTokenSelectorClickHandler = () => { setDisplayTokenSelector(!displayTokenSelector); };
  const onItemSelectHandler = (token: Token) => {
    setDisplayTokenSelector(false);
    if (onCurrencySelect) {
      onCurrencySelect(token);
    }
  };

  return (
    <Box position="relative">
      <Box position={displayTokenSelector ? 'absolute' : 'static'} className={classes.box}>
        <TextField
          className={classes.currencyInputField}
          id="outlined-basic"
          label={error || label}
          error={!!error}
          helperText={helperText}
          variant="outlined"
          color="primary"
          type="text"
          autoComplete="off"
          value={toDisplayAmount(amount, currency.decimals, trailingZeros)}
          onChange={onChange}
          InputProps={{
            classes: {
              root: classes.MuiOutlinedInputRoot,
            },
            endAdornment:
  <InputAdornment position="end">
    {currencies ? (
      <Button
        className={classes.loanAmountUnit}
        color="primary"
        variant="contained"
        onClick={onTokenSelectorClickHandler}
      >
        {currency.symbol || '???'}
        <ArrowDropDown />
      </Button>
    ) : (
      <Button
        className={classes.loanAmountUnit}
        color="primary"
        variant="contained"
        style={{ pointerEvents: 'none' }}
      >
        {currency.symbol || '???'}
      </Button>
    )}
  </InputAdornment>,
          }}
        />
      </Box>
      {displayTokenSelector && currencies && (
        <TokenSelector
          tokens={currencies}
          onItemSelectHandler={onItemSelectHandler}
          topPadding={50}
        />
      )}
    </Box>
  );
};
