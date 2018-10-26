import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { UpdateScrim } from '@scheduler-tester/core-state/scrim.ui.reducer';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { ElevationProps } from '../elevation/elevation';
import { Typography } from '../typography/typography';
import { merge, mergeProps } from '../util/hoc.util';
import { Modal } from './modal';

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

export interface DialogProps extends CustomableProps {
  dialogTitle?: string;
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
}

const defaultTheme = (theme: any = { palette: { surface: { main: '#FFFFFF' } } }): DialogTheme =>
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

const actionClassname = css`
  display: flex;
  justify-content: flex-end;
`;

class DialogImpl extends React.PureComponent<DialogProps> {
  componentDidMount() {
    if (this.props.scrim) {
      actionTrigger$.next(
        new UpdateScrim({ displayScrim: true, handleClick: this.props.onCancel })
      );
    }
  }

  componentWillUnmount() {
    if (this.props.scrim) {
      actionTrigger$.next(new UpdateScrim({ displayScrim: false }));
    }
  }

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
    const titleElem = dialogTitle ? (
      <Typography scale={'H6'} baselineTop={theme.dialog.titleBaseline}>
        {dialogTitle}
      </Typography>
    ) : null;
    return (
      <Modal>
        <div ref={forwardedRef} {...hostProps}>
          {titleElem}
          <div>{content}</div>
          <div className={actionClassname}>{actions}</div>
        </div>
      </Modal>
    );
  }
}

const DialogWithTheme = withTheme(DialogImpl);

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props: any, ref) => (
  <DialogWithTheme {...props} forwardedRef={ref} />
));
