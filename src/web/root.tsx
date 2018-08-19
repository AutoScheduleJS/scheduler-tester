import { css } from 'emotion';
import * as React from 'react';
import { NewQueryButton } from './st-new-item';
import { breakpoints, BreakpointsEnum } from './responsive/breakpoints';
import { QueryMatcher } from './responsive/query-matcher';
import { StAppbar } from './st-appbar';
import { StDemoViewer } from './st-demo-viewer';
import { StEditQuery } from './st-edit-query';
import { StEdittabs } from './st-edittabs';
import { StQueriesManager } from './st-queries-manager';
import { StQueriesNUserstate } from './st-queries-n-userstate';
import { StUserstateManager } from './st-userstate-manager';

const parentStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 56px);
`;

const childStyle = css`
  flex-basis: 0;
  flex-grow: 1;
`;

const managementArea = (isLarge: boolean) =>
  isLarge ? (
    <StQueriesNUserstate className={childStyle} />
  ) : (
    <StEdittabs className={childStyle}>
      <StQueriesManager />
      <StUserstateManager />
    </StEdittabs>
  );

class RootImpl extends React.PureComponent<{}> {
  render() {
    return (
      <React.Fragment>
        <StAppbar />
        <div className={parentStyle}>
          <QueryMatcher mediaQuery={`(min-width: ${breakpoints[BreakpointsEnum.large1]}px)`}>
            {managementArea}
          </QueryMatcher>
          <StDemoViewer />
        </div>
        <QueryMatcher
          ToRender={NewQueryButton}
          mediaQuery={`(max-width: ${breakpoints[BreakpointsEnum.xsmall4]}px)`}
        />
        <StEditQuery />
      </React.Fragment>
    );
  }
}

export const Root = RootImpl;
