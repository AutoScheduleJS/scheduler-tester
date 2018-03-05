import { ITimeBoundary } from '@autoschedule/queries-fn';
import * as React from 'react';

import { displayFlex, flexGrow } from '../shared/style.css';

interface ICmpProps {
  timeBoundary: ITimeBoundary | undefined;
  actionFn: (a: ITimeBoundary | undefined) => void;
}

const cmp: React.SFC<ICmpProps> = ({ actionFn, timeBoundary, children }) => (
  <div className={displayFlex}>
    <div>{children}</div>
    <textarea
      className={flexGrow(1)}
      rows={1}
      defaultValue={JSON.stringify(timeBoundary ? timeBoundary.target : null)}
      key={valueToKey(timeBoundary)}
      onBlur={e => actionFn(inputValueToTimeBoundary(timeBoundary, e.currentTarget.value))}
    />
    <button onClick={() => actionFn({ ...defaultValue })}>default</button>
  </div>
);

export default cmp;

const defaultValue: ITimeBoundary = { min: 1, target: 1, max: 1 };

const inputValueToTimeBoundary = (timeBoundary: ITimeBoundary | undefined, v: string) => {
  return v.length === 0 ? undefined : {...(timeBoundary || {}), target: +v };
}

const valueToKey = (v: ITimeBoundary | undefined): string => {
  return v ? `${v.min}-${v.max}-${v.target}` : '---';
};
