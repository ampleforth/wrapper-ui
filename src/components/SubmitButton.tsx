import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Ellipsis } from './Ellipsis';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 20,
      width: '100%',
      height: 70,
      fontSize: '1.25rem',
      border: '2px solid',
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.primary.main,
      '& > *': {
        borderColor: theme.palette.primary.main,
      },
      '& .loader': {
        backgroundColor: theme.palette.primary.main,
      },
      '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '& .loader': {
          backgroundColor: theme.palette.primary.contrastText,
        },
      },
      '&:disabled': {
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.main,
        opacity: 0.25,
      },
      borderRadius: 20,
      paddingLeft: 30,
      paddingRight: 30,
    },
    ellipsis: {
      color: theme.palette.primary.contrastText,
    },
  }),
);

export interface SubmitButtonProps {
  /**
   * What text give the button with
   */
  label?: string | null | undefined;
  /**
   * OnClickHandler
   */
  clickHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Whether the button is disabled or not
   */
  disabled?: boolean;
  /**
   * Whether or not to display loading field
   */
  loading?: boolean;
}

export const SubmitButton = React.memo(
  ({ label = null, clickHandler, disabled = false, loading = false }: SubmitButtonProps) => {
    const classes = useStyles();

    return (
      <Button
        onClick={loading || disabled ? () => { return } : clickHandler}
        variant='contained'
        className={classes.root}
        disabled={disabled}
      >
        {(disabled || !loading) && <Typography variant='h5'>{label}</Typography>}
        {!disabled && loading && <Ellipsis />}
      </Button>
    );
  },
);

SubmitButton.displayName = 'SubmitButton';
