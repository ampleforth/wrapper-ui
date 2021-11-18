import React from "react";
import theme from "../src/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import 'typeface-montserrat-alternates';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <MuiThemeProvider theme={theme}>
      <Story />
    </MuiThemeProvider>
  ),
];