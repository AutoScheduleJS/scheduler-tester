import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { UpdateQueryAction } from '@scheduler-tester/core-state/global.ui.reducer';
import * as React from 'react';
import { MorphWaa } from './util/morph-waa';

interface IEditableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
  item: any;
  ItemCardCmp: any;
  ItemEditCmp: any;
  isNew: boolean;
}

interface StEditableItemState {
  state: 'from' | 'to';
}

class StEditableItemImpl extends React.PureComponent<IEditableItemProps> {
  state: StEditableItemState = {
    state: 'from',
  };

  constructor(props) {
    super(props);
  }

  handleSave = query => {
    if (this.props.isNew) {
      return;
    }
    actionTrigger$.next(new UpdateQueryAction(this.props.item, query));
  };

  handleClick = () => {
    this.setState({ displayTo: this.state.state === 'from' ? 'to' : 'from' });
  };

  render() {
    const { item, isNew, ItemCardCmp, ItemEditCmp } = this.props;
    return (
      <MorphWaa
        fromNode={<ItemCardCmp {...item} onClick={() => this.handleClick()} />}
        toNode={<ItemEditCmp query={item} isNew={isNew} handleCancel={() => this.handleClick()} />}
        state={this.state.state}
      />
    );
  }
}

export const StEditableItem = StEditableItemImpl;
