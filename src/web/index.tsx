import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import Vue from 'vue';
import VueRx from 'vue-rx';

import { ICoreState } from '../core-state/core.state';
import { actionTrigger$, coreState$ } from '../core-state/core.store';
import { OnTestbenchUpdateAction } from '../core-state/on-testbench-queries.reducer';
import { SuitesLoadAction } from '../core-state/suites.reducer';

import suiteCmp from './suite/components';
import userstateCmp from './userstate/components';

import { stOnTestbench } from './on-testbench';
import { stStepOption } from './step-option';

Vue.use(VueRx, { Observable, Subject });

[...suiteCmp, ...userstateCmp, stStepOption, stOnTestbench].forEach(obj =>
  Vue.component(obj.name, obj.cmp)
);

export default new Vue({
  el: '#app',
  beforeCreate() {
    const queries = [];
    actionTrigger$.next(new SuitesLoadAction(queries));
  },
  render(h) {
    const state: ICoreState = this.state;
    const actionFn = e => {
      return new OnTestbenchUpdateAction(e);
    };
    return (
      <div>
        <st-step-option {...{ actionTrigger$, state: state.stepOption }} />
        <st-suite-list {...{ actionTrigger$, state: state.suites }} />
        <st-userstate-list {...{ actionTrigger$, state: state.userstates }} />
        <st-on-testbench
          {...{
            actionFn,
            actionTrigger$,
            state: state.onTestbenchQueries,
            suite: state.suites,
          }}
        />
      </div>
    );
  },
  subscriptions() {
    return {
      state: coreState$,
    };
  },
});
