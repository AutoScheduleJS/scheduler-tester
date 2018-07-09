import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { css } from 'emotion';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StDemoViewer } from './st-demo-viewer';
import { NewQueryButton } from './new-query';
import QueriesManager from './queries-manager';
import { StQueryEdit } from './st-query-edit';
import { StAppbar } from './st-appbar';
import { StEdittabs } from './st-edittabs';

const flexChild = css`
  flex-basis: 0;
  flex-grow: 1;
`;

const flexParent = css`
  display: flex;
  flex-direction: column;
  height: 90%;
`;

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const app = (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <StAppbar />
    <div className={flexParent}>
      <StEdittabs className={flexChild}>
        <QueriesManager />
        <span>Toto</span>
      </StEdittabs>
      <div className={flexChild}>
        <StDemoViewer />
      </div>
    </div>
    <NewQueryButton />
    <StQueryEdit />
  </MuiThemeProvider>
);

ReactDOM.render(app, document.getElementById('app'));
