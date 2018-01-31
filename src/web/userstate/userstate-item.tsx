import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { IUserstateCollection } from '../../core-state/userstate-collection.interface';
import {
  userstateActionType,
  UserstateCollectionNewAction,
} from '../../core-state/userstates.reducer';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      userstate: ReadonlyArray<IUserstateCollection>;
      actionTrigger$: Subject<userstateActionType>;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    const userstateCmps = data.userstate.map((userstate, _, suite) => (
      <div>
        <st-userstate {...{ actionTrigger$, userstate, suite }} />
      </div>
    ));
    return (
      <div>
        {userstateCmps}
        <button onClick={() => actionTrigger$.next(new UserstateCollectionNewAction(data.userstate))}>
          ADD USERSTATE COLLECTION
        </button>
      </div>
    );
  },
};

export const stUserstateItem = { name: 'st-userstate-item', cmp };
