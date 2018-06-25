import { AppBar, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TabsManager } from './shared/tabs-manager';
import QueriesManager from './queries-manager';
import { QueryEdit } from './query-edit';

const app = (
  <div>
    <AppBar position='sticky'>
      <Toolbar>
        <Typography variant="title">Scheduler Lab</Typography>
      </Toolbar>
    </AppBar>
    <TabsManager labels={['Queries manager', 'User-state manager']}>
      <QueriesManager />
      <span>Toto</span>
    </TabsManager>
    <QueryEdit />
  </div>
);

ReactDOM.render(app, document.getElementById('app'));
