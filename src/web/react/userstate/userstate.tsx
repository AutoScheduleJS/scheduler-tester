import * as React from 'react';

import { IUserstateCollection } from '@scheduler-tester/core-state/userstate-collection.interface';
import { UserstateCollectionUpdateAction } from '@scheduler-tester/core-state/userstates.reducer';

import { IItemCmpProps } from '../shared/item-props.interface';

const cmp: React.SFC<IItemCmpProps<IUserstateCollection>> = ({ action, item, suite }) => (
  <div>
    <textarea
      rows={5}
      defaultValue={JSON.stringify(item)}
      onBlur={e =>
        action(new UserstateCollectionUpdateAction(suite, item, JSON.parse(e.currentTarget.value)))
      }
    />
  </div>
);

export default cmp;
