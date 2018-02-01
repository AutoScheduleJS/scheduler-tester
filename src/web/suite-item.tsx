import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      suite: ReadonlyArray<any>;
      actionTrigger$: Subject<any>;
      newItemFn: (a: any) => any;
      itemCmp: string;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    const ItemCmpName = data.itemCmp;
    const itemCmps = data.suite.map((item, _, suite) => (
      <div>
        <ItemCmpName {...{ actionTrigger$, item, suite }} />
      </div>
    ));
    return (
      <div>
        {itemCmps}
        <button onClick={() => actionTrigger$.next(data.newItemFn(data.suite))}>ADD ITEM</button>
      </div>
    );
  },
};

export const stSuiteItem = { name: 'st-suite-item', cmp };
