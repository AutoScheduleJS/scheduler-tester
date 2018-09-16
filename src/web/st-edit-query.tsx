import { IQuery } from '@autoschedule/queries-fn';
import * as React from 'react';
import { ButtonEmphaze } from './button/button';
import { Dialog, DialogProps } from './modal/dialog';
import { StButton } from './st-button';

interface IqueryEditProps extends React.HTMLAttributes<HTMLDivElement> {
  query: IQuery;
  handleSave: (state: IQuery) => void;
  handleCancel: () => void;
  forwardedRef?: React.Ref<HTMLDivElement>;
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
    const { query, handleCancel, handleSave, forwardedRef, ...defaultHostProps } = this.props;
    const dialogProps: DialogProps = {
      dialogTitle: `Edit ${query.name}#${query.id}`,
      actions: [
        <StButton label={'cancel'} emphaze={ButtonEmphaze.Medium} onClick={handleCancel} />,
        <StButton
          label='update'
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
      ...defaultHostProps
    };
    return <Dialog ref={forwardedRef} {...dialogProps} scrim={true} />;
  }
}

export const StEditQuery = React.forwardRef<HTMLDivElement, IqueryEditProps>((props: any, ref) => (
  <QueryEditCmp {...props} forwardedRef={ref} />
));
