import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Morph, MorphParameters } from './react-morph/morph';
import { mergeProps } from './util/hoc.util';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { UpdateQueryAction } from '@scheduler-tester/core-state/global.ui.reducer';

interface IEditableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
  item: any;
  ItemCardCmp: any;
  ItemEditCmp: any;
  isNew: boolean;
}

class StEditableItemImpl extends React.PureComponent<IEditableItemProps> {
  state = {
    opened: false,
  };

  handleClick = () => this.setState({ opened: true });

  handleSave = query => {
    if (this.props.isNew) {
      return;
    }
    actionTrigger$.next(new UpdateQueryAction(this.props.item, query));
  };

  handleCancel = (data: MorphParameters) => () => {
    data.go(0);
    setTimeout(() => {
      this.setState({ opened: false });
      data.clean();
    }, 700);
  };

  handleMorph = (data: MorphParameters) => {
    const { item, isNew, ItemCardCmp, ItemEditCmp, theme, ...defaultHostProps } = this.props;
    console.log('render morph');
    const hostProps = mergeProps(defaultHostProps);
    if (this.state.opened && data.state === 'from') {
      setTimeout(() => {
        data.go(1);
      }, 0);
    }
    return (
      <div {...hostProps}>
        <ItemCardCmp morph={data} {...item} onClick={this.handleClick} />
        {this.state.opened && (
          <ItemEditCmp
            morph={data}
            query={item}
            isNew={isNew}
            handleCancel={this.handleCancel(data)}
          />
        )}
      </div>
    );
  };

  render() {
    console.log('render st-editable-item');
    return <Morph>{this.handleMorph}</Morph>;
  }
}

export const StEditableItem = withTheme(StEditableItemImpl);
