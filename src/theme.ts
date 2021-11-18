import { red } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  export interface TypeBackground {
    gradient: {
      top: string;
      bottom: string;
    };
  }
}

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#912dff',
      dark: '#5a56d6',
    },
    secondary: {
      main: '#2c2c2c',
      dark: '#000',
      contrastText: '#e1e1e1',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#eeeeee',
      paper: '#fff',
      gradient: {
        top: '#FFFFFF',
        bottom: '#F8F8F8',
      },
    },
  },
  typography: {
    htmlFontSize: 10,
    fontFamily: ['Raleway', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    subtitle1: {
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1.5rem',
    },
  },
});

export default theme;
