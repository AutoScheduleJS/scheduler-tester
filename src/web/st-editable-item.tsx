import { IQuery } from '@autoschedule/queries-fn';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Morph, MorphParameters } from './react-morph/morph';
import { connect } from './util/connect';
import { mergeProps } from './util/hoc.util';

interface IEditableItemFromState {
  queries: ReadonlyArray<IQuery>;
}

interface IEditableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
  item?: any;
}

const hostStyles = {
  className: css`
    margin-top: 24px;
  `,
};

class StEditableItemImpl extends React.PureComponent<IEditableItemFromState & IEditableItemProps> {
  handleMorph = (data: MorphParameters) => {
    const { queries, theme, ...defaultHostProps } = this.props;
    if (!queries) {
      return false;
    }
    const hostProps = mergeProps(defaultHostProps);
    return <div {...hostProps}>testest</div>;
  };

  render() {
    return <Morph>{this.handleMorph}</Morph>;
  }
}

const selector = ({ onTestbenchQueries, suites }: ICoreState): IEditableItemFromState => ({
  queries: suites[onTestbenchQueries],
});

export const StEditableItem = connect(selector, coreState$)<{}, IEditableItemFromState>(
  withTheme(StEditableItemImpl)
);
