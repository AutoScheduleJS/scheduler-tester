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
    name: 'large',
    gutter: '24px',
    margin: '24px',
  },
  dialog: {
    fullscreen: false,
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
      background: '#303030',
      on: 'white',
    },
  },
};

/**
 *
 * TODO: improve this gibelish
 */
const breakKeyToNewTheme = (theme: any, key: string): any => {
  const widthKey = +key;
  if (Number.isNaN(widthKey)) {
    return;
  }
  if (widthKey < BreakpointsEnum.small2) {
    if (theme.layout.name === 'small') {
      return;
    }
    return {
      layout: { name: 'small', gutter: '16px', margin: '16px' },
      dialog: { fullscreen: true },
    };
  }
  if (widthKey < BreakpointsEnum.medium1) {
    if (theme.layout.name === 'small4') {
      return;
    }
    return { layout: { name: 'small4' }, dialog: { fullscreen: false } };
  }
  if (theme.layout.name !== 'large') {
    return {
      layout: { name: 'large', gutter: '24px', margin: '24px' },
      dialog: { fullscreen: true },
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
