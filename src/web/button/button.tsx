import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Ref } from 'react';
import { EffectRippleProps } from '../effect-ripple/effect-ripple';
import { ElevationProps } from '../elevation/elevation';
import { TypographyProps } from '../typography/typography';
import { merge, mergeProps } from '../util/hoc.util';

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

export enum ButtonEmphaze {
  Low,
  Medium,
  High,
}

export interface ButtonProps extends CustomableProps {
  emphaze: ButtonEmphaze;
  forwardedRef?: Ref<HTMLDivElement>;
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

const defaultTheme = (theme: any): ButtonTheme =>
  merge(
    {
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
      },
    },
    theme
  );

/**
 * Caution: prettier will add an indesirable space between baselineColor & opacity
 */
const ButtonRootStyles = (theme: ButtonTheme, emphaze: number) => {
  const base = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    text-align: center;
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

class ButtonImpl extends React.PureComponent<ButtonProps> {
  render() {
    const { label, emphaze, forwardedRef, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const elevation = emphaze === ButtonEmphaze.High ? theme.button.elevation : 0;
    const hostProps = mergeProps(
      ElevationProps(elevation, theme),
      { className: ButtonRootStyles(theme, emphaze) },
      TypographyProps({ scale: 'Button' }),
      defaultHostProps
    );
    return (
      <div ref={forwardedRef} {...hostProps}>
        {label}
      </div>
    );
  }
}

/**
 * forwardRef must be the last to export.
 */
const ButtonImplWithTheme = withTheme(ButtonImpl);

export const Button = React.forwardRef<HTMLDivElement, ButtonProps>((props, ref) => (
  <ButtonImplWithTheme {...props} forwardedRef={ref} />
));

export const TappableProps = (theme?: any) => mergeProps(EffectRippleProps(theme));
