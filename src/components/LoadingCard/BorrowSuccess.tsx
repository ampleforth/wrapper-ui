import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
    },
    borrow: {
      padding: 20,
      backgroundColor: '#90ee90',
      borderRadius: 30,
      border: '0px solid #008000',
      fontSize: '3.0rem',
      width: '100%',
      maxWidth: 250,
    },
    balanceDescription: {},
  }),
);

export interface BorrowSuccessProps {
  /**
   * Positive amount to display
   */
  amountString: string;
  /**
   * Wallet balance
   */
  walletBalance: CurrencyAmount<Token>;
  /**
   * CurrencyString
   */
  currencyString: string;
}

export function BorrowSuccess({
  amountString,
  walletBalance,
  currencyString = '',
}: BorrowSuccessProps) {
  const classes = useStyles();

  return (
    <Box
      className={classes.root}
      display='flex'
      flexWrap='nowrap'
      alignItems='center'
      flexDirection='column'
      fontWeight='fontWeightBold'
    >
      <Box
        className={classes.borrow}
        display='flex'
        flexWrap='nowrap'
        alignItems='center'
        justifyContent='center'
        fontWeight='fontWeightBold'
      >
        +{amountString}
        &nbsp;
        <small>{currencyString}</small>
      </Box>
      <Box className={classes.balanceDescription} fontWeight='fontWeightRegular'>
        <br />
        Wallet Balance:
        <b>
          {walletBalance.toFixed(2)} {walletBalance.currency.symbol}
        </b>
      </Box>
    </Box>
  );
}
