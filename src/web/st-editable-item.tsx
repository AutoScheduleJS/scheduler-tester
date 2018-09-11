import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { UpdateQueryAction } from '@scheduler-tester/core-state/global.ui.reducer';
import { css } from 'emotion';
import * as React from 'react';
import { MorphWaa, MorphWaaChildrenParams } from './util/morph-waa';

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
    this.setState({ state: this.state.state === 'from' ? 'to' : 'from' });
  };

  morphRender = (params: MorphWaaChildrenParams) => {
    const { item, isNew, ItemCardCmp, ItemEditCmp } = this.props;
    return (
      <React.Fragment>
        <ItemCardCmp {...params.from()} {...item} onClick={() => this.handleClick()} />
        <ItemEditCmp
          {...params.to()}
          query={item}
          isNew={isNew}
          handleCancel={() => this.handleClick()}
          className={css`
            opacity: ${params.toOpacity};
          `}
        />
      </React.Fragment>
    );
  };

  render() {
    return <MorphWaa state={this.state.state}>{this.morphRender}</MorphWaa>;
  }
}

export const StEditableItem = StEditableItemImpl;
