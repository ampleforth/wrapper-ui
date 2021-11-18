import React, { useContext } from 'react';
import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Web3Context from 'contexts/Web3Context';
import { Menu, MenuItem } from '@material-ui/core';
import { HeaderLogo } from './HeaderLogo';

const useStyles = makeStyles((theme: Theme) => createStyles({
  appBar: {
    top: 0,
    left: 0,
    height: 70,
    padding: '0px 20px',
    background: theme.palette.background.paper,
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.background.gradient.bottom,
    boxShadow: 'none',
  },
  toolBar: {
    width: '100%',
    padding: 0,
  },
  walletButton: {
    borderRadius: 12,
    marginRight: 10,
  },
  menuButton: {
    padding: '0px 20px',
    height: 40,
    color: '#000',
    backgroundColor: '#efefef',
    borderRadius: 15,
  },
  title: {
    flexGrow: 1,
  },
}));

export interface TopBarProps {
  /**
   * Menu Button Options
   */
  options: Array<string>
  /**
   * Menu Button Links
   */
  links: Array<string>
}

function walletButtonText(walletAddress: string|null|undefined): string {
  return walletAddress ? `${walletAddress.substr(0, 6)}...${walletAddress.slice(-4)}` : 'Connect To A Wallet';
}

export function TopBar({ options, links }: TopBarProps) {
  const { selectWallet, disconnectWallet, address } = useContext(Web3Context);
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" className={classes.appBar} color="default">
      <Toolbar className={classes.toolBar}>
        <HeaderLogo style={{ textAlign: 'start' }} />
        <Button
          variant="contained"
          color="secondary"
          className={classes.walletButton}
          onClick={() => { if (address) { disconnectWallet(); } else selectWallet(); }}
        >
          {walletButtonText(address)}
        </Button>
        <IconButton
          className={classes.menuButton}
          color="default"
          aria-label="menu"
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        { (options.length > 0)
          && (
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {
              options.map((value, index) => (
                <MenuItem
                  button
                  component="a"
                  href={links[index]}
                  onClick={handleClose}
                >
                  {value}
                </MenuItem>
              ))
            }
          </Menu>
          )}
      </Toolbar>
    </AppBar>
  );
}
