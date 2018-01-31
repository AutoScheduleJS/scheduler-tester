import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { actionType } from '../core-state/core.store';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      state: ReadonlyArray<any>;
      suite: ReadonlyArray<ReadonlyArray<any>>;
      actionFn: (e: ReadonlyArray<any>) => actionType;
      actionTrigger$: Subject<any>;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    const getOptionSelected = (item: ReadonlyArray<any>) =>
      item === data.state ? { selected: true } : {};
    const handleSelectChange = e => actionTrigger$.next(data.actionFn(e.target.value));
    const optionCmps = data.suite.map((item, i) => (
      <option value={i} onChange={handleSelectChange} {...getOptionSelected(item)}>
        SUITE LENGTH: {item.length}
      </option>
    ));
    return (
      <div>
        <div>On test bench: </div>
        <select>{optionCmps}</select>
      </div>
    );
  },
};

export const stOnTestbench = { name: 'st-on-testbench', cmp };
