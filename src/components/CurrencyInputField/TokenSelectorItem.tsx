import { Token } from '@uniswap/sdk-core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Avatar, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      borderRadius: 20,
    },
  }),
);

interface TokenSelectorItemProps {
  token: Token;
  logoURI: string | null;
  onClick: () => void;
}

export const TokenSelectorItem = ({ token, logoURI, onClick }: TokenSelectorItemProps) => {
  const classes = useStyles();
  return (
    <ListItem key={token.address} button onClick={onClick} className={classes.root}>
      <ListItemIcon>
        <Avatar alt={token.symbol} src={logoURI || undefined}>
          <HelpOutline />
        </Avatar>
      </ListItemIcon>
      <ListItemText>{token.symbol}</ListItemText>
      {token.name}
    </ListItem>
  );
};
