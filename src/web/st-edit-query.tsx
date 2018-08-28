import { IQuery } from '@autoschedule/queries-fn';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { CloseEditAction } from '@scheduler-tester/core-state/edit.ui.reducer';
import {
  DeleteQueryAction,
  UpdateQueryAction,
} from '@scheduler-tester/core-state/global.ui.reducer';
import { css } from 'emotion';
import * as React from 'react';
import { ButtonEmphaze } from './button/button';
import { MorphParameters } from './react-morph/morph';
import { StButton } from './st-button';

interface IqueryEditProps {
  query: IQuery;
  isNew: boolean;
  morph: MorphParameters;
}

const hostClass = {
  className: css`
    position: absolute;
    top: 45%;
    left: 40%;
  `,
};

/**
 * When done, should morph into the card.
 * How to do that? Elements only morph when mounting, getting position info from unmounting element
 * -> content is discarded immediately, how to position element absolutely? impossible.
 */
class QueryEditCmp extends React.PureComponent<
  IqueryEditProps & { classes: any; fullScreen: boolean }
> {
  state = {
    ...this.props.query,
    position: {
      ...this.props.query.position,
      uiId: Date.now(),
    },
  };

  static getDerivedStateFromProps(props, state) {
    if (state.id === props.query.id || !props.query) {
      return null;
    }
    return {
      ...props.query,
      position: {
        ...props.query.position,
        uiId: Date.now(),
      },
    };
  }

  handleChange = name => newVal => {
    this.setState({
      [name]: newVal,
    });
  };

  handleChangeId = name => newVal => {
    this.setState({
      [name]: {
        ...newVal,
        uiId: Date.now(),
      },
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
    return (
      <div {...hostClass} {...morph.to('card')}>
        <div id="query-edit-dialog-title">
          Edit {query.name}#{query.id}
        </div>
        <div>
          <input
            placeholder="name"
            value={this.state.name}
            onChange={e => this.handleChange('name')(e.target.value)}
          />
          {/* <StEditPosition
            position={this.state.position}
            onChanged={this.handleChangeId('position')}
          /> */}
        </div>
        <div>
          <StButton emphaze={ButtonEmphaze.Medium} onClick={() => this.handleClose(false)}>
            cancel
          </StButton>
          <StButton emphaze={ButtonEmphaze.High} onClick={() => this.handleClose(true)}>
            {saveLabel}
          </StButton>
        </div>
      </div>
    );
  }
}

export const StEditQuery = QueryEditCmp;
