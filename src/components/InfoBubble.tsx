import React from 'react';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { Box, IconButton } from '@material-ui/core';
import { ReactComponent as InfoIcon } from 'icons/InfoIcon.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      fontFamily: theme.typography.fontFamily,
    },
    infoBox: {
      zIndex: 100,
      padding: 20,
      backgroundColor: 'gray',
      borderRadius: 6,
      border: '0px solid #008000',
      fontSize: '1rem',
      width: '100%',
      maxWidth: 250,
    },
    icon: {
      width: 18,
      height: 18,
    },
  }),
);

export interface InfoBubbleProps {
  /**
   * Message to display in bubble
   */
  message: string;
}

export function InfoBubble({ message }: InfoBubbleProps) {
  const theme = useTheme();
  const classes = useStyles();
  const [buttonPressed, setButtonPressed] = React.useState<boolean>(false);
  const [buttonHover, setButtonHover] = React.useState<boolean>(false);
  const [boxHover, setBoxHover] = React.useState<boolean>(false);

  return (
    <div className={classes.root}>
      <IconButton
        style={{ padding: 6 }}
        onClick={() => setButtonPressed(!buttonPressed)}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
      >
        <InfoIcon className={classes.icon} fill={theme.palette.primary.contrastText} />
      </IconButton>
      {(buttonPressed || buttonHover || boxHover) && (
        <Box
          position='absolute'
          className={classes.infoBox}
          display='flex'
          flexDirection='column'
          flexWrap='wrap'
          alignItems='stretch'
          onMouseEnter={() => setBoxHover(true)}
          onMouseLeave={() => setBoxHover(false)}
        >
          {message}
        </Box>
      )}
    </div>
  );
}
