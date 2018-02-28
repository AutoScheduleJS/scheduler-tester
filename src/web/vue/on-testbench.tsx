import { Subject } from 'rxjs/Subject';
import { CreateElement, FunctionalComponentOptions, VNode } from 'vue';

import { actionType } from '@scheduler-tester/core-state/core.store';

interface ICmpProps {
  state: number;
  suite: ReadonlyArray<ReadonlyArray<any>>;
  actionFn: (e: number) => actionType;
  actionTrigger$: Subject<any>;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    const optionCmps = a.props.suite.map(suiteToOptionCmp(a.props, h));
    return (
      <div>
        <div>{a.slots().default}</div>
        <select
          onChange={e =>
            a.props.actionTrigger$.next(a.props.actionFn(e.target.value))
          }
        >
          <option value="empty" />
          {optionCmps}
        </select>
      </div>
    );
  },
};

const suiteToOptionCmp = (data: ICmpProps, h: CreateElement) => (
  item: ReadonlyArray<any>,
  i: number
) => (
  <option value={i} {...getOptionSelected(data.state, i)}>
    SUITE LENGTH: {item.length}
  </option>
);

const getOptionSelected = (state: number, itemIndex: number) =>
  itemIndex === state ? { selected: true } : {};

export const stOnTestbench = { name: 'st-on-testbench', cmp };
