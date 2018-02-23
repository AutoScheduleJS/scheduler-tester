import { ITimeBoundary } from '@autoschedule/queries-fn';
import { FunctionalComponentOptions, VNode } from 'vue';

import { displayFlex, flexGrow } from '../shared/style.css';

import { parseValue } from './util';

interface ICmpProps {
  timeBoundary: ITimeBoundary;
  actionFn: (a: ITimeBoundary | undefined) => void;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    return (
      <div class={displayFlex}>
        <div>{a.slots().default}</div>
        <textarea
          class={flexGrow(1)}
          rows="1"
          value={JSON.stringify(a.props.timeBoundary)}
          onBlur={e => a.props.actionFn(parseValue(e.target.value))}
        />
        <button onClick={() => a.props.actionFn({...defaultValue})}>default</button>
      </div>
    );
  },
};

const defaultValue: ITimeBoundary = { min: 1, target: 1, max: 1 };

export const stTimeBoundary = { name: 'st-time-boundary', cmp };
