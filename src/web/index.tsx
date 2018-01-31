import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import Vue from 'vue';
import VueRx from 'vue-rx';

import { ICoreState } from '../core-state/core.state';
import { actionTrigger$, coreState$ } from '../core-state/core.store';
import { SuitesLoadAction } from '../core-state/suites.reducer';

import { stQuery } from './suites/query';
import { stSuiteItem } from './suites/suite-item';
import { stSuiteList } from './suites/suite-list';

Vue.use(VueRx, { Observable, Subject });

[
  stQuery,
  stSuiteItem,
  stSuiteList,
].forEach(obj => Vue.component(obj.name, obj.cmp));

export default new Vue({
  el: '#app',
  beforeCreate() {
    const queries = [];
    actionTrigger$.next(new SuitesLoadAction(queries));
  },
  render(h) {
    const state: ICoreState = this.state;
    return <st-suite-list {...{ actionTrigger$, state: state.suites }} />;
  },
  subscriptions() {
    return {
      state: coreState$,
    };
  },
});
