import * as React from 'react';

import { ICoreState } from '../../../core-state/core.state';
import { actionTrigger$, actionType } from '../../../core-state/core.store';
import { IUserstateCollection } from '../../../core-state/userstate-collection.interface';
import {
  userstateActionType,
  UserstateCollectionUpdateAction,
} from '../../../core-state/userstates.reducer';

import { connect } from '../util/connect';

interface IState {
  userstateColls: ReadonlyArray<IUserstateCollection>;
  item: IUserstateCollection;
}

interface ICmpProps extends IState {
  action: (u: actionType) => void;
}

const cmp: React.SFC<ICmpProps> = ({ userstateColls, item, action }) => (
  <div>
    <textarea
      rows={5}
      value={JSON.stringify(item)}
      onBlur={e =>
        action(
          new UserstateCollectionUpdateAction(
            userstateColls,
            item,
            JSON.parse(e.currentTarget.value)
          )
        )
      }
    />
  </div>
);

export default (selector: (s: ICoreState) => IState) => connect(selector, actionTrigger$)(cmp);
