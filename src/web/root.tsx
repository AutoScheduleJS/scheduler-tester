import { createStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import { NewQueryButton } from './new-query';
import { StQueriesManager } from './st-queries-manager';
import { StAppbar } from './st-appbar';
import { StDemoViewer } from './st-demo-viewer';
import { StEditQuery } from './st-edit-query';
import { StEdittabs } from './st-edittabs';
import { QueryMatcher } from './util/query-matcher';

const styles = createStyles({
  parent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'calc(100% - 56px)',
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
            <StQueriesManager />
            <span>Toto</span>
          </StEdittabs>
          <StDemoViewer className={classes.child} />
        </div>
        <NewQueryButton />
        <StEditQuery />
      </React.Fragment>
    );
  }
}

export const Root = withStyles(styles)(RootImpl);
