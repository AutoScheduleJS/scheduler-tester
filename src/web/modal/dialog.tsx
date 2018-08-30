import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { animated, Transition } from 'react-spring';
import { ElevationProps } from '../elevation/elevation';
import { MorphParameters } from '../react-morph/morph';
import { Typography } from '../typography/typography';
import { merge, mergeProps } from '../util/hoc.util';
import { Modal } from './modal';

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

export interface DialogProps extends CustomableProps {
  dialogTitle: string;
  content?: React.ReactNode;
  scrim?: boolean;
  actions: Array<React.ReactNode>;
  morph: MorphParameters;
}

interface DialogTheme {
  dialog: {
    elevation: number;
    contentMarginTop: number;
    width: number;
    shape: string;
    margin: number;
    titleBaseline: number;
    alertBaseline: number;
    backgroundColor: string;
  };
  scrim: {
    color: string;
  };
}

const defaultTheme = (
  theme: any = { palette: { surface: { main: '#FFFFFF', on: '#000000' } } }
): DialogTheme =>
  merge(
    {
      dialog: {
        elevation: 24,
        contentMarginTop: 64,
        width: 560,
        shape: css`
          border-radius: 8px;
        `,
        margin: 24,
        titleBaseline: 40,
        alertBaseline: 38,
        backgroundColor: theme.palette.surface.main,
      },
      scrim: {
        color: theme.palette.surface.on + '51',
      },
    } as DialogTheme,
    theme
  );

const themeToPosition = (theme: DialogTheme) => css`
  position: fixed;
  top: 45%;
  left: calc(50% - ${theme.dialog.width / 2}px);
  width: ${theme.dialog.width}px;
  padding-left: ${theme.dialog.margin}px;
  padding-right: 8px;
  padding-bottom: 8px;
`;

const DialogRootClass = (theme: DialogTheme) => {
  const dialog = theme.dialog;
  return {
    className: css`
      ${themeToPosition(theme)}
      padding-top: ${theme.dialog.contentMarginTop}px;
      background-color: ${dialog.backgroundColor};
      ${dialog.shape};
    `,
  };
};

const themeToScrimClass = (theme: DialogTheme) => css`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: ${theme.scrim.color};
`;

class DialogImpl extends React.PureComponent<DialogProps> {
  render() {
    const {
      dialogTitle,
      content,
      actions,
      morph,
      scrim,
      theme: incomingTheme,
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(
      ElevationProps(theme.dialog.elevation, theme),
      DialogRootClass(theme),
      defaultHostProps
    );
    return (
      <Modal>
        {scrim && (
          <Transition
            native
            from={{ opacity: morph.state === 'from' ? 0 : 1 }}
            enter={{ opacity: morph.state === 'from' ? 1 : 0 }}
            leave={{ opacity: morph.state === 'from' ? 0 : 1 }}
          >
            {props => <animated.div className={themeToScrimClass(theme)} style={props} />}
          </Transition>
        )}
        <div {...hostProps} {...morph.to('container')}>
          {content}
        </div>
        <div className={themeToPosition(theme)} {...morph.to('title')}>
          <Typography scale={'H6'} baselineTop={theme.dialog.titleBaseline}>
            {dialogTitle}
          </Typography>
        </div>
      </Modal>
    );
  }
}

export const Dialog = withTheme(DialogImpl);
