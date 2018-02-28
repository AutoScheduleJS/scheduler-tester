import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, coreState$ } from '@scheduler-tester/core-state/core.store';
import { OnTestbenchQueriesUpdateAction } from '@scheduler-tester/core-state/on-testbench-queries.reducer';
import { OnTestbenchUserstateUpdateAction } from '@scheduler-tester/core-state/on-testbench-userstate.reducer';
import { SuitesNewAction, SuitesQueryNewAction } from '@scheduler-tester/core-state/suites.reducer';
import {
  UserstateCollectionNewAction,
  UserstateNewAction,
} from '@scheduler-tester/core-state/userstates.reducer';

import { connect } from './util/connect';

import onTestbench from './on-testbench';
import Query from './query/query';
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

const QueryList = connect(({ suites }: ICoreState) => ({ state: suites }), actionTrigger$)(
  suiteList
);

const app = (
  <div>
    <div>
      <StepOption {...{ state$: coreState$ }} />
    </div>
    <div>
      <div>Queries Suites: </div>
      <QueryList
        {...{
          addLabel: 'ADD QUERY',
          itemCmp: Query,
          newItemFn: e => new SuitesQueryNewAction(e),
          newSuiteFn: () => new SuitesNewAction(),
          state$: coreState$,
        }}
      >
        ADD QUERIES SUITE
      </QueryList>
      <div>Userstate Suites: </div>
      <UserStateList
        {...{
          addLabel: 'ADD USERSTATE',
          itemCmp: UserState,
          newItemFn: e => new UserstateCollectionNewAction(e),
          newSuiteFn: () => new UserstateNewAction(),
          state$: coreState$,
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
