import { ITimeDuration } from '@autoschedule/queries-fn';
import * as React from 'react';

import { parseValue } from './util';

interface ICmpProps {
  timeDuration: ITimeDuration | undefined;
  actionFn: (a: ITimeDuration | undefined) => void;
}

const cmp: React.SFC<ICmpProps> = ({ actionFn, timeDuration, children }) => (
  <div>
    <div>{children}</div>
    <textarea
      rows={1}
      defaultValue={JSON.stringify(timeDuration)}
      onBlur={e => actionFn(parseValue(e.currentTarget.value))}
    />
    <button onClick={() => actionFn({ ...defaultValue })}>default</button>
  </div>
);

export default cmp;

const defaultValue: ITimeDuration = { min: 1, target: 1 };
