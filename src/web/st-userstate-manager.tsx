import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import { IUserstateCollection } from '@scheduler-tester/core-state/userstate-collection.interface';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { LayoutMasonry } from './layout-masonry/layout-masonry';
import { breakpoints, BreakpointsEnum } from './responsive/breakpoints';
import { PaddingProps } from './responsive/padding';
import { QueryMatcher } from './responsive/query-matcher';
import { StNewItemLarge } from './st-new-item-large';
import { connect } from './util/connect';
import { mergeProps } from './util/hoc.util';

interface IUserstateManagerFromState {
  userstates: ReadonlyArray<IUserstateCollection>;
}

interface IUserstateManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

const hostStyles = {
  className: css`
    margin-top: 24px;
  `,
};

class StUserstateManagerImpl extends React.PureComponent<
  IUserstateManagerFromState & IUserstateManagerProps
> {
  render() {
    const { userstates, theme, ...defaultHostProps } = this.props;
    if (!userstates) {
      return false;
    }
    const hostProps = mergeProps(PaddingProps(theme), hostStyles, defaultHostProps);
    return (
      <LayoutMasonry itemWidth={'190px'} {...hostProps}>
        <QueryMatcher
          ToRender={StNewItemLarge}
          mediaQuery={`(min-width: ${breakpoints[BreakpointsEnum.xsmall4]}px)`}
        />
        {userstates.map(userstate => <div>{userstate.collectionName}</div>)}
      </LayoutMasonry>
    );
  }
}

const selector = ({
  onTestbenchUserstate,
  userstates,
}: ICoreState): IUserstateManagerFromState => ({
  userstates: userstates[onTestbenchUserstate],
});

export const StUserstateManager = connect(selector, coreState$)<{}, IUserstateManagerFromState>(
  withTheme(StUserstateManagerImpl)
);
