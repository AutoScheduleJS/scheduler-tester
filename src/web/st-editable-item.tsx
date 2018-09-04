import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { UpdateQueryAction } from '@scheduler-tester/core-state/global.ui.reducer';
import * as React from 'react';
import { SpringMorph, SpringMorphParameters } from './util/morph';

interface IEditableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
  item: any;
  ItemCardCmp: any;
  ItemEditCmp: any;
  isNew: boolean;
}

class StEditableItemImpl extends React.PureComponent<IEditableItemProps> {
  handleSave = query => {
    if (this.props.isNew) {
      return;
    }
    actionTrigger$.next(new UpdateQueryAction(this.props.item, query));
  };
  handleMorph = (data: SpringMorphParameters) => {
    const { item, isNew, ItemCardCmp, ItemEditCmp } = this.props;
    console.log('render morph');
    return (
      <React.Fragment>
        <ItemCardCmp {...data.from()} {...item} onClick={() => data.toggle()} />
        <ItemEditCmp {...data.to()} query={item} isNew={isNew} handleCancel={() => data.toggle()} />
      </React.Fragment>
    );
  };

  render() {
    return <SpringMorph>{this.handleMorph}</SpringMorph>;
  }
}

export const StEditableItem = StEditableItemImpl;
