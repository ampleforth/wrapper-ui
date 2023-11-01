import React from 'react';
import 'App.css';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TopBar } from 'components/TopBar/TopBar';
import { Exchange } from 'pages/Exchange';
import { Box } from '@material-ui/core';
import { Web3OnboardProvider } from '@web3-onboard/react';
import web3Onboard from './contexts/Web3Context';
import { ButtonProvider } from './contexts/ButtonContext';
import { Wrapper } from './config';
import { TokenListProvider } from './contexts/TokenListContext';
import { SubgraphProvider } from './contexts/SubgraphContext';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ethereum: any;
  }
}

window.ethereum = window.ethereum || {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    app: {
      minHeight: '100vh',
      background: `linear-gradient(-140deg, ${theme.palette.background.gradient.top} 0%, ${theme.palette.background.gradient.bottom} 100%)`,
    },
    body: {
      display: 'flex',
      alignItems: 'center',
      padding: 20,
    },
  }),
);

function App() {
  const queryClient = new QueryClient();
  const classes = useStyles();

  return (
    <Router>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <SubgraphProvider>
          <TokenListProvider>
            <div className={classes.app}>
              <TopBar options={[]} links={[]} />
              <Box className={classes.body} display='flex' flexDirection='column'>
                <QueryClientProvider client={queryClient}>
                  <Switch>
                    <Route path='/'>
                      <ButtonProvider wrapper={Wrapper.unbutton}>
                        <Exchange />
                      </ButtonProvider>
                    </Route>
                  </Switch>
                </QueryClientProvider>
              </Box>
            </div>
          </TokenListProvider>
        </SubgraphProvider>
      </Web3OnboardProvider>
    </Router>
  );
}

export default App;
