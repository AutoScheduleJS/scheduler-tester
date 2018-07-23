import * as React from 'react';
import { AppBarContent } from './app-bar-content/app-bar-content';
import { AppBar } from './app-bar/app-bar';

export class StAppbar extends React.PureComponent<{}> {
  render() {
    return (
      <AppBar>
        <AppBarContent title="Scheduler Lab" />
      </AppBar>
    );
  }
}
