import { IQuery } from '@autoschedule/queries-fn';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { LayoutMasonry } from './layout-masonry/layout-masonry';
import QueryCard from './query-card';
import { PaddingProps } from './responsive/padding';
import { connect } from './util/connect';
import { mergeProps } from './util/hoc.util';
import { StEditableItem } from './st-editable-item';

interface IQueriesManagerFromState {
  queries: ReadonlyArray<IQuery>;
}

interface IQueriesManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

const hostStyles = {
  className: css`
    margin-top: 24px;
  `,
};

class StQueriesManagerImpl extends React.PureComponent<
  IQueriesManagerFromState & IQueriesManagerProps
> {
  render() {
    const { queries, theme, ...defaultHostProps } = this.props;
    if (!queries) {
      return false;
    }
    const hostProps = mergeProps(PaddingProps(theme), hostStyles, defaultHostProps);
    return (
      <LayoutMasonry itemWidth={'190px'} {...hostProps}>
        <StEditableItem />
        {/* <QueryMatcher
          ToRender={StNewItemLarge}
          action={AddQueryAction}
          mediaQuery={`(min-width: ${breakpoints[BreakpointsEnum.xsmall4]}px)`}
        /> */}
        {/**
         * Use another element than QueryCard to handle morph
         */}
        {queries.map(query => <QueryCard key={query.id} {...{ query }} />)}
      </LayoutMasonry>
    );
  }
}

const selector = ({ onTestbenchQueries, suites }: ICoreState): IQueriesManagerFromState => ({
  queries: suites[onTestbenchQueries],
});

export const StQueriesManager = connect(selector, coreState$)<{}, IQueriesManagerFromState>(
  withTheme(StQueriesManagerImpl)
);
