import { ITimeBoundary, ITimeDuration } from '@autoschedule/queries-fn';
import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

import {
  suiteActionType,
  SuitesQueryDeleteAction,
  SuitesQueryUpdateAction,
} from '@scheduler-tester/core-state/suites.reducer';

import { defaultInsert } from './transform-insert';
import { defaultNeed } from './transform-need';
import { defaultUpdate } from './transform-update';
import { pushTransform, wholeQuery } from './util';

interface ICmpProps {
  suite: ReadonlyArray<wholeQuery>;
  item: wholeQuery;
  actionTrigger$: Subject<suiteActionType>;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    const q = a.props.item;
    const actionTrigger$ = a.props.actionTrigger$;
    const updateFn = updateAction(a.props);
    const transforms = q.transforms;
    return (
      <div>
        <textarea
          rows="5"
          value={JSON.stringify(q)}
          onBlur={e => updateFn(JSON.parse(e.target.value))}
        />
        <button onClick={() => actionTrigger$.next(new SuitesQueryDeleteAction(a.props.suite, q))}>
          DELETE
        </button>
        <st-time-boundary
          {...{
            props: {
              actionFn: (t: ITimeBoundary) => updateFn({ ...q, start: t }),
              timeBoundary: q.start,
            },
          }}
        >
          start
        </st-time-boundary>
        <st-time-boundary
          {...{
            props: {
              actionFn: (t: ITimeBoundary) => updateFn({ ...q, end: t }),
              timeBoundary: q.end,
            },
          }}
        >
          end
        </st-time-boundary>
        <st-time-duration
          {...{
            props: {
              actionFn: (t: ITimeDuration) => updateFn({ ...q, duration: t }),
              timeDuration: q.duration,
            },
          }}
        >
          duration
        </st-time-duration>
        <st-suite-item
          {...{
            props: {
              actionTrigger$,
              extraProps: { query: q, qSuite: a.props.suite },
              itemCmp: 'st-transform-need',
              newItemFn: _ => updateFn(pushTransform(q, 'needs', { ...defaultNeed })),
              suite: transforms ? transforms.needs : [],
            },
          }}
        >
          add need
        </st-suite-item>
        <st-suite-item
          {...{
            props: {
              actionTrigger$,
              extraProps: { query: q, qSuite: a.props.suite },
              itemCmp: 'st-transform-insert',
              newItemFn: _ => updateFn(pushTransform(q, 'inserts', { ...defaultInsert })),
              suite: transforms ? transforms.inserts : [],
            },
          }}
        >
          add insert
        </st-suite-item>
        <st-suite-item
          {...{
            props: {
              actionTrigger$,
              extraProps: { query: q, qSuite: a.props.suite },
              itemCmp: 'st-transform-update',
              newItemFn: _ => updateFn(pushTransform(q, 'updates', { ...defaultUpdate })),
              suite: transforms ? transforms.updates : [],
            },
          }}
        >
          add updates
        </st-suite-item>
      </div>
    );
  },
};

const updateAction = (setup: ICmpProps) => (newQuery: wholeQuery) =>
  setup.actionTrigger$.next(new SuitesQueryUpdateAction(setup.suite, setup.item, newQuery));

export const stQuery = { name: 'st-query', cmp };
