import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ICoreState } from '../../core-state/core.state';
import { actionTrigger$, coreState$ } from '../../core-state/core.store';
import { OnTestbenchQueriesUpdateAction } from '../../core-state/on-testbench-queries.reducer';
import { OnTestbenchUserstateUpdateAction } from '../../core-state/on-testbench-userstate.reducer';
import {
  UserstateCollectionNewAction,
  UserstateNewAction,
} from '../../core-state/userstates.reducer';

import { connect } from './util/connect';

import onTestbench from './on-testbench';
import suiteList from './shared/suite-list';
import StepOption from './step-option';
import UserState from './userstate/userstate';

const OnTestbenchQueries = onTestbench(({ onTestbenchQueries, suites }) => ({
  benchIndex: onTestbenchQueries,
  benchSuite: suites,
}));

const OnTestbenchUserstate = onTestbench(({ onTestbenchUserstate, userstates }) => ({
  benchIndex: onTestbenchUserstate,
  benchSuite: userstates,
}));

const UserStateList = connect(
  ({ userstates }: ICoreState) => ({ state: userstates }),
  actionTrigger$
)(suiteList);

const app = (
  <div>
    <div>
      <StepOption {...{ state$: coreState$ }} />
    </div>
    <div>
      <div>Userstate Suites: </div>
      <UserStateList
        {...{
          addLabel: 'ADD USERSTATE',
          itemCmp: UserState,
          newItemFn: e => new UserstateCollectionNewAction(e),
          newSuiteFn: () => new UserstateNewAction(),
          state$: coreState$
        }}
      >
        ADD USERSTATE SUITE
      </UserStateList>
      <OnTestbenchQueries
        {...{ state$: coreState$, actionFn: e => new OnTestbenchQueriesUpdateAction(e) }}
      >
        Queries on test bench
      </OnTestbenchQueries>
      <OnTestbenchUserstate
        {...{ state$: coreState$, actionFn: e => new OnTestbenchUserstateUpdateAction(e) }}
      >
        Userstate on test bench
      </OnTestbenchUserstate>
    </div>
  </div>
);
ReactDOM.render(app, document.getElementById('app'));
