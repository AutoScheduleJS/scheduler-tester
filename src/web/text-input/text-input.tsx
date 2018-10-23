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
  enable,
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

const LabelClass = (theme: TextInputTheme) => {
  const base = css`
    transform: translate(5px, 100%);
  `;
  return { className: base };
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

/**
 * Label
 * Container with activator
 * text input
 * helper text
 * error message
 * icons (leading & trailing)
 */
class TextInputImpl extends React.PureComponent<TextInputProps> {
  render() {
    const { label, forwardedRef, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(
      TextInputRootClass(theme),
      TypographyProps({ scale: 'Caption' }),
      defaultHostProps
    );
    const labelProps = mergeProps(LabelClass(theme));
    const inputProps = mergeProps(TypographyProps({ scale: 'Subtitle1' }), InputClass(theme));
    return (
      <div ref={forwardedRef} {...hostProps}>
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
