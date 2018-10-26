import { IQuery } from '@autoschedule/queries-fn';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { CancelQueryCreationAction } from '@scheduler-tester/core-state/global.ui.reducer';
import { css } from 'emotion';
import * as React from 'react';
import { ButtonEmphaze } from './button/button';
import { Dialog, DialogProps } from './modal/dialog';
import { StButton } from './st-button';
import { TextInput } from './text-input/text-input';

interface INewQueryProps extends React.HTMLAttributes<HTMLDivElement> {
  forwardedRef?: React.Ref<HTMLDivElement>;
}

interface NewQueryState {
  query?: IQuery;
}

const cancelClassname = css`
  margin-right: 8px;
`;

class NewQueryCmp extends React.PureComponent<INewQueryProps> {
  state: NewQueryState;

  constructor(props: INewQueryProps) {
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

  handleSave = () => {
    console.log('saved');
  };

  handleCancel = () => {
    actionTrigger$.next(new CancelQueryCreationAction());
  };

  render() {
    const { style, forwardedRef, ...defaultHostProps } = this.props;
    const dialogProps: DialogProps = {
      actions: [
        <StButton
          label={'cancel'}
          emphaze={ButtonEmphaze.Medium}
          onClick={this.handleCancel}
          className={cancelClassname}
        />,
        <StButton label={'create'} emphaze={ButtonEmphaze.High} onClick={this.handleSave} />,
      ],
      content: (
        <TextInput
          label={'Name'}
          value={this.state.query ? this.state.query.name : ''}
          onNewVal={val => this.handleChange('name')(val)} />
      ),
      onCancel: this.handleCancel,
      ...defaultHostProps,
    };
    return <Dialog style={style} ref={forwardedRef} {...dialogProps} scrim={true} />;
  }
}

export const StNewQuery = React.forwardRef<HTMLDivElement, INewQueryProps>((props: any, ref) => (
  <NewQueryCmp {...props} forwardedRef={ref} />
));
