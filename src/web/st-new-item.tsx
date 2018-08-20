import { Icon } from '@material-ui/core';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { AddItemAction } from '@scheduler-tester/core-state/global.ui.reducer';
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
 *
 * action should mutate AppBar content to reflect full-screen edit dialog
 */
class StNewQueryButtonImpl extends React.PureComponent<INewQueryButtonProps & { classes: any }> {
  private hostRef: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.hostRef = React.createRef();
  }
  handleNew = () => {
    const div = this.hostRef.current;
    const pos = div ? div.getBoundingClientRect() : null;
    actionTrigger$.next(
      new AddItemAction({
        shape: css`
          border-radius: 28px;
          height: 56px;
          width: 56px;
        `,
        position: {
          top: pos ? pos.top : null,
          left: pos ? pos.left : null,
        },
      })
    );
  };

  render() {
    const icon = <Icon>add</Icon>;
    return (
      <Fab
        ref={this.hostRef}
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

export const StNewQueryButton = StNewQueryButtonImpl;
