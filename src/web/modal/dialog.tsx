import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { animated, Transition } from 'react-spring';
import { ElevationProps } from '../elevation/elevation';
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
  onCancel?: () => void;
  actions: Array<React.ReactNode>;
  forwardedRef?: React.Ref<HTMLDivElement>;
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
const DialogRootClass = (theme: DialogTheme) => {
  const dialog = theme.dialog;
  return {
    className: css`
      position: fixed;
      top: 45%;
      left: calc(50% - ${theme.dialog.width / 2}px);
      width: ${theme.dialog.width}px;
      padding-left: ${theme.dialog.margin}px;
      padding-right: 8px;
      padding-bottom: 8px;
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
      scrim,
      onCancel,
      theme: incomingTheme,
      forwardedRef,
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(
      ElevationProps(theme.dialog.elevation, theme),
      DialogRootClass(theme),
      defaultHostProps
    );
    console.log('defaultHostProps', defaultHostProps, hostProps);
    return (
      <Modal>
        {scrim && (
          <Transition
            native
            from={{ opacity: 'from' === 'from' ? 0 : 1 }}
            enter={{ opacity: 'from' === 'from' ? 1 : 0 }}
            leave={{ opacity: 'from' === 'from' ? 0 : 1 }}
          >
            {props => (
              <animated.div className={themeToScrimClass(theme)} onClick={onCancel} style={props} />
            )}
          </Transition>
        )}
        <div ref={forwardedRef} {...hostProps}>
          <Typography scale={'H6'} baselineTop={theme.dialog.titleBaseline}>
            {dialogTitle}
          </Typography>
          <div>{content}</div>
        </div>
      </Modal>
    );
  }
}

const DialogWithTheme = withTheme(DialogImpl);

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props: any, ref) => (
  <DialogWithTheme {...props} forwardedRef={ref} />
));
