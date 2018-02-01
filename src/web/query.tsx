import { IQuery } from '@autoschedule/queries-fn';
import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { suiteActionType, SuitesQueryUpdateAction } from '../core-state/suites.reducer';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      suite: ReadonlyArray<IQuery>;
      item: IQuery;
      actionTrigger$: Subject<suiteActionType>;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    return (
      <div>
        <textarea
          rows="5"
          value={JSON.stringify(data.item)}
          onBlur={e =>
            actionTrigger$.next(
              new SuitesQueryUpdateAction(data.suite, data.item, JSON.parse(e.target.value))
            )
          }
        />
      </div>
    );
  },
};

export const stQuery = { name: 'st-query', cmp };
