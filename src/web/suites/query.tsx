import { IQuery } from '@autoschedule/queries-fn';
import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { suiteActionType } from '../../core-state/suites.reducer';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      suite: ReadonlyArray<IQuery>;
      query: IQuery;
      actionTrigger$: Subject<suiteActionType>;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    return (
      <div>
        <input
          type="text"
          value={JSON.stringify(data.query)}
          onBlur={e =>
            actionTrigger$.next({
              new: JSON.parse(e.target.value),
              old: data.query,
              suite: data.suite,
              type: 'suitesQueryUpdate',
            })
          }
        />
      </div>
    );
  },
};

export const stQuery = { name: 'st-query', cmp };
