import { css } from 'emotion';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import Vue from 'vue';
import VueRx from 'vue-rx';

import { ICoreState } from '../core-state/core.state';
import { actionTrigger$, coreState$ } from '../core-state/core.store';
import { OnTestbenchQueriesUpdateAction } from '../core-state/on-testbench-queries.reducer';
import { OnTestbenchUserstateUpdateAction } from '../core-state/on-testbench-userstate.reducer';
import {
  SuitesLoadAction,
  SuitesNewAction,
  SuitesQueryNewAction,
} from '../core-state/suites.reducer';
import {
  UserstateCollectionNewAction,
  UserstateLoadAction,
  UserstateNewAction,
} from '../core-state/userstates.reducer';

import { stOnTestbench } from './on-testbench';
import { stQuery } from './query';
import { stStepOption } from './step-option';
import { stSuiteItem } from './suite-item';
import { stSuiteList } from './suite-list';
import { stUserstate } from './userstate';

Vue.use(VueRx, { Observable, Subject });

[stQuery, stUserstate, stSuiteItem, stSuiteList, stStepOption, stOnTestbench].forEach(obj =>
  Vue.component(obj.name, obj.cmp)
);

export default new Vue({
  el: '#app',
  beforeCreate() {
    const queries = [];
    const userstates = [];
    actionTrigger$.next(new SuitesLoadAction(queries));
    actionTrigger$.next(new UserstateLoadAction(userstates));
  },
  render(h) {
    const state: ICoreState = this.state;
    const actionFnQueries = e => new OnTestbenchQueriesUpdateAction(e);
    const actionFnUserstate = e => new OnTestbenchUserstateUpdateAction(e);
    return (
      <div>
        <div
          class={css`
            display: flex;
            flex-direction: row;
          `}
        >
          <div
            class={css`
              flex-shrink: 1;
            `}
          >
            <st-step-option {...{ actionTrigger$, state: state.stepOption }} />
            <div>Queries Suites: </div>
            <st-suite-list
              {...{
                actionTrigger$,
                itemCmp: 'st-query',
                newItemFn: e => new SuitesQueryNewAction(e),
                newSuiteFn: () => new SuitesNewAction(),
                state: state.suites,
              }}
            />
            <div>Userstate Suites: </div>
            <st-suite-list
              {...{
                actionTrigger$,
                itemCmp: 'st-userstate',
                newItemFn: e => new UserstateCollectionNewAction(e),
                newSuiteFn: () => new UserstateNewAction(),
                state: state.userstates,
              }}
            />
            <st-on-testbench
              {...{
                actionFn: actionFnQueries,
                actionTrigger$,
                state: state.onTestbenchQueries,
                suite: state.suites,
              }}
            >
              Queries on test bench
            </st-on-testbench>
            <st-on-testbench
              {...{
                actionFn: actionFnUserstate,
                actionTrigger$,
                state: state.onTestbenchUserstate,
                suite: state.userstates,
              }}
            >
              Userstate on test bench
            </st-on-testbench>
          </div>
          <div
            class={css`
              flex-grow: 1;
            `}
          />
        </div>
      </div>
    );
  },
  subscriptions() {
    return {
      state: coreState$,
    };
  },
});
