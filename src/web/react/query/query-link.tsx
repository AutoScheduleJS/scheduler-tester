import { IQueryInternal, IQueryLink } from '@autoschedule/queries-fn';
import { SuitesQueryUpdateAction } from '@scheduler-tester/core-state/suites.reducer';
import * as React from 'react';
import { IItemCmpProps } from '../shared/item-props.interface';
import { displayFlex, flexGrow } from '../shared/style.css';
import { parseValue } from './util';

interface ICmpProps extends IItemCmpProps<IQueryLink> {
  qSuite: ReadonlyArray<IQueryInternal>;
  query: IQueryInternal;
}

const cmp: React.SFC<ICmpProps> = ({ action, item, query, qSuite }) => {
  const triggerUpdateFn = triggerUpdate({ action, item, query, qSuite });
  const itemStr = JSON.stringify(item);
  return (
    <div className={displayFlex}>
      <div>Link</div>
      <textarea
        className={flexGrow(1)}
        rows={3}
        defaultValue={itemStr}
        key={itemStr}
        onBlur={e => triggerUpdateFn(parseValue(e.currentTarget.value))}
      />
      <button onClick={() => triggerUpdateFn(defaultLink)}>default</button>
    </div>
  );
};

export default cmp;

const triggerUpdate = ({ action, qSuite, query, item }) => (update: IQueryLink) => {
  action(new SuitesQueryUpdateAction(qSuite, query, updateLink(query, item, update)));
};

export const pushLink = (q: IQueryInternal): IQueryInternal => {
  const links = q.links || [];
  return { ...q, links: [...links, defaultLink] };
};

const updateLink = (
  q: IQueryInternal,
  oldLink: IQueryLink,
  newLink: IQueryLink
): IQueryInternal => {
  const links = q.links || [];
  const newTransforms = links.map(t => (t !== oldLink ? t : newLink));
  return { ...q, links: newTransforms };
};

const defaultLink: IQueryLink = {
  distance: { max: 10, min: 5 },
  origin: 'end',
  potentialId: 0,
  queryId: 0,
};
