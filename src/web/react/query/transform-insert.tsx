import { IQueryInternal, ITaskTransformInsert } from '@autoschedule/queries-fn';
import { SuitesQueryUpdateAction } from '@scheduler-tester/core-state/suites.reducer';
import * as React from 'react';
import { IItemCmpProps } from '../shared/item-props.interface';
import { displayFlex, flexGrow } from '../shared/style.css';
import { parseValue, updateTransform } from './util';

interface ICmpProps extends IItemCmpProps<ITaskTransformInsert> {
  qSuite: ReadonlyArray<IQueryInternal>;
  query: IQueryInternal;
}

const cmp: React.SFC<ICmpProps> = ({ action, item, query, qSuite }) => {
  const triggerUpdateFn = triggerUpdate({ action, item, query, qSuite });
  const itemStr = JSON.stringify(item);
  return (
    <div className={displayFlex}>
      <div>Insert</div>
      <textarea
        className={flexGrow(1)}
        rows={3}
        defaultValue={itemStr}
        key={itemStr}
        onBlur={e => triggerUpdateFn(parseValue(e.currentTarget.value))}
      />
      <button onClick={() => triggerUpdateFn(defaultInsert)}>default</button>
    </div>
  );
};

export default cmp;

const triggerUpdate = ({ action, qSuite, query, item }) => (insert: ITaskTransformInsert) => {
  action(
    new SuitesQueryUpdateAction(qSuite, query, updateTransform(query, 'inserts', item, insert))
  );
};

export const defaultInsert: ITaskTransformInsert = {
  collectionName: 'col',
  doc: {},
  wait: false,
};
