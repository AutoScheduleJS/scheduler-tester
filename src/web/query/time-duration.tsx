import { ITimeDuration } from '@autoschedule/queries-fn';
import { FunctionalComponentOptions, VNode } from 'vue';

import { parseValue } from './util';

interface ICmpProps {
  timeDuration: ITimeDuration;
  actionFn: (a: ITimeDuration) => void;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    return (
      <div>
        <div>{a.slots().default}</div>
        <textarea
          rows="1"
          value={JSON.stringify(a.props.timeDuration)}
          onBlur={e => a.props.actionFn(parseValue(e.target.value))}
        />
        <button onClick={() => a.props.actionFn({...defaultValue})}>default</button>
      </div>
    );
  },
};

const defaultValue: ITimeDuration = { min: 1, target: 1 };

export const stTimeDuration = { name: 'st-time-duration', cmp };
