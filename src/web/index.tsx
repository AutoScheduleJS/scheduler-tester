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
      main: '#3F51B5',
      lightVariant: '#757DE8',
      darkVariant: '#002984',
      on: 'white',
    },
    secondary: {
      main: '#81D4FA',
      lightVariant: '#B6FFFF',
      darkVariant: '#4BA3C7',
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
