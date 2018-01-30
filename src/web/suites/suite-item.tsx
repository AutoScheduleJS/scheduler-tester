import { IQuery } from '@autoschedule/queries-fn';
import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { suiteActionType } from '../../core-state/suites.reducer';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      suite: ReadonlyArray<IQuery>;
      actionTrigger$: Subject<suiteActionType>;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    const queryCmps = data.suite.map((query, _, suite) => (
      <div>
        <st-query {...{ actionTrigger$, query, suite }} />
      </div>
    ));
    return (
      <div>
        {queryCmps}
        <button onClick={() => actionTrigger$.next({ type: 'suitesQueryNew', suite: data.suite })} >ADD QUERY</button>
      </div>
    );
  },
};

export const stSuiteItem = { name: 'st-suite-item', cmp };
