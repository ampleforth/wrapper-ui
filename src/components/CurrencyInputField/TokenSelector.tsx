import React, { useContext } from 'react';
import { Token } from '@uniswap/sdk-core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, List } from '@material-ui/core';
import { TokenSelectorItem } from './TokenSelectorItem';
import TokenListContext from '../../contexts/TokenListContext';

const useStyles = makeStyles((inputTheme: Theme) => createStyles({
  root: {
    backgroundColor: inputTheme.palette.background.default,
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  list: {
    maxHeight: '50vh',
    overflowX: 'auto',
  },
}));

interface TokenSelectorProps {
  /**
   * The tokens to display
   */
  tokens: Token[];
  /**
   * Callback for when a token is selected
   */
  onItemSelectHandler: (token: Token) => void;
  /**
   * How much extra padding should be included at the top
   */
  topPadding: number;
}

export const TokenSelector = ({
  tokens,
  onItemSelectHandler,
  topPadding,
}: TokenSelectorProps) => {
  const classes = useStyles();
  const { getLogoURI } = useContext(TokenListContext);
  return (
    <Box className={classes.root}>
      <div style={{ height: topPadding }} />
      <List className={classes.list}>
        {tokens.map((token) => (
          <TokenSelectorItem
            key={token.address}
            token={token}
            logoURI={getLogoURI(token.address)}
            onClick={() => {
              onItemSelectHandler(token);
            }}
          />
        ))}
      </List>
    </Box>
  );
};
