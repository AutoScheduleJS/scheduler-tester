import { IQuery } from '@autoschedule/queries-fn';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import * as React from 'react';
import QueryCard from './query-card';
import { connect } from './util/connect';

interface IQueriesManagerFromState {
  queries: ReadonlyArray<IQuery>;
}
interface IQueriesManagerProps extends IQueriesManagerFromState {}

class QueriesManager extends React.PureComponent<IQueriesManagerProps> {
  render() {
    const { queries } = this.props;
    console.log(queries);
    if (!queries) {
      return false;
    }
    return queries.map(query => <QueryCard key={query.id} {...{ query }} />);
  }
}

const selector = ({ onTestbenchQueries, suites }: ICoreState): IQueriesManagerFromState => ({
  queries: suites[onTestbenchQueries],
});

export default connect(selector, coreState$)(QueriesManager);
