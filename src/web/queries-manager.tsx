import { IQuery } from '@autoschedule/queries-fn';
import { createStyles, withStyles } from '@material-ui/core';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import * as React from 'react';
import QueryCard from './query-card';
import { connect } from './util/connect';

interface IQueriesManagerFromState {
  queries: ReadonlyArray<IQuery>;
}

const styles = _ =>
  createStyles({
    root: {
      margin: '0 12px',
      display: 'flex',
      flexWraps: 'wrap',
    },
    item: {
      margin: '12px',
    },
  });

class QueriesManager extends React.PureComponent<IQueriesManagerFromState & { classes: any }> {
  render() {
    const { queries, classes } = this.props;
    if (!queries) {
      return false;
    }
    return (
      <div className={classes.root}>
        {queries.map(query => (
          <div className={classes.item}>
            <QueryCard key={query.id} {...{ query }} />
          </div>
        ))}
      </div>
    );
  }
}

const selector = ({ onTestbenchQueries, suites }: ICoreState): IQueriesManagerFromState => ({
  queries: suites[onTestbenchQueries],
});

export default connect(selector, coreState$)<{}, IQueriesManagerFromState>(
  withStyles(styles)(QueriesManager)
);
