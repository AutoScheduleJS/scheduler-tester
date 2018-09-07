import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { UpdateQueryAction } from '@scheduler-tester/core-state/global.ui.reducer';
import Flipping from 'flipping';
import * as React from 'react';

interface IEditableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
  item: any;
  ItemCardCmp: any;
  ItemEditCmp: any;
  isNew: boolean;
}

class StEditableItemImpl extends React.PureComponent<IEditableItemProps> {
  state = {
    displayTo: false,
  };

  private flipping;

  constructor(props) {
    super(props);
    this.flipping = new Flipping();
  }

  handleSave = query => {
    if (this.props.isNew) {
      return;
    }
    actionTrigger$.next(new UpdateQueryAction(this.props.item, query));
  };

  handleClick = () => {
    this.flipping.read();
  };

  render() {
    const { item, isNew, ItemCardCmp, ItemEditCmp } = this.props;
    return (
      <React.Fragment>
        {!this.state.displayTo && <ItemCardCmp {...item} onClick={() => this.handleClick()} />}
        {this.state.displayTo && (
          <ItemEditCmp query={item} isNew={isNew} handleCancel={() => this.handleClick()} />
        )}
      </React.Fragment>
    );
  }
}

export const StEditableItem = StEditableItemImpl;
