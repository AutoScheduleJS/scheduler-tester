import { Subject } from 'rxjs/Subject';
import { CreateElement, FunctionalComponentOptions, VNode } from 'vue';

import { actionType } from '../core-state/core.store';

interface ICmpProps {
  state: ReadonlyArray<any>;
  suite: ReadonlyArray<ReadonlyArray<any>>;
  actionFn: (e: ReadonlyArray<any>) => actionType;
  actionTrigger$: Subject<any>;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    const optionCmps = a.props.suite.map(suiteToOptionCmp(a.props, h));
    return (
      <div>
        <div>{a.slots().default}</div>
        <select>{optionCmps}</select>
      </div>
    );
  },
};

const suiteToOptionCmp = (data: ICmpProps, h: CreateElement) => (item: ReadonlyArray<any>, i: number) => (
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
