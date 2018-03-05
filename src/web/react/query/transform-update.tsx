import { ITaskTransformUpdate } from '@autoschedule/queries-fn';
import * as React from 'react';

import { displayFlex, flexGrow } from '../shared/style.css';

import { SuitesQueryUpdateAction } from '@scheduler-tester/core-state/suites.reducer';

import { IItemCmpProps } from '../shared/item-props.interface';
import { parseValue, updateTransform, wholeQuery } from './util';

interface ICmpProps extends IItemCmpProps<ITaskTransformUpdate> {
  qSuite: ReadonlyArray<wholeQuery>;
  query: wholeQuery;
}

const cmp: React.SFC<ICmpProps> = ({ action, item, query, qSuite }) => {
  const triggerUpdateFn = triggerUpdate({ action, item, query, qSuite });
  const itemStr = JSON.stringify(item);
  return (
    <div className={displayFlex}>
      <div>Update</div>
      <textarea
        className={flexGrow(1)}
        rows={3}
        defaultValue={itemStr}
        key={itemStr}
        onBlur={e => triggerUpdateFn(parseValue(e.currentTarget.value))}
      />
      <button onClick={() => triggerUpdateFn(defaultUpdate)}>default</button>
    </div>
  );
};

export default cmp;

const triggerUpdate = ({ action, qSuite, query, item }) => (update: ITaskTransformUpdate) => {
  action(
    new SuitesQueryUpdateAction(qSuite, query, updateTransform(query, 'updates', item, update))
  );
};

export const defaultUpdate: ITaskTransformUpdate = {
  ref: '1',
  update: [{ property: '', value: '' }],
  wait: false,
};
