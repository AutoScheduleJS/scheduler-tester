import { IQuery } from '@autoschedule/queries-fn';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import { EditUI } from '@scheduler-tester/core-state/edit.ui.reducer';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { LayoutMasonry } from './layout-masonry/layout-masonry';
import { PaddingProps } from './responsive/padding';
import { StNewItemLarge } from './st-new-item-large';
import { StNewQuery } from './st-new-query';
import { StQueryCard } from './st-query-card';
import { connect } from './util/connect';
import { mergeProps } from './util/hoc.util';
import { MorphWaa } from './util/morph-waa';

interface IQueriesManagerFromState {
  queries: ReadonlyArray<IQuery>;
  edit: EditUI;
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
    const { queries, edit, theme, ...defaultHostProps } = this.props;
    const addQuery = edit.isNew && edit.query ? 'to' : 'from';
    if (!queries) {
      return false;
    }
    const hostProps = mergeProps(PaddingProps(theme), hostStyles, defaultHostProps);
    return (
      <LayoutMasonry itemWidth={'190px'} {...hostProps}>
        <MorphWaa FromElem={StNewItemLarge} ToElem={StNewQuery} state={addQuery} />
        {queries.map(query => <StQueryCard key={query.id} {...{ query }} />)}
      </LayoutMasonry>
    );
  }
}

const selector = ({ onTestbenchQueries, suites, ui }: ICoreState): IQueriesManagerFromState => ({
  queries: suites[onTestbenchQueries],
  edit: ui.edit,
});

export const StQueriesManager = connect(selector, coreState$)<{}, IQueriesManagerFromState>(
  withTheme(StQueriesManagerImpl)
);
