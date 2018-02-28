import { css } from 'emotion';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import Vue from 'vue';
import VueRx from 'vue-rx';

import { distinctUntilChanged } from 'rxjs/operators';

import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, actionType, coreState$ } from '@scheduler-tester/core-state/core.store';
import { OnTestbenchQueriesUpdateAction } from '@scheduler-tester/core-state/on-testbench-queries.reducer';
import { OnTestbenchUserstateUpdateAction } from '@scheduler-tester/core-state/on-testbench-userstate.reducer';
import {
  SuitesLoadAction,
  SuitesNewAction,
  SuitesQueryNewAction,
} from '@scheduler-tester/core-state/suites.reducer';
import {
  UserstateCollectionNewAction,
  UserstateLoadAction,
  UserstateNewAction,
} from '@scheduler-tester/core-state/userstates.reducer';

import { displayFlex, flexGrow, flexShrink, minWidth } from './shared/style.css';

import { stDemoViewer } from './demo-viewer';
import { stOnTestbench } from './on-testbench';
import { stQueryCmps } from './query/index';
import { stSharedCmps } from './shared/index';
import { stStepOption } from './step-option';
import { stUserstate } from './userstate';

Vue.use(VueRx, { Observable, Subject, BehaviorSubject });

[...stSharedCmps, ...stQueryCmps, stUserstate, stStepOption, stOnTestbench, stDemoViewer].forEach(
  obj => Vue.component(obj.name, obj.cmp as any)
);

const vueAppObj = {
  el: '#app',
  beforeCreate() {
    initializeState(actionTrigger$);
    // saveState(coreState$);
  },
  render(h) {
    const state: ICoreState = this.state;
    Object.defineProperty(this.state, 'nested', { configurable: false });
    return (
      <div>
        <div class={displayFlex}>
          <div
            class={css`${flexShrink(1)} ${minWidth('20%')}`}
          >
            <st-step-option {...{ props: { actionTrigger$, state: state.stepOption } }} />
            <div>Queries Suites: </div>
            <st-suite-list
              {...{
                props: {
                  actionTrigger$,
                  addLabel: 'ADD QUERY',
                  itemCmp: 'st-query',
                  newItemFn: e => new SuitesQueryNewAction(e),
                  newSuiteFn: () => new SuitesNewAction(),
                  state: state.suites,
                },
              }}
            >
              ADD QUERIES SUITE
            </st-suite-list>
            <div>Userstate Suites: </div>
            <st-suite-list
              {...{
                props: {
                  actionTrigger$,
                  addLabel: 'ADD USERSTATE',
                  itemCmp: 'st-userstate',
                  newItemFn: e => new UserstateCollectionNewAction(e),
                  newSuiteFn: () => new UserstateNewAction(),
                  state: state.userstates,
                },
              }}
            >
              ADD USERSTATE SUITE
            </st-suite-list>
            <st-on-testbench
              {...{
                props: {
                  actionFn: e => new OnTestbenchQueriesUpdateAction(e),
                  actionTrigger$,
                  state: state.onTestbenchQueries,
                  suite: state.suites,
                },
              }}
            >
              Queries on test bench
            </st-on-testbench>
            <st-on-testbench
              {...{
                props: {
                  actionFn: e => new OnTestbenchUserstateUpdateAction(e),
                  actionTrigger$,
                  state: state.onTestbenchUserstate,
                  suite: state.userstates,
                },
              }}
            >
              Userstate on test bench
            </st-on-testbench>
          </div>
          <div class={flexGrow(1)}>
            <st-demo-viewer {...{ props: { state } }} />
          </div>
        </div>
      </div>
    );
  },
  subscriptions() {
    return {
      state: coreState$,
    };
  },
};

const parseJsonOr = (key: string, defaultItm: any): any => {
  const item = localStorage.getItem(key);
  return !item ? defaultItm : JSON.parse(item);
};

const coreStateSuitesKey = 'core-state-suites';
const coreStateUserstatesKey = 'core-state-userstates';

const initializeState = (actionTrigger: Subject<actionType>): void => {
  const queries = parseJsonOr(coreStateSuitesKey, []);
  const userstates = parseJsonOr(coreStateUserstatesKey, []);
  actionTrigger.next(new SuitesLoadAction(queries));
  actionTrigger.next(new UserstateLoadAction(userstates));
};

const saveState = (state$: Observable<ICoreState>): void => {
  state$
    .pipe(
      distinctUntilChanged((sa: ICoreState, sb: ICoreState) => {
        return sa.suites === sb.suites && sa.userstates === sb.userstates;
      })
    )
    .subscribe(state => {
      localStorage.setItem(coreStateSuitesKey, JSON.stringify(state.suites));
      localStorage.setItem(coreStateUserstatesKey, JSON.stringify(state.userstates));
    });
};

export default new Vue(vueAppObj);
