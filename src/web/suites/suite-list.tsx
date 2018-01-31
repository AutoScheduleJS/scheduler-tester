import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { suitesType } from '../../core-state/core.state';
import { suiteActionType, SuitesNewAction } from '../../core-state/suites.reducer';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      state: suitesType;
      actionTrigger$: Subject<suiteActionType>;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    const suites = data.state.map((suite) => (
      <div>
        <st-suite-item {...{ actionTrigger$, suite }} />
      </div>
    ));
    return (
      <div>
        {suites}
        <button onClick={() => actionTrigger$.next(new SuitesNewAction())} >ADD SUITE</button>
      </div>
    );
  },
};

export const stSuiteList = { name: 'st-suite-list', cmp };
