import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Elevation } from '../elevation/elevation';
import { Typography } from '../typography/typography';

export interface ButtonClasses {
  root?: string;
  button?: string;
  label?: string;
}

interface CustomableProps {
  classes?: ButtonClasses;
  theme?: any;
}

export enum ButtonEmphaze {
  Low,
  Medium,
  High,
}

export interface ButtonProps extends CustomableProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  emphaze: ButtonEmphaze;
  label?: string;
  icon?: React.Component;
}

interface ButtonTheme {
  button: {
    shape: string;
    mediumShape: string;
    lowShape: string;
    highShape: string;
    elevation: number;
  };
}

const defaultTheme = (theme: any): ButtonTheme => ({
  button: {
    elevation: 2,
    shape: css`
      border-radius: 4px;
      padding: 0 16px;
      height: 36px;
      min-width: 64px;
      color: ${theme.palette.secondary.main};
    `,
    highShape: css`
      color: ${theme.palette.secondary.on};
      background-color: ${theme.palette.secondary.main};
    `,
    mediumShape: css`
      border: 1px solid ${theme.palette.surface.on};
    `,
    lowShape: css`
      padding: 0 8px;
    `,
    ...theme.button,
  },
});

const defaultClasses: ButtonClasses = {
  root: '',
  label: '',
  button: '',
};

/**
 * Caution: prettier will add an indesirable space between baselineColor & opacity
 */
const ButtonRootStyles = (theme: ButtonTheme, emphaze: number) => {
  const base = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    ${theme.button.shape};
  `;
  switch (emphaze) {
    case ButtonEmphaze.Low:
      return css`
        ${base} ${theme.button.lowShape};
      `;
    case ButtonEmphaze.Medium:
      return css`
        ${base} ${theme.button.mediumShape};
      `;
    case ButtonEmphaze.High:
      return css`
        ${base} ${theme.button.highShape};
      `;
    default:
      return base;
  }
};

const buttonTabCss = css`
  text-align: center;
`;

class ButtonImpl extends React.PureComponent<ButtonProps> {
  render() {
    const {
      label,
      emphaze,
      onClick = () => {},
      theme: incomingTheme,
      classes = defaultClasses,
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const elevation = emphaze === ButtonEmphaze.High ? theme.button.elevation : 0;
    return (
      <div onClick={onClick} className={classes.root}>
        <Elevation
          elevation={elevation}
          classes={{
            root: css`
              ${ButtonRootStyles(theme, emphaze)} ${classes.button};
            `,
          }}
        >
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
        </Elevation>
      </div>
    );
  }
}

export const Button = withTheme(ButtonImpl);
