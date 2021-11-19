/* eslint-disable no-unused-vars */
import React from 'react';
import { BigNumber } from 'ethers';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Box, Fab, Tab, Tabs,
} from '@material-ui/core';
import { CompareArrows } from '@material-ui/icons';
import { CurrencyInputField } from 'components/CurrencyInputField/CurrencyInputField';
import { SubmitButton } from 'components/SubmitButton';
import { WrapDirection, Wrapper } from '../config';

const useStyles = makeStyles((inputTheme: Theme) => createStyles({
  root: {
    width: '100%',
    maxWidth: 450,
    borderRadius: 30,
    boxShadow: '0px 0px 25px -3px rgb(0 0 0 / 8%)',
  },
  tabs: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    border: '1px solid #efefef',
    borderBottomWidth: 0,
    color: inputTheme.palette.secondary.contrastText,
    backgroundColor: inputTheme.palette.secondary.dark,
  },
  tabsIndicator: {
    backgroundColor: inputTheme.palette.secondary.light,
  },
  tab: {
    fontWeight: 'bold',
  },
  tabSelected: {
    backgroundColor: inputTheme.palette.secondary.main,
  },
  exchangeForm: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    border: '1px solid #efefef',
    '& > :not(:first-child)': {
      marginTop: 20,
    },
  },
  modeIconWrapper: {
    display: 'flex',
    transition: 'transform 200ms',
  },
}));

export interface ExchangeFormProps {
  /**
   * Wrapper
   */
  wrapper: Wrapper;
  /**
   * setWrapper callback
   */
  setWrapper: (wrapper: Wrapper) => void;
  /**
   * Input currency
   */
  inputCurrency: Token | null;
  /**
   * callback for setting inputCurrency
   */
  setInputCurrency: (inputCurrency: Token) => void;
  /**
   * Input currency List
   */
  inputCurrencyList: Array<Token>;
  /**
   * Output currency
   */
  outputCurrency: Token | null;
  /**
   * Input amount
   */
  inputAmount: BigNumber | null;
  /**
   * Callback for setting input amount
   */
  setInputAmount: (inputAmount: BigNumber | null) => void;
  /**
   * Wallet balance of current input currency
   */
  inputBalance: BigNumber | null;
  /**
   * Output amount
   */
  outputAmount: BigNumber | null;
  /**
   * Callback for setting output amount
   */
  setOutputAmount: (inputAmount: BigNumber | null) => void;
  /**
   * wrapDirection
   */
  wrapDirection: WrapDirection;
  /**
   * Callback for toggling wrapDirection
   */
  toggleWrapDirection: () => void;
  /**
   * Optional Boolean argument to disable the Submit Button by default
   */
  disableSubmit?: boolean;
  /**
   * onClickHandler for the submit button
   */
  submitHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// const tabConfigs = [
//   {
//     wrapper: Wrapper.button,
//     name: 'Button',
//   },
//   {
//     wrapper: Wrapper.unbutton,
//     name: 'Unbutton',
//   },
// ];
interface TabConfig {
  wrapper: Wrapper,
  name:string
}
const tabConfigs = [] as TabConfig[];

function a11yProps(wrapper: Wrapper) {
  return {
    id: `simple-tab-${wrapper}`,
    'aria-controls': `simplze-tabpanel-${wrapper}`,
  };
}

export function ExchangeForm({
  wrapper,
  setWrapper,
  inputCurrency,
  setInputCurrency,
  inputCurrencyList,
  outputCurrency,
  inputAmount = null,
  setInputAmount,
  inputBalance,
  outputAmount,
  setOutputAmount,
  wrapDirection,
  toggleWrapDirection,
  disableSubmit = false,
  submitHandler,
}: ExchangeFormProps) {
  const classes = useStyles();

  const onChange = (_event: any, newValue: Wrapper) => {
    setWrapper(newValue);
  };

  const onInputCurrencySelect = (currency: Token) => {
    setInputCurrency(currency);
  };

  const balanceError = (inputAmount && inputBalance && inputAmount.gt(inputBalance) && 'Balance Exceeded') || null;

  return (
    <div className={classes.root}>
      {
        tabConfigs.length > 0 ? (
          <Tabs
            classes={{ root: classes.tabs, indicator: classes.tabsIndicator }}
            value={wrapper} // ToDo: Fix later
            onChange={onChange}
            variant="fullWidth"
          >
            {tabConfigs.map((tabConfig) => (
              <Tab
                key={tabConfig.wrapper}
                value={tabConfig.wrapper}
                classes={{ root: classes.tab, selected: classes.tabSelected }}
                label={tabConfig.name}
                {...a11yProps(tabConfig.wrapper)}
              />
            ))}
          </Tabs>
        ) : null
      }
      <Box
        className={classes.exchangeForm}
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        alignItems="stretch"
        boxSizing="content-box"
      >
        { inputCurrency
        && (
        <CurrencyInputField
          currency={inputCurrency}
          currencies={inputCurrencyList}
          amount={inputAmount}
          label="Enter Amount"
          onUpdateAmount={(value: BigNumber | null) => setInputAmount(value)}
          onCurrencySelect={onInputCurrencySelect}
          helperText={inputBalance && `Input Balance: ${CurrencyAmount.fromRawAmount(inputCurrency, inputBalance.toString()).toExact()}`}
          error={balanceError}
        />
        )}
        <Fab
          color="primary"
          aria-label="mode-toggle"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
          onClick={toggleWrapDirection}
        >
          <div className={classes.modeIconWrapper} style={{ transform: `rotate(${wrapDirection === WrapDirection.wrapping ? 90 : -90}deg)` }}>
            <CompareArrows />
          </div>
        </Fab>
        { outputCurrency
        && (
          <CurrencyInputField
            currency={outputCurrency}
            amount={outputAmount}
            label="Output Amount"
            onUpdateAmount={(value: BigNumber | null) => setOutputAmount(value)}
          />
        )}
        <SubmitButton
          label={wrapDirection === WrapDirection.wrapping ? 'WRAP' : 'UNWRAP'}
          disabled={disableSubmit || !!balanceError || inputAmount == null || inputAmount.eq(0)}
          clickHandler={submitHandler}
        />
      </Box>
    </div>
  );
}
