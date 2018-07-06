import { AppBar, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';

export class StAppbar extends React.PureComponent<{}> {
  render() {
    return (
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="title">Scheduler Lab</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}
