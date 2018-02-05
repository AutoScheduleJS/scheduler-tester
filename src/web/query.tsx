import { IQuery } from '@autoschedule/queries-fn';
import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

import { suiteActionType, SuitesQueryUpdateAction } from '../core-state/suites.reducer';

interface ICmpProps {
  suite: ReadonlyArray<IQuery>;
  item: IQuery;
  actionTrigger$: Subject<suiteActionType>;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    return (
      <div>
        <textarea
          rows="5"
          value={JSON.stringify(a.props.item)}
          onBlur={e =>
            a.props.actionTrigger$.next(
              new SuitesQueryUpdateAction(a.props.suite, a.props.item, JSON.parse(e.target.value))
            )
          }
        />
      </div>
    );
  },
};

export const stQuery = { name: 'st-query', cmp };
