import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { actionType } from '../core-state/core.store';

interface ICmpProps {
  state: ReadonlyArray<any>;
  suite: ReadonlyArray<ReadonlyArray<any>>;
  actionFn: (e: ReadonlyArray<any>) => actionType;
  actionTrigger$: Subject<any>;
}

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & ICmpProps = a.data as any;
    const optionCmps = data.suite.map(suiteToOptionCmp(data));
    return (
      <div>
        <div>{a.slots().default}</div>
        <select>{optionCmps}</select>
      </div>
    );
  },
};

const suiteToOptionCmp = (data: ICmpProps) => (item: ReadonlyArray<any>, i: number) => (
  <option
    value={i}
    onChange={e => data.actionTrigger$.next(data.actionFn(e.target.value))}
    {...getOptionSelected(data.state, item)}
  >
    SUITE LENGTH: {item.length}
  </option>
);

const getOptionSelected = (state: ReadonlyArray<any>, item: ReadonlyArray<any>) =>
  item === state ? { selected: true } : {};

export const stOnTestbench = { name: 'st-on-testbench', cmp };
