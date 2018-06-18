import { AppBar, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const app = (
  <AppBar>
    <Toolbar>
      <Typography variant="title">Scheduler Lab</Typography>
    </Toolbar>
  </AppBar>
);

ReactDOM.render(app, document.getElementById('app'));
