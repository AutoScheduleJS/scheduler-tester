import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { coreState$ } from '../../core-state/core.store';
import { OnTestbenchQueriesUpdateAction } from '../../core-state/on-testbench-queries.reducer';
// import { OnTestbenchUserstateUpdateAction } from '../../core-state/on-testbench-userstate.reducer';

import onTestbench from './on-testbench';
import StepOption from './step-option';

const OnTestbenchQueries = onTestbench(({ onTestbenchQueries, suites }) => ({
  benchIndex: onTestbenchQueries,
  benchSuite: suites,
}));

const app = (
  <div>
    <div>
      <StepOption {...{ state$: coreState$ }} />
    </div>
    <div>
      <OnTestbenchQueries
        {...{ state$: coreState$, actionFn: e => new OnTestbenchQueriesUpdateAction(e) }}
      >
        Queries on test bench
      </OnTestbenchQueries>
    </div>
  </div>
);
ReactDOM.render(app, document.getElementById('app'));
