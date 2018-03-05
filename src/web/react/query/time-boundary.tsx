import { ITimeBoundary } from '@autoschedule/queries-fn';
import * as React from 'react';

import { parseValue } from './util';

interface ICmpProps {
  timeBoundary: ITimeBoundary | undefined;
  actionFn: (a: ITimeBoundary | undefined) => void;
}

const cmp: React.SFC<ICmpProps> = ({ actionFn, timeBoundary, children }) => (
  <div>
    <div>{children}</div>
    <textarea
      rows={1}
      defaultValue={JSON.stringify(timeBoundary)}
      key={valueToKey(timeBoundary)}
      onBlur={e => actionFn(parseValue(e.currentTarget.value))}
    />
    <button onClick={() => actionFn({ ...defaultValue })}>default</button>
  </div>
);

export default cmp;

const defaultValue: ITimeBoundary = { min: 1, target: 1, max: 1 };

const valueToKey = (v: ITimeBoundary | undefined): string => {
  return v ? `${v.min}-${v.max}-${v.target}` : '---';
};
