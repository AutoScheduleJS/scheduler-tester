import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { css } from 'emotion';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditTabsManager } from './edit-tabs-manager';
import { NewQueryButton } from './new-query';
import QueriesManager from './queries-manager';
import { QueryEdit } from './query-edit';

const flexChild = css`
  flex-basis: 0;
  flex-grow: 1;
`;

const flexParent = css`
  display: flex;
  flex-direction: column;
  height: 90%;
`;

const app = (
  <div>
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="title">Scheduler Lab</Typography>
      </Toolbar>
    </AppBar>
    <div className={flexParent}>
      <div className={flexChild}>
        <EditTabsManager labels={['Queries manager', 'User-state manager']}>
          <QueriesManager />
          <span>Toto</span>
        </EditTabsManager>
      </div>
      <div className={flexChild}>
        <p>Test</p>
      </div>
    </div>
    <NewQueryButton />
    <QueryEdit />
  </div>
);

ReactDOM.render(app, document.getElementById('app'));
