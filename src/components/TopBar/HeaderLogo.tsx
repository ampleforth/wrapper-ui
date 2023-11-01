import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerLogo: {
      flexGrow: 1,
      fontFamily: theme.typography.fontFamily,
    },
    button: {
      fontFamily: 'Montserrat Alternates',
      fontWeight: 900,
      fontSize: '2.0rem',
    },
    alchemy: {
      verticalAlign: 'super',
      fontSize: 'smaller',
    },
  }),
);

export interface HeaderLogoProps {
  /**
   * style prop
   */
  style?: React.CSSProperties;
}

export function HeaderLogo({ style }: HeaderLogoProps) {
  const classes = useStyles();
  return (
    <div className={classes.headerLogo} style={style}>
      <b className={classes.button}>AMPL</b>
      <sup>wrapper</sup>
    </div>
  );
}
