import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { EffectRippleProps } from '../effect-ripple/effect-ripple';
import { ElevationPropsPress } from '../elevation/elevation';
import { Typography } from '../typography/typography';
import { merge, mergeProps, stateHandler } from '../util/hoc.util';

export interface FabClasses {
  root?: string;
  label?: string;
}

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
  classes?: FabClasses;
  theme?: any;
  forwardRef?: any;
}

export enum FabSize {
  Default,
  Mini,
  Extended,
}

export interface FabProps extends CustomableProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  size?: FabSize;
  label?: string;
  icon?: React.ReactElement<{}>;
}

interface FabTheme {
  fab: {
    shape: {
      defaultShape: string;
      miniShape: string;
      extendedShape: string;
    };
    elevation: {
      resting: number;
      pressed: number;
    };
  };
  [key: string]: any;
}

const defaultTheme = (theme: any): FabTheme =>
  merge(
    {
      fab: {
        elevation: {
          resting: 6,
          pressed: 12,
        },
        shape: {
          extendedShape: css`
            border-radius: 24px;
            height: 48px;
            background-color: ${theme.palette.primary.main};
            color: ${theme.palette.primary.on};
          `,
          defaultShape: css`
            border-radius: 28px;
            height: 56px;
            padding: 0 16px;
            background-color: ${theme.palette.primary.main};
            color: ${theme.palette.primary.on};
          `,
          miniShape: css`
            padding: 0 8px;
            border-radius: 20px;
            height: 40px;
            background-color: ${theme.palette.primary.main};
            color: ${theme.palette.primary.on};
          `,
        },
      },
    },
    theme
  );

const defaultClasses: FabClasses = {
  root: '',
  label: '',
};

const FabRootStyles = (theme: FabTheme, size: number, icon: boolean) => {
  const base = css`
    user-select: none;
    display: flex;
    align-items: center;
  `;
  switch (size) {
    case FabSize.Mini:
      return css`
        ${base} ${theme.fab.shape.miniShape};
      `;
    case FabSize.Default:
      return css`
        ${base} ${theme.fab.shape.defaultShape};
      `;
    case FabSize.Extended:
      return css`
        ${base} ${theme.fab.shape.extendedShape};
        padding: 0 20px 0 ${icon ? 12 : 20}px;
      `;
    default:
      return base;
  }
};

const buttonTabCss = css`
  text-align: center;
`;

export class FabImpl extends React.PureComponent<FabProps> {
  state = {
    elevationState: {
      elevation: 6,
    },
  };
  render() {
    const {
      label,
      size = FabSize.Default,
      icon,
      onClick = () => {},
      forwardRef,
      theme: incomingTheme,
      classes = defaultClasses,
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const { resting, pressed } = theme.fab.elevation;
    const props = mergeProps(
      ElevationPropsPress(stateHandler(this, 'elevationState'), resting, pressed, theme),
      EffectRippleProps(theme),
      {
        className: css`
          ${FabRootStyles(theme, size, !!icon)} ${classes.root};
        `,
        onClick: onClick,
      },
      defaultHostProps
    );
    return (
      <div {...props} ref={forwardRef}>
        {icon}
        {label && (
          <Typography
            scale="Button"
            className={css`
              ${buttonTabCss} ${classes.label};
            `}
          >
            {label}
          </Typography>
        )}
      </div>
    );
  }
}

const FabWithTheme = withTheme(FabImpl);

export const Fab = React.forwardRef((props: FabProps, ref) => (
  <FabWithTheme {...props} forwardRef={ref} />
));
