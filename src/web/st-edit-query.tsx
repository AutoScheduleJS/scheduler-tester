import { IQuery } from '@autoschedule/queries-fn';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { CloseEditAction } from '@scheduler-tester/core-state/edit.ui.reducer';
import {
  DeleteQueryAction,
  UpdateQueryAction,
} from '@scheduler-tester/core-state/global.ui.reducer';
import * as React from 'react';
import { ButtonEmphaze } from './button/button';
import { Dialog } from './modal/dialog';
import { MorphParameters } from './react-morph/morph';
import { StButton } from './st-button';

interface IqueryEditProps {
  query: IQuery;
  isNew: boolean;
  morph: MorphParameters;
}

interface QueryEditState extends IQuery {}

/**
 * When done, should morph into the card.
 * How to do that? Elements only morph when mounting, getting position info from unmounting element
 * -> content is discarded immediately, how to position element absolutely? impossible.
 */
class QueryEditCmp extends React.PureComponent<IqueryEditProps> {
  state: QueryEditState;

  constructor(props: IqueryEditProps) {
    super(props);
    this.state = {
      ...props.query,
    };
  }

  handleChange = name => newVal => {
    this.setState({
      [name]: newVal,
    });
  };

  handleClose = (save: boolean) => {
    if (!save) {
      if (this.props.isNew) {
        return actionTrigger$.next(new DeleteQueryAction(this.props.query));
      }
      return actionTrigger$.next(new CloseEditAction());
    }
    actionTrigger$.next(new UpdateQueryAction(this.props.query, this.state));
  };

  render() {
    const { morph, query } = this.props;
    const saveLabel = this.props.isNew ? 'create' : 'update';
    const dialogProps = {
      morph,
      dialogTitle: `Edit ${query.name}#${query.id}`,
      actions: [
        <StButton
          label={'cancel'}
          emphaze={ButtonEmphaze.Medium}
          onClick={() => this.handleClose(false)}
        />,
        <StButton
          label={saveLabel}
          emphaze={ButtonEmphaze.High}
          onClick={() => this.handleClose(true)}
        />,
      ],
      content: (
        <input
          placeholder="name"
          value={this.state.name}
          onChange={e => this.handleChange('name')(e.target.value)}
        />
      ),
    };
    return <Dialog {...dialogProps} />;
  }
}

export const StEditQuery = QueryEditCmp;
