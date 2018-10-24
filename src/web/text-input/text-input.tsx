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

export enum LabelStatus {
  enabled,
  disabled,
  error,
}

export interface TextInputProps extends CustomableProps {
  label: string;
  value: string;
  labelType?: LabelType;
  status?: LabelStatus;
  assistiveMsg?: string;
  leadingIcon?: React.Component;
  trailingIcon?: React.Component;
  forwardedRef?: Ref<HTMLDivElement>;
}

interface TextInputTheme {
  textInput: {
    size: number;
    shape: string;
    label: string;
    input: string;
    errorColor: string;
    activeColor: string;
  };
}

const defaultTheme = (theme: any): TextInputTheme =>
  merge(
    {
      textInput: {
        shape: css`
          height: 56px;
          min-width: 280px;
          color: ${theme.palette.secondary.main};
        `,
      },
    },
    theme
  );

const TextInputRootClass = (theme: TextInputTheme) => {
  const base = css`
    position: relative;
    ${theme.textInput.shape};
  `;
  return { className: base };
};

const LabelClass = (
  theme: TextInputTheme,
  labelType: LabelType,
  value: string,
  isActive: boolean
) => {
  const base = css`
    padding-left: 12px;
    transition: font-size 0.25s, transform 0.25s;
  `;
  const placeHolder = css`
    padding-left: 12px;
    transition: font-size 0.25s, transform 0.25s;
    transform: translate(0, 17px);
    font-size: 16px;
  `;
  if (labelType === LabelType.fixed) {
    return { className: base };
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
    return { className: base };
  }
  return {
    className: placeHolder,
  };
};

const InputClass = (theme: TextInputTheme) => {
  const base = css`
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: 0;
    background: none;
    border: 0;
    outline: 0;
    padding: 0;
    position: absolute;
    bottom: 18px;
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
      labelType,
      status,
      assistiveMsg,
      leadingIcon,
      trailingIcon,
      forwardedRef,
      theme: incomingTheme,
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(
      TextInputRootClass(theme),
      TypographyProps({ scale: 'Caption' }),
      defaultHostProps
    );
    const labelProps = mergeProps(LabelClass(theme, labelType, value, this.state.isActive));
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
