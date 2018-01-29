import { Observable } from 'rxjs/Observable';
import Vue from 'vue';

import 'rxjs/add/observable/of';

Vue.component('hello-cmpt', {
  functional: true,
  props: {},
  render: (h, a) => {
    return <div>test</div>;
  },
});

export default new Vue({
  el: '#app',
  render: (h) => {
    return (
      <hello-cmpt />
    );
  }
});
