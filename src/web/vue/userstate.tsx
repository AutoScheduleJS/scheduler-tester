import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

import { IUserstateCollection } from '../../core-state/userstate-collection.interface';
import {
  userstateActionType,
  UserstateCollectionUpdateAction,
} from '../../core-state/userstates.reducer';

interface ICmpProps {
  userstateColls: ReadonlyArray<IUserstateCollection>;
  item: IUserstateCollection;
  actionTrigger$: Subject<userstateActionType>;
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
              new UserstateCollectionUpdateAction(
                a.props.userstateColls,
                a.props.item,
                JSON.parse(e.target.value)
              )
            )
          }
        />
      </div>
    );
  },
};

export const stUserstate = { name: 'st-userstate', cmp };
