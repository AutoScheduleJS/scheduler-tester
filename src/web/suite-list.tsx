import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      state: any;
      newSuiteFn: () => any;
      newItemFn: (a: any) => any;
      actionTrigger$: Subject<any>;
      itemCmp: string;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    const suites = data.state.map(suite => (
      <div>
        <st-suite-item
          {...{ actionTrigger$, suite, newItemFn: data.newItemFn, itemCmp: data.itemCmp }}
        />
      </div>
    ));
    return (
      <div>
        {suites}
        <button onClick={() => actionTrigger$.next(data.newSuiteFn())}>ADD SUITE</button>
      </div>
    );
  },
};

export const stSuiteList = { name: 'st-suite-list', cmp };
