import { ITimeDuration } from '@autoschedule/queries-fn';
import * as React from 'react';

import { displayFlex, flexGrow } from '../shared/style.css';

import { parseValue } from './util';

interface ICmpProps {
  timeDuration: ITimeDuration | undefined;
  actionFn: (a: ITimeDuration | undefined) => void;
}

const cmp: React.SFC<ICmpProps> = ({ actionFn, timeDuration, children }) => (
  <div className={displayFlex}>
    <div>{children}</div>
    <textarea
      className={flexGrow(1)}
      rows={1}
      defaultValue={JSON.stringify(timeDuration)}
      key={valueToString(timeDuration)}
      onBlur={e => actionFn(parseValue(e.currentTarget.value))}
    />
    <button onClick={() => actionFn({ ...defaultValue })}>default</button>
  </div>
);

export default cmp;

const defaultValue: ITimeDuration = { min: 1, target: 1 };

const valueToString = (v: ITimeDuration | undefined) => {
  return v ? `${v.min}-${v.target}` : '--';
}
