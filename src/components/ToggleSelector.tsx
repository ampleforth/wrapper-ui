import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    borderRadius: 20,
    padding: 5,
    backgroundColor: '#2C2C2C',
    width: 'fit-content',
    lineHeight: 1.6,
    fontFamily: theme.typography.fontFamily,
  },
  link: {
    display: 'inline-flex',
    flexGrow: 1,
    borderRadius: 14,
    alignItems: 'center',
    height: 38,
    paddingLeft: 30,
    paddingRight: 30,
    fontWeight: 600,
    fontSize: 11,
    backgroundColor: '#2C2C2C',
    color: '#C0C0C0',
    textDecoration: 'none',
    '&:hover': {
      color: '#ffffff',
    },
  },
  activeLink: {
    backgroundColor: '#ffffff',
    color: '#000000',
    '&:hover': {
      color: '#000000',
    },
  },
}));

export interface ToggleSelectorProps {
  /**
   * What the options in the selector are
   */
  optionsList: Array<[string, string]>;
  /**
   * style
   */
  style?: React.CSSProperties;
}

export function ToggleSelector({
  optionsList = [['Borrow', 'borrow'], ['My Bonds', 'Bonds']],
  style = {},
}: ToggleSelectorProps) {
  const classes = useStyles();

  return (
    <Box
      className={classes.root}
      flexDirection="row"
      alignItems="stretch"
      flexWrap="nowrap"
      style={style}
    >
      {
        optionsList.map((option) => (
          <NavLink
            key={option[1]}
            to={`/${option[1]}`}
            className={classes.link}
            activeClassName={classes.activeLink}
            style={{ textTransform: 'uppercase', textAlign: 'center' }}
          >
            {option[0]}
          </NavLink>
        ))
      }
    </Box>
  );
}
