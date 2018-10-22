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
  hidden
};

export interface TextInputProps extends CustomableProps {
  label: string;
  value: string;
  labelType?: LabelType;
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
  };
}

const defaultTheme = (theme: any): TextInputTheme =>
  merge(
    {
      textInput: {
        shape: css`
          border-radius: 4px;
          padding: 0 16px;
          height: 36px;
          min-width: 64px;
          color: ${theme.palette.secondary.main};
        `,
      },
    },
    theme
  );

/**
 * Caution: prettier will add an indesirable space between baselineColor & opacity
 */
const TextInputRootClass = (theme: TextInputTheme) => {
  const base = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    text-align: center;
    ${theme.textInput.shape};
  `;
  return base;
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
const TextInputImplWithTheme = withTheme(TextInputImpl);

export const TextInput = React.forwardRef<HTMLDivElement, TextInputProps>((props, ref) => (
  <TextInputImplWithTheme {...props} forwardedRef={ref} />
));
