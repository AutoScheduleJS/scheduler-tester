import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { breakpoints, BreakpointsEnum } from './responsive/breakpoints';
import { ResponsiveTheme } from './responsive/responsive-theme';
import { Root } from './root';
import { merge } from './util/hoc.util';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const emotionTheme = {
  layout: {
    gutter: '24px',
    margin: '24px',
  },
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

const breakKeyToNewTheme = (_: any, key: string) => {
  console.log('key: ', key);
  const widthKey = +key;
  if (Number.isNaN(widthKey)) {
    return;
  }
  if (widthKey < BreakpointsEnum.small2) {
    return {
      layout: {
        gutter: '16px',
        margin: '16px',
      },
    };
  } else {
    return {
      layout: {
        gutter: '24px',
        margin: '24px',
      },
    };
  }
};

const handleBreakpoints = (theme: any, keys: string[]) => {
  return keys.reduce((acc, key) => {
    return merge(acc, breakKeyToNewTheme(acc, key));
  }, theme);
};

const rules = Object.entries(breakpoints).map(([key, val], i, arr) => {
  const query = `(min-width: ${val}px)`;
  if (i === arr.length - 1) {
    return { key, query };
  }
  return { key, query: `(max-width: ${arr[i + 1][1] - 1}px) and ${query}` };
});

const app = (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <ResponsiveTheme baseTheme={emotionTheme} rules={rules} handleBreakpoint={handleBreakpoints}>
      <Root />
    </ResponsiveTheme>
  </MuiThemeProvider>
);

ReactDOM.render(app, document.getElementById('app'));
