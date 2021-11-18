import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Link } from '@material-ui/core';
import { SubmitButton } from 'components/SubmitButton';
import { Ellipsis } from 'components/Ellipsis';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import ErrorIcon from 'icons/ErrorIcon.svg';
import LinkOutIcon from 'icons/LinkOutIcon.svg';
import { BorrowSuccess } from './BorrowSuccess';
import { ExchangeStep } from '../../contexts/ButtonContext';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    borderRadius: 30,
    padding: 20,
    maxWidth: 450,
    border: '1px solid #efefef',
    boxShadow: '0px 0px 25px -3px rgb(0 0 0 / 8%)',
    backgroundColor: theme.palette.background.gradient.top,
    fontFamily: theme.typography.fontFamily,
  },
  loadingTitle: {
    fontSize: '2.0rem',
    padding: 20,
  },
  loadingDescription: {
    margin: '20px',
    padding: 20,
    fontSize: '1.5em',
  },
  errorIcon: {
    margin: 20,
  },
  transactionUrl: {
    color: theme.palette.secondary.dark,
    display: 'flex',
    '& p': {
      marginRight: 10,
    },
  },
}));

export interface LoadingCardProps {
  /**
   * Current Exchange Step
   */
  exchangeStep: ExchangeStep;
  /**
   * Target Currency Amount
   */
  targetCurrencyAmount?: CurrencyAmount<Token> | null;
  /**
   * Wallet Balance
   */
  walletBalance?: CurrencyAmount<Token> | null;
  /**
   * Message during loading and error
   */
  message?: string;
  /**
   * ButtonHandler
   */
  buttonHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Transaction ID
   */
  transactionId?: string | null;
  /**
   * Network Name
   */
  networkName?: string;
}

const APPROVING_TITLE = 'Waiting for Approval';
const APPROVED_TITLE = 'Approved - Complete the Wrap';
const EXCHANGING_TITLE = 'Wrapping';
const COMPLETED_TITLE = 'Success';
const ERROR_TITLE = 'Error';

const APPROVING_STATUS = 'Updates here ...';
const EXCHANGING_STATUS = 'Waiting for Confirmation';

const APPROVED_ACTION = 'EXCHANGE & FINISH';
const COMPLETED_ACTION = 'RETURN HOME';
const ERROR_ACTION = 'RETURN HOME';

function getTitle(exchangeStep: ExchangeStep): string | null {
  switch (exchangeStep) {
    case ExchangeStep.approving: return APPROVING_TITLE;
    case ExchangeStep.approved: return APPROVED_TITLE;
    case ExchangeStep.exchanging: return EXCHANGING_TITLE;
    case ExchangeStep.completed: return COMPLETED_TITLE;
    case ExchangeStep.error: return ERROR_TITLE;
    default: return null;
  }
}

function getDescription(exchangeStep: ExchangeStep): string | null {
  switch (exchangeStep) {
    case ExchangeStep.approving: return APPROVING_STATUS;
    case ExchangeStep.exchanging: return EXCHANGING_STATUS;
    default: return null;
  }
}

function getButtonText(exchangeStep: ExchangeStep): string | null {
  switch (exchangeStep) {
    case ExchangeStep.approved: return APPROVED_ACTION;
    case ExchangeStep.completed: return COMPLETED_ACTION;
    case ExchangeStep.error: return ERROR_ACTION;
    default: return null;
  }
}

export function LoadingCard({
  exchangeStep,
  targetCurrencyAmount = null,
  walletBalance = null,
  message,
  buttonHandler,
  transactionId = null,
  networkName,
}: LoadingCardProps) {
  const classes = useStyles();
  const title = getTitle(exchangeStep);
  const description = message || getDescription(exchangeStep);
  const buttonText = getButtonText(exchangeStep);
  const completed = (exchangeStep === ExchangeStep.completed);
  const transactionUrl = networkName
    ? `https://${networkName}.etherscan.io/tx/${transactionId}`
    : `https://etherscan.io/tx/${transactionId}`;

  return (
    <Box
      className={classes.root}
      display="flex"
      flexDirection="column"
      flexWrap="nowrap"
      alignItems="center"
    >
      {title
      && (
      <Box
        className={classes.loadingTitle}
        fontWeight="fontWeightBold"
      >
        {title}
      </Box>
      )}
      { [
        ExchangeStep.approving,
        ExchangeStep.approved,
        ExchangeStep.exchanging,
      ].includes(exchangeStep)
        && <Ellipsis />}
      { (exchangeStep === ExchangeStep.error)
      && <img src={ErrorIcon} className={classes.errorIcon} alt="errorIcon" width={50} />}
      {(description || completed)
      && (
      <Box
        className={classes.loadingDescription}
        display="flex"
        alignSelf="stretch"
        flexDirection="column"
        flexWrap="nowrap"
        alignItems="center"
        fontWeight={400}
      >
        { (completed && targetCurrencyAmount && walletBalance)
        && (
        <BorrowSuccess
          amountString={targetCurrencyAmount.toFixed(2) || ''}
          currencyString={targetCurrencyAmount.currency.symbol || ''}
          walletBalance={walletBalance}
        />
        )}
        {description}
      </Box>
      )}
      { transactionId && (
        <Link href={transactionUrl} className={classes.transactionUrl} target="_blank">
          <p>View your transaction</p>
          <img src={LinkOutIcon} alt="LinkOutIcon" width={18} />
        </Link>
      )}
      {[
        ExchangeStep.approved,
        ExchangeStep.completed,
        ExchangeStep.error,
      ].includes(exchangeStep) && (
        <SubmitButton
          label={buttonText}
          clickHandler={buttonHandler}
        />
      )}
    </Box>
  );
}
