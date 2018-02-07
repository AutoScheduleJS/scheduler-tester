import { IAtomicQuery, IGoalQuery, ITimeBoundary, ITimeDuration } from '@autoschedule/queries-fn';
import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

import { suiteActionType, SuitesQueryUpdateAction } from '../../core-state/suites.reducer';

type wholeQuery = IAtomicQuery & IGoalQuery;

interface ICmpProps {
  suite: ReadonlyArray<wholeQuery>;
  item: wholeQuery;
  actionTrigger$: Subject<suiteActionType>;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    const q = a.props.item;
    const updateFn = updateAction(a.props);
    return (
      <div>
        <textarea
          rows="5"
          value={JSON.stringify(q)}
          onBlur={e => updateFn(JSON.parse(e.target.value))}
        />
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
      </div>
    );
  },
};

const updateAction = (setup: ICmpProps) => (newQuery: wholeQuery) =>
  setup.actionTrigger$.next(new SuitesQueryUpdateAction(setup.suite, setup.item, newQuery));

export const stQuery = { name: 'st-query', cmp };
