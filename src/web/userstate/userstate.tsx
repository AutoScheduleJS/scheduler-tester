import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { IUserstateCollection } from '../../core-state/userstate-collection.interface';
import { userstateActionType, UserstateCollectionUpdateAction } from '../../core-state/userstates.reducer';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      userstateColls: ReadonlyArray<IUserstateCollection>;
      userstate: IUserstateCollection;
      actionTrigger$: Subject<userstateActionType>;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    return (
      <div>
        <textarea
          rows="5"
          value={JSON.stringify(data.userstate)}
          onBlur={e =>
            actionTrigger$.next(
              new UserstateCollectionUpdateAction(data.userstateColls, data.userstate, JSON.parse(e.target.value))
            )
          }
        />
      </div>
    );
  },
};

export const stUserstate = { name: 'st-userstate', cmp };
