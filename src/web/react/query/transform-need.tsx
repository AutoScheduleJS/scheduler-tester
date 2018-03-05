import { ITaskTransformNeed } from '@autoschedule/queries-fn';
import * as React from 'react';

import { SuitesQueryUpdateAction } from '@scheduler-tester/core-state/suites.reducer';
import { IItemCmpProps } from '../shared/item-props.interface';

import { parseValue, updateTransform, wholeQuery } from './util';

interface ICmpProps extends IItemCmpProps<ITaskTransformNeed> {
  qSuite: ReadonlyArray<wholeQuery>;
  query: wholeQuery;
}

const cmp: React.SFC<ICmpProps> = ({ action, item, query, qSuite }) => {
  const triggerUpdateFn = triggerUpdate({ action, item, query, qSuite });
  const itemStr = JSON.stringify(item);
  return (
    <div>
      <div>Need: </div>
      <textarea
        rows={1}
        defaultValue={itemStr}
        key={itemStr}
        onBlur={e => triggerUpdateFn(parseValue(e.currentTarget.value))}
      />
      <button onClick={() => triggerUpdateFn(defaultNeed)}>default</button>
    </div>
  );
};

export default cmp;

const triggerUpdate = ({ action, qSuite, query, item }) => (need: ITaskTransformNeed) => {
  action(new SuitesQueryUpdateAction(qSuite, query, updateTransform(query, 'needs', item, need)));
};

export const defaultNeed: ITaskTransformNeed = {
  collectionName: 'col',
  find: {},
  quantity: 1,
  ref: '1',
  wait: false,
};
