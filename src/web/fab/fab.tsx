import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Elevation } from '../elevation/elevation';
import { Typography } from '../typography/typography';
import { EffectRipple } from '../effect-ripple/effect-ripple';

export interface FabClasses {
  root?: string;
  button?: string;
  label?: string;
}

interface CustomableProps {
  classes?: FabClasses;
  theme?: any;
}

export enum FabSize {
  Default,
  Mini,
  Extended,
}

export interface FabProps extends CustomableProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  size?: FabSize;
  color?: string;
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
}

const defaultTheme = (theme: any): FabTheme => ({
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
    ...theme.fab,
  },
});

const defaultClasses: FabClasses = {
  root: '',
  label: '',
  button: '',
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

class FabImpl extends React.PureComponent<FabProps> {
  render() {
    const {
      label,
      size = FabSize.Default,
      icon,
      onClick = () => {},
      theme: incomingTheme,
      classes = defaultClasses,
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <div onClick={onClick} className={classes.root}>
        <Elevation elevation={6}>
          <EffectRipple
            classes={{
              root: css`
                ${FabRootStyles(theme, size, !!icon)} ${classes.button};
              `,
            }}
          >
            {icon}
            {label && (
              <Typography
                scale="Button"
                classes={{
                  root: css`
                    ${buttonTabCss} ${classes.label};
                  `,
                }}
              >
                {label}
              </Typography>
            )}
          </EffectRipple>
        </Elevation>
      </div>
    );
  }
}

export const Fab = withTheme(FabImpl);
