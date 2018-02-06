import { css } from 'emotion';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import Vue from 'vue';
import VueRx from 'vue-rx';

import { distinctUntilChanged } from 'rxjs/operators';

import { ICoreState } from '../core-state/core.state';
import { actionTrigger$, actionType, coreState$ } from '../core-state/core.store';
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

import { stDemoViewer } from './demo-viewer';
import { stOnTestbench } from './on-testbench';
import { stQuery } from './query';
import { stStepOption } from './step-option';
import { stSuiteItem } from './suite-item';
import { stSuiteList } from './suite-list';
import { stUserstate } from './userstate';

Vue.use(VueRx, { Observable, Subject, BehaviorSubject });

[stQuery, stUserstate, stSuiteItem, stSuiteList, stStepOption, stOnTestbench, stDemoViewer].forEach(
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
    return (
      <div>
        <div class={displayFlex}>
          <div class={flexShrink(1)}>
            <st-step-option {...{ props: { actionTrigger$, state: state.stepOption } }} />
            <div>Queries Suites: </div>
            <st-suite-list
              {...{
                props: {
                  actionTrigger$,
                  itemCmp: 'st-query',
                  newItemFn: e => new SuitesQueryNewAction(e),
                  newSuiteFn: () => new SuitesNewAction(),
                  state: state.suites,
                },
              }}
            />
            <div>Userstate Suites: </div>
            <st-suite-list
              {...{
                props: {
                  actionTrigger$,
                  itemCmp: 'st-userstate',
                  newItemFn: e => new UserstateCollectionNewAction(e),
                  newSuiteFn: () => new UserstateNewAction(),
                  state: state.userstates,
                },
              }}
            />
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

const displayFlex = css`
  display: flex;
`;
const flexShrink = (val: number) => css`
  flex-shrink: ${val};
`;
const flexGrow = (val: number) => css`
  flex-grow: ${val};
`;

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
