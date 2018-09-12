import { IQuery } from '@autoschedule/queries-fn';
import * as React from 'react';
import { ButtonEmphaze } from './button/button';
import { Dialog, DialogProps } from './modal/dialog';
import { StButton } from './st-button';

interface IqueryEditProps extends React.HTMLAttributes<HTMLDivElement> {
  forwardedRef?: React.Ref<HTMLDivElement>;
}

interface QueryEditState {
  query?: IQuery;
}

class QueryEditCmp extends React.PureComponent<IqueryEditProps> {
  state: QueryEditState;

  constructor(props: IqueryEditProps) {
    super(props);
    this.state = {};
  }

  handleChange = name => newVal => {
    this.setState({
      query: {
        [name]: newVal,
      },
    });
  };

  render() {
    const {
      style,
      forwardedRef,
      ...defaultHostProps
    } = this.props;
    const dialogProps: DialogProps = {
      dialogTitle: `New Query`,
      actions: [
        <StButton label={'cancel'} emphaze={ButtonEmphaze.Medium} onClick={handleCancel} />,
        <StButton
          label={'create'}
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
      ...defaultHostProps,
    };
    return <Dialog style={style} ref={forwardedRef} {...dialogProps} scrim={true} />;
  }
}

export const StEditQuery = React.forwardRef<HTMLDivElement, IqueryEditProps>((props: any, ref) => (
  <QueryEditCmp {...props} forwardedRef={ref} />
));
