import { ITaskTransformNeed } from '@autoschedule/queries-fn';
import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

import { suiteActionType, SuitesQueryUpdateAction } from '../../../core-state/suites.reducer';

import { displayFlex, flexGrow } from '../shared/style.css';

import { parseValue, updateTransform, wholeQuery } from './util';

interface ICmpProps {
  item: ITaskTransformNeed;
  actionTrigger$: Subject<suiteActionType>;
  qSuite: ReadonlyArray<wholeQuery>;
  query: wholeQuery;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    const triggerUpdateFn = triggerUpdate(a.props.query, a.props);
    return (
      <div class={displayFlex}>
        <div>Need: </div>
        <textarea
          class={flexGrow(1)}
          rows="1"
          value={JSON.stringify(a.props.item)}
          onBlur={e => triggerUpdateFn(parseValue(e.target.value))}
        />
        <button onClick={() => triggerUpdateFn(defaultNeed)}>default</button>
      </div>
    );
  },
};

const triggerUpdate = (query: wholeQuery, props: ICmpProps) => (need: ITaskTransformNeed) => {
  props.actionTrigger$.next(
    new SuitesQueryUpdateAction(
      props.qSuite,
      query,
      updateTransform(query, 'needs', props.item, need)
    )
  );
};

export const defaultNeed: ITaskTransformNeed = {
  collectionName: 'col',
  find: {},
  quantity: 1,
  ref: '1',
  wait: false,
};

export const stTransformNeed = { name: 'st-transform-need', cmp };
