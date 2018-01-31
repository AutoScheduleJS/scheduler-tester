import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { userstatesType } from '../../core-state/core.state';
import { userstateActionType, UserstateNewAction } from '../../core-state/userstates.reducer';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      state: userstatesType;
      actionTrigger$: Subject<userstateActionType>;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    const userstates = data.state.map((userstate) => (
      <div>
        <st-userstate-item {...{ actionTrigger$, userstate }} />
      </div>
    ));
    return (
      <div>
        {userstates}
        <button onClick={() => actionTrigger$.next(new UserstateNewAction())} >ADD USERSTATE</button>
      </div>
    );
  },
};

export const stUserstateList = { name: 'st-userstate-list', cmp };
