import { createStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import { NewQueryButton } from './new-query';
import QueriesManager from './queries-manager';
import { StAppbar } from './st-appbar';
import { StDemoViewer } from './st-demo-viewer';
import { StEditQuery } from './st-edit-query';
import { StEdittabs } from './st-edittabs';

const styles = createStyles({
  parent: {
    display: 'flex',
    flexDirection: 'column',
    height: '90 %',
  },
  child: {
    flexBasis: 0,
    flexGrow: 1,
  },
});

class RootImpl extends React.PureComponent<{ classes: any }> {
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <StAppbar />
        <div className={classes.parent}>
          <StEdittabs className={classes.child}>
            <QueriesManager />
            <span>Toto</span>
          </StEdittabs>
          <div className={classes.child}>
            <StDemoViewer />
          </div>
        </div>
        <NewQueryButton />
        <StEditQuery />
      </React.Fragment>
    );
  }
}

export const Root = withStyles(styles)(RootImpl);