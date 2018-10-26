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
  onNewVal: (val: string) => void;
  labelType?: LabelType;
  status?: TextInputStatus;
  assistiveMsg?: string;
  leadingIcon?: React.Component;
  trailingIcon?: React.Component;
  forwardedRef?: Ref<HTMLDivElement>;
}

interface TextInputStateTheme {
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
    indicator: TextInputStateTheme;
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
  const baseIndicatorShape = css`
    position: absolute;
    bottom: -2px;
    height: 2px;
    left: 0;
    right: 0;
    transform-origin: center;
    transition: transform 0.25s, color 0.25s, height 0.25s;
    background-color: ${theme.palette.secondary.main};
    transform: scale(0, 0);
  `;
  return merge(
    {
      textInput: {
        container: {
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
        indicator: {
          inactive: baseIndicatorShape,
          activated: css`
            ${baseIndicatorShape};
            transform: scale(1, 1);
          `,
          hover: baseIndicatorShape,
          disabled: baseIndicatorShape,
          error: css`
            ${baseIndicatorShape};
            transform: scale(1, 1);
            color: 'red';
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
  const base = isActive
    ? label.activated
    : status === TextInputStatus.disabled
      ? label.disabled
      : status === TextInputStatus.enabled ? label.inactive : label.error;
  const floating = css`
    padding-left: 12px;
    transition: font-size 0.25s, transform 0.25s, color 0.25s;
    ${base};
  `;
  const placeHolder = css`
    padding-left: 12px;
    transition: font-size 0.25s, transform 0.25s, color 0.25s;
    transform: translate(0, 14px);
    font-size: 16px;
    ${base};
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

const ActiveIndicatorClass = (
  theme: TextInputTheme,
  status: TextInputStatus,
  isActive: boolean
) => {
  const indic = theme.textInput.indicator;
  const indicClass =
    status === TextInputStatus.error ? indic.error : isActive ? indic.activated : indic.inactive;
  return { className: indicClass };
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
  inputRef: React.RefObject<any>;
  state: TextInputState = {
    isActive: false,
  };
  handleFocus = isFocused => () => {
    this.setState({ isActive: isFocused }, () => {
      if (!isFocused) {
        return;
      }
      this.inputRef.current.focus();
    });
  };
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    const {
      label,
      value,
      onNewVal,
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
    const inputProps = mergeProps(TypographyProps({ scale: 'Subtitle1' }), InputClass(theme), {
      value,
      onChange: e => onNewVal(e.target.value),
    });
    const activIndicatorProps = ActiveIndicatorClass(theme, status, this.state.isActive);
    return (
      <div
        ref={forwardedRef}
        {...hostProps}
        onClick={this.handleFocus(true)}
        onFocus={this.handleFocus(true)}
        onBlur={this.handleFocus(false)}
      >
        <div {...labelProps}>{label}</div>
        <input {...inputProps} ref={this.inputRef} />
        <div {...activIndicatorProps} />
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
