import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from './root';
import { ThemeProvider } from 'emotion-theming';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const emotionTheme = {
  palette: {
    primary: {
      main: theme.palette.primary.main,
      on: 'white',
    },
    secondary: {
      main: '#81D4FA',
      on: 'black',
    },
    surface: {
      main: '#424242',
      on: 'white',
    },
  },
};

const app = (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <ThemeProvider theme={emotionTheme}>
      <Root />
    </ThemeProvider>
  </MuiThemeProvider>
);

ReactDOM.render(app, document.getElementById('app'));
