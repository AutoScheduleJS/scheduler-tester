import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

interface ICmpProps {
  state: any;
  newSuiteFn: () => any;
  newItemFn: (a: any) => any;
  actionTrigger$: Subject<any>;
  itemCmp: string;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    const actionTrigger$ = a.props.actionTrigger$;
    const suites = a.props.state.map(suite => (
      <div>
        <st-suite-item
          {...{
            props: {
              actionTrigger$,
              itemCmp: a.props.itemCmp,
              newItemFn: a.props.newItemFn,
              suite,
            },
          }}
        />
      </div>
    ));
    return (
      <div>
        {suites}
        <button onClick={() => actionTrigger$.next(a.props.newSuiteFn())}>ADD SUITE</button>
      </div>
    );
  },
};

export const stSuiteList = { name: 'st-suite-list', cmp };
