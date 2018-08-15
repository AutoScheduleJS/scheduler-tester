import { IQuery } from '@autoschedule/queries-fn';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import * as React from 'react';
import QueryCard from './query-card';
import { connect } from './util/connect';
import { withTheme } from 'emotion-theming';
import { mergeProps } from './util/hoc.util';
import { css } from 'emotion';
import { PaddingProps } from './responsive/responsive';

interface IQueriesManagerFromState {
  queries: ReadonlyArray<IQuery>;
}

interface IQueriesManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

const themeToHostStyle = (theme: any) => {
  return css`
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
  `;
};

class StQueriesManagerImpl extends React.PureComponent<
  IQueriesManagerFromState & IQueriesManagerProps
> {
  render() {
    const { queries, theme, ...defaultHostProps } = this.props;
    if (!queries) {
      return false;
    }
    const hostProps = mergeProps(
      PaddingProps(theme),
      { className: themeToHostStyle(theme) },
      defaultHostProps
    );
    return (
      <div {...hostProps}>
        {queries.map(query => (
          <div>
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

export const StQueriesManager = connect(selector, coreState$)<{}, IQueriesManagerFromState>(
  withTheme(StQueriesManagerImpl)
);
