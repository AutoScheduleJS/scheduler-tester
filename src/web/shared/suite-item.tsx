import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

interface ICmpProps {
  suite: ReadonlyArray<any>;
  actionTrigger$: Subject<any>;
  newItemFn: (a: any) => any;
  itemCmp: string;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    const actionTrigger$ = a.props.actionTrigger$;
    const ItemCmpName = a.props.itemCmp;
    const itemCmps = a.props.suite.map((item, _, suite) => (
      <div>
        <ItemCmpName {...{ props: { actionTrigger$, item, suite } }} />
      </div>
    ));
    return (
      <div>
        {itemCmps}
        <button onClick={() => actionTrigger$.next(a.props.newItemFn(a.props.suite))}>
          {a.slots().default}
        </button>
      </div>
    );
  },
};

export const stSuiteItem = { name: 'st-suite-item', cmp };
