import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Ref } from 'react';
import { TypographyProps } from '../typography/typography';
import { merge, mergeProps } from '../util/hoc.util';

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

export enum LabelType {
  float,
  fixed,
  hidden,
}

export enum TextInputStatus {
  enabled,
  disabled,
  error,
}

export interface TextInputProps extends CustomableProps {
  label: string;
  value: string;
  labelType?: LabelType;
  status?: TextInputStatus;
  assistiveMsg?: string;
  leadingIcon?: React.Component;
  trailingIcon?: React.Component;
  forwardedRef?: Ref<HTMLDivElement>;
}

interface TextInputStateTheme {
  base: string;
  inactive: string;
  activated: string;
  hover: string;
  disabled: string;
  error: string;
}

interface TextInputTheme {
  textInput: {
    size: number;
    container: TextInputStateTheme;
    label: TextInputStateTheme;
    input: string;
  };
}

const defaultTheme = (theme: any): TextInputTheme => {
  const baseContainerShape = css`
    height: 56px;
    min-width: 280px;
    border-radius: 4px 4px 0 0;
    background-color: ${theme.palette.surface.baseEmphase + '0b'};
  `;
  const baseLabelShape = css`
    color: ${theme.palette.surface.baseEmphase + theme.palette.surface.mediumEmphase};
  `;
  return merge(
    {
      textInput: {
        container: {
          base: baseContainerShape,
          inactive: baseContainerShape,
          activated: baseContainerShape,
          hover: css`
            ${baseContainerShape};
            background-color: ${theme.palette.surface.baseEmphase + '14'};
            border-bottom: 1px solid ${theme.palette.surface.baseEmphase + '32'};
          `,
          disabled: baseContainerShape,
          error: baseContainerShape,
        },
        label: {
          base: baseLabelShape,
          inactive: baseLabelShape,
          activated: css`
            ${baseLabelShape};
            color: ${theme.palette.secondary.main};
          `,
          hover: baseLabelShape,
          disabled: css`
            ${baseLabelShape};
            color: ${theme.palette.surface.baseEmphase + theme.palette.surface.disabled};
          `,
        },
      },
    },
    theme
  );
};

const TextInputRootClass = (theme: TextInputTheme) => {
  const base = css`
    position: relative;
    ${theme.textInput.container.inactive};
    &:hover {
      ${theme.textInput.container.hover};
    }
  `;
  return { className: base };
};

const LabelClass = (
  theme: TextInputTheme,
  labelType: LabelType,
  value: string,
  status: TextInputStatus,
  isActive: boolean
) => {
  const label = theme.textInput.label;
  const color = isActive
    ? label.activated
    : status === TextInputStatus.disabled
      ? label.disabled
      : status === TextInputStatus.enabled ? label.inactive : label.error;
  const floating = css`
    padding-left: 12px;
    transition: font-size 0.25s, transform 0.25s, color 0.25s;
    color: ${color};
  `;
  const placeHolder = css`
    padding-left: 12px;
    transition: font-size 0.25s, transform 0.25s, color 0.25s;
    transform: translate(0, 14px);
    font-size: 16px;
    color: ${color};
  `;
  if (labelType === LabelType.fixed) {
    return { className: floating };
  }
  if (labelType === LabelType.hidden) {
    if (value || isActive) {
      return {
        className: css`
          display: none;
        `,
      };
    }
    return { className: placeHolder };
  }
  if (value || isActive) {
    return { className: floating };
  }
  return {
    className: placeHolder,
  };
};

const InputClass = (theme: TextInputTheme) => {
  const base = css`
    box-sizing: border-box;
    background-clip: padding-box;
    background: none;
    border: 0;
    outline: 0;
    padding: 0;
    position: absolute;
    bottom: 12px;
    right: 12px;
    left: 12px;
  `;
  return { className: base };
};

interface TextInputState {
  isActive: boolean;
}

/**
 * Label
 * Container with activator
 * text input
 * helper text
 * error message
 * icons (leading & trailing)
 */
class TextInputImpl extends React.PureComponent<TextInputProps> {
  state: TextInputState = {
    isActive: false,
  };
  handleFocus = isFocused => () => {
    this.setState({ isActive: isFocused });
  };

  render() {
    const {
      label,
      value,
      labelType = LabelType.float,
      status = TextInputStatus.enabled,
      assistiveMsg,
      leadingIcon,
      trailingIcon,
      forwardedRef,
      theme: incomingTheme,
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(TextInputRootClass(theme), defaultHostProps);
    const labelProps = mergeProps(
      TypographyProps({ scale: 'Caption', baselineTop: 20 }),
      LabelClass(theme, labelType, value, status, this.state.isActive)
    );
    const inputProps = mergeProps(TypographyProps({ scale: 'Subtitle1' }), InputClass(theme));
    return (
      <div
        ref={forwardedRef}
        {...hostProps}
        onFocus={this.handleFocus(true)}
        onBlur={this.handleFocus(false)}
      >
        <div {...labelProps}>{label}</div>
        <input {...inputProps} />
      </div>
    );
  }
}

/**
 * forwardRef must be the last to export.
 */
const TextInputImplWithTheme = withTheme(TextInputImpl);

export const TextInput = React.forwardRef<HTMLDivElement, TextInputProps>((props, ref) => (
  <TextInputImplWithTheme {...props} forwardedRef={ref} />
));
