import { Toolbar, Typography } from '@material-ui/core';
import { AppBar } from './app-bar/app-bar';
import * as React from 'react';

export class StAppbar extends React.PureComponent<{}> {
  render() {
    return (
      <AppBar>
        <Toolbar>
          <Typography variant="title">Scheduler Lab</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}
