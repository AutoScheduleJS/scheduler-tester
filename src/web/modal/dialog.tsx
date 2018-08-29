import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { ElevationProps } from '../elevation/elevation';
import { MorphParameters } from '../react-morph/morph';
import { merge, mergeProps } from '../util/hoc.util';
import { Modal } from './modal';

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

export interface DialogProps extends CustomableProps {
  dialogTitle: string;
  content?: React.ReactNode;
  actions: Array<React.ReactNode>;
  morph: MorphParameters;
}

interface DialogTheme {
  dialog: {
    elevation: number;
    width: number;
    shape: string;
    margin: number;
    titleBaseline: number;
    alertBaseline: number;
    backgroundColor: string;
  };
}

const defaultTheme = (theme: any = { palette: { surface: { main: '#FFF' } } }): DialogTheme =>
  merge(
    {
      dialog: {
        elevation: 24,
        width: 560,
        shape: css`
          border-radius: 8px;
        `,
        margin: 24,
        titleBaseline: 40,
        alertBaseline: 38,
        backgroundColor: theme.palette.surface.main,
      },
    } as DialogTheme,
    theme
  );

const ButtonRootClass = (theme: DialogTheme) => {
  const dialog = theme.dialog;
  return css`
    background-color: ${dialog.backgroundColor};
    width: ${dialog.width}px;
    ${dialog.shape};
  `;
};

class DialogImpl extends React.PureComponent<DialogProps> {
  render() {
    const { dialogTitle, content, actions, morph, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(
      ElevationProps(theme.dialog.elevation, theme),
      ButtonRootClass(theme),
      defaultHostProps
    );
    return (
      <Modal>
        <div {...hostProps} {...morph.to('container')}>
          {dialogTitle}
          {content}
        </div>
      </Modal>
    );
  }
}

export const Dialog = withTheme(DialogImpl);
