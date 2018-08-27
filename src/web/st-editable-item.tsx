import { IQuery } from '@autoschedule/queries-fn';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Morph, MorphParameters } from './react-morph/morph';
import { connect } from './util/connect';
import { mergeProps } from './util/hoc.util';

interface IEditableItemFromState {
  itemToEdit: IQuery;
  isNew: boolean;
}

interface IEditableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
  item?: any;
  action: any;
  ItemCardCmp: any;
  ItemEditCmp: any;
}

const hostStyles = {
  className: css`
    margin-top: 24px;
  `,
};

class StEditableItemImpl extends React.PureComponent<IEditableItemFromState & IEditableItemProps> {
  handleMorph = (data: MorphParameters) => {
    const {
      action,
      item,
      isNew,
      itemToEdit,
      ItemCardCmp,
      ItemEditCmp,
      theme,
      ...defaultHostProps
    } = this.props;
    const hostProps = mergeProps(defaultHostProps);
    if (itemToEdit === item || (!item && isNew)) {
      data.go(1);
    }
    return (
      <div {...hostProps}>
        <ItemCardCmp morph={data} {...item} action={action} />
        <ItemEditCmp morph={data} query={itemToEdit} isNew={isNew} />
      </div>
    );
  };

  render() {
    return <Morph>{this.handleMorph}</Morph>;
  }
}

const selector = ({ ui }: ICoreState): IEditableItemFromState => ({
  itemToEdit: ui.edit.query as IQuery,
  isNew: ui.edit.isNew,
});

export const StEditableItem = connect(selector, coreState$)<
  IEditableItemProps,
  IEditableItemFromState
>(withTheme(StEditableItemImpl));
