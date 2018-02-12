import { ITaskTransformInsert } from '@autoschedule/queries-fn';
import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

import { suiteActionType, SuitesQueryUpdateAction } from '../../core-state/suites.reducer';

import { displayFlex, flexGrow } from '../shared/style.css';

import { parseValue, updateTransform, wholeQuery } from './util';

interface ICmpProps {
  item: ITaskTransformInsert;
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
        <div>Insert: </div>
        <textarea
          class={flexGrow(1)}
          rows="1"
          value={JSON.stringify(a.props.item)}
          onBlur={e => triggerUpdateFn(parseValue(e.target.value))}
        />
        <button onClick={() => triggerUpdateFn(defaultInsert)}>default</button>
      </div>
    );
  },
};

const triggerUpdate = (query: wholeQuery, props: ICmpProps) => (insert: ITaskTransformInsert) => {
  props.actionTrigger$.next(
    new SuitesQueryUpdateAction(
      props.qSuite,
      query,
      updateTransform(query, 'inserts', props.item, insert)
    )
  );
};

export const defaultInsert: ITaskTransformInsert = {
  collectionName: 'col',
  doc: {},
  wait: false,
};

export const stTransformInsert = { name: 'st-transform-insert', cmp };
