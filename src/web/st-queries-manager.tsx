import { IQuery } from '@autoschedule/queries-fn';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import { AddQueryAction } from '@scheduler-tester/core-state/global.ui.reducer';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { LayoutMasonry } from './layout-masonry/layout-masonry';
import { StQueryCard } from './st-query-card';
import { PaddingProps } from './responsive/padding';
import { StEditQuery } from './st-edit-query';
import { StEditableItem } from './st-editable-item';
import { StNewItemLarge } from './st-new-item-large';
import { connect } from './util/connect';
import { mergeProps } from './util/hoc.util';

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
        <StEditableItem
          action={AddQueryAction}
          ItemCardCmp={StNewItemLarge}
          ItemEditCmp={StEditQuery}
        />
        {/* <QueryMatcher
          ToRender={StNewItemLarge}
          action={AddQueryAction}
          mediaQuery={`(min-width: ${breakpoints[BreakpointsEnum.xsmall4]}px)`}
        /> */}
        {/**
         * Use another element than QueryCard to handle morph
         */}
        {queries.map(query => <StQueryCard key={query.id} {...{ query }} />)}
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
