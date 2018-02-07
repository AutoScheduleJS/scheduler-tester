import { ITimeBoundary } from '@autoschedule/queries-fn';
import { FunctionalComponentOptions, VNode } from 'vue';

import { parseValue } from './util';

interface ICmpProps {
  timeBoundary: ITimeBoundary;
  actionFn: (a: ITimeBoundary | undefined) => void;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    const defaultValue: ITimeBoundary = { min: 1, target: 1, max: 1 };
    return (
      <div>
        <div>{a.slots().default}</div>
        <textarea
          rows="1"
          value={JSON.stringify(a.props.timeBoundary)}
          onBlur={e => a.props.actionFn(parseValue(e.target.value))}
        />
        <button onClick={() => a.props.actionFn(defaultValue)}>default</button>
      </div>
    );
  },
};

export const stTimeBoundary = { name: 'st-time-boundary', cmp };
