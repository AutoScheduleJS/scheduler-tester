import { Icon } from '@material-ui/core';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { AddQueryAction } from '@scheduler-tester/core-state/global.ui.reducer';
import { css } from 'emotion';
import * as React from 'react';
import { Fab } from './fab/fab';

interface INewQueryButtonProps {}

/**
 * morph when changing tab
 * morph when click to create
 * 3 size category : extended, normal, tiny
 * one composant handling the 3 categories -> prop to determine category and morph is internal, or let a parent component handle morph logic ?
 * morph can't handle prop interpolation, only style, but morph has to influence internal styling.
 *
 * morph occuring when tab change/click to create can be handled in parent composent
 */
class NewQueryButtonImpl extends React.PureComponent<INewQueryButtonProps & { classes: any }> {
  handleNew = () => {
    actionTrigger$.next(new AddQueryAction());
  };

  render() {
    const icon = <Icon>add</Icon>;
    return (
      <Fab
        icon={icon}
        classes={{
          root: css`
            position: fixed;
            bottom: 16px;
            right: 16px;
          `,
        }}
        onClick={() => this.handleNew()}
      />
    );
  }
}

export const NewQueryButton = NewQueryButtonImpl;
