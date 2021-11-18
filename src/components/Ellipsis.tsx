import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  'lds-ellipsis': {
    display: 'inline-block',
    width: 80,
    height: 80,

    '& div': {
      position: 'absolute',
      top: 'calc(50%)',
      width: 13,
      height: 13,
      borderRadius: '50%',
      backgroundColor: theme.palette.secondary.main,
      animationTimingFunction: 'cubic-bezier(0, 1, 1, 0)',

      '&:nth-child(1)': {
        left: '8px',
        animation: '$lds-ellipsis1 0.6s infinite',
      },
      '&:nth-child(2)': {
        left: '8px',
        animation: '$lds-ellipsis2 0.6s infinite',
      },
      '&:nth-child(3)': {
        left: '32px',
        animation: '$lds-ellipsis2 0.6s infinite',
      },
      '&:nth-child(4)': {
        left: '56px',
        animation: '$lds-ellipsis3 0.6s infinite',
      },
    },
  },
  '@keyframes lds-ellipsis1': {
    '0%': {
      transform: 'scale(0)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  '@keyframes lds-ellipsis3': {
    '0%': {
      transform: 'scale(1)',
    },
    '100%': {
      transform: 'scale(0)',
    },
  },
  '@keyframes lds-ellipsis2': {
    '0%': {
      transform: 'translate(0, 0)',
    },
    '100%': {
      transform: 'translate(24px, 0)',
    },
  },
}));

export interface EllipsisProps {
  /**
   * Color of ellipsis
   */
  color?: string|null;
}

export function Ellipsis({ color = null } : EllipsisProps) {
  const classes = useStyles();
  return (
    <div
      className={classes['lds-ellipsis']}
      style={{ position: 'relative' }}
    >
      <div className="loader" style={(color && { backgroundColor: color }) || {}} />
      <div className="loader" style={(color && { backgroundColor: color }) || {}} />
      <div className="loader" style={(color && { backgroundColor: color }) || {}} />
      <div className="loader" style={(color && { backgroundColor: color }) || {}} />
    </div>
  );
}
