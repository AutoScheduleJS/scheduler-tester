import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import Vue from 'vue';
import VueRx from 'vue-rx';

import { ICoreState } from '../core-state/core.state';
import { actionTrigger$, coreState$ } from '../core-state/core.store';
import { SuitesLoadAction } from '../core-state/suites.reducer';

import suiteCmp from './suite/components';
import userstateCmp from './userstate/components';

Vue.use(VueRx, { Observable, Subject });

[
  ...suiteCmp,
  ...userstateCmp,
].forEach(obj => Vue.component(obj.name, obj.cmp));

export default new Vue({
  el: '#app',
  beforeCreate() {
    const queries = [];
    actionTrigger$.next(new SuitesLoadAction(queries));
  },
  render(h) {
    const state: ICoreState = this.state;
    return (
    <div>
      <st-suite-list {...{ actionTrigger$, state: state.suites }} />
      <st-userstate-list {...{ actionTrigger$, state: state.userstates }} />
    </div>
    );
  },
  subscriptions() {
    return {
      state: coreState$,
    };
  },
});
