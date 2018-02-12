import { ITaskTransformUpdate } from '@autoschedule/queries-fn';
import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

import { suiteActionType, SuitesQueryUpdateAction } from '../../core-state/suites.reducer';

import { displayFlex, flexGrow } from '../shared/style.css';

import { parseValue, updateTransform, wholeQuery } from './util';

interface ICmpProps {
  item: ITaskTransformUpdate;
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
        <div>Update: </div>
        <textarea
          class={flexGrow(1)}
          rows="1"
          value={JSON.stringify(a.props.item)}
          onBlur={e => triggerUpdateFn(parseValue(e.target.value))}
        />
        <button onClick={() => triggerUpdateFn(defaultUpdate)}>default</button>
      </div>
    );
  },
};

const triggerUpdate = (query: wholeQuery, props: ICmpProps) => (need: ITaskTransformUpdate) => {
  props.actionTrigger$.next(
    new SuitesQueryUpdateAction(
      props.qSuite,
      query,
      updateTransform(query, 'updates', props.item, need)
    )
  );
};

export const defaultUpdate: ITaskTransformUpdate = {
  ref: '1',
  update: [{ property: '', value: '' }],
  wait: false,
};

export const stTransformUpdate = { name: 'st-transform-update', cmp };
