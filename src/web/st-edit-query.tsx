import { IQuery } from '@autoschedule/queries-fn';
import * as React from 'react';
import { ButtonEmphaze } from './button/button';
import { Dialog, DialogProps } from './modal/dialog';
import { MorphParameters } from './react-morph/morph';
import { StButton } from './st-button';

interface IqueryEditProps {
  query: IQuery;
  isNew: boolean;
  morph: MorphParameters;
  handleSave: (state: IQuery) => void;
  handleCancel: () => void;
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

  render() {
    const { morph, query, handleCancel, handleSave } = this.props;
    const saveLabel = this.props.isNew ? 'create' : 'update';
    const dialogProps: DialogProps = {
      morph,
      dialogTitle: `Edit ${query.name}#${query.id}`,
      actions: [
        <StButton label={'cancel'} emphaze={ButtonEmphaze.Medium} onClick={handleCancel} />,
        <StButton
          label={saveLabel}
          emphaze={ButtonEmphaze.High}
          onClick={() => handleSave(this.state)}
        />,
      ],
      content: (
        <input
          placeholder="name"
          value={this.state.name}
          onChange={e => this.handleChange('name')(e.target.value)}
        />
      ),
      onCancel: handleCancel,
    };
    return <Dialog {...dialogProps} scrim={true} />;
  }
}

export const StEditQuery = QueryEditCmp;
