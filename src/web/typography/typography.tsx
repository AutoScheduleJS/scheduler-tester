import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { merge } from '../util/hoc.util';

interface CustomableProps {
  classes?: {
    root: string;
  };
  theme?: any;
}
interface TypographyProps extends CustomableProps {
  scale: keyof TypographyTheme;
  baselineTop?: number;
  baselineBottom?: number;
}

enum TypographyCase {
  Sentence,
  AllCase,
}

interface TypographyAttribte {
  typeface: string;
  weight: 300 | 400 | 500;
  size: string;
  case: TypographyCase;
  LetterSpacing: string;
}

interface TypographyTheme {
  H1: TypographyAttribte;
  H2: TypographyAttribte;
  H3: TypographyAttribte;
  H4: TypographyAttribte;
  H5: TypographyAttribte;
  H6: TypographyAttribte;
  Subtitle1: TypographyAttribte;
  Subtitle2: TypographyAttribte;
  Body1: TypographyAttribte;
  Body2: TypographyAttribte;
  Button: TypographyAttribte;
  Caption: TypographyAttribte;
  Overline: TypographyAttribte;
}

const defaultTheme = (theme: any): { typography: TypographyTheme } => {
  const base = {
    typeface: "'Roboto', sans-serif",
    weight: 400,
    case: TypographyCase.Sentence,
  };
  return merge(
    {
      typography: {
        H1: { ...base, weight: 300, size: '6rem', LetterSpacing: '-0.09375rem' },
        H2: { ...base, weight: 300, size: '3.75rem', LetterSpacing: '-0.03125rem' },
        H3: { ...base, size: '3rem', LetterSpacing: '0rem' },
        H4: { ...base, size: '2.125rem', LetterSpacing: '0.015625rem' },
        H5: { ...base, size: '1.5rem', LetterSpacing: '0rem' },
        H6: { ...base, weight: 500, size: '1.25rem', LetterSpacing: '0.009375rem' },
        Subtitle1: { ...base, size: '1rem', LetterSpacing: '0.009375rem' },
        Subtitle2: { ...base, weight: 500, size: '0.875rem', LetterSpacing: '0.00625rem' },
        Body1: { ...base, size: '1rem', LetterSpacing: '0.03125rem' },
        Body2: { ...base, size: '0.875rem', LetterSpacing: '0.015625rem' },
        Button: {
          ...base,
          case: TypographyCase.AllCase,
          weight: 500,
          size: '0.875rem',
          LetterSpacing: '0.046875rem',
        },
        Caption: { ...base, size: '0.75rem', LetterSpacing: '0.025rem' },
        Overline: {
          ...base,
          case: TypographyCase.AllCase,
          size: '0.625rem',
          LetterSpacing: '0.09375rem',
        },
      },
    },
    theme
  );
};

const defaultClasses = {
  root: {},
};

const baselineStrut = distance => `
  display: inline-block; width: 0; content: ''; height: ${distance}px
`;

const typeScale = (
  theme: { typography: TypographyTheme },
  scale: keyof TypographyTheme,
  baselineTop = 0,
  baselineBottom?: number
): string => {
  const attr = theme.typography[scale];
  const bottomPos =
    baselineBottom === undefined
      ? ''
      : `
    position: absolute;
    bottom: ${baselineBottom}px;
  `;

  return css`
    font-family: ${attr.typeface};
    font-weight: ${attr.weight};
    text-transform: ${attr.case === TypographyCase.Sentence ? 'initial' : 'uppercase'};
    letter-spacing: ${attr.LetterSpacing};
    font-size: ${attr.size};
    margin-bottom: ${-1 * (baselineBottom || 0)};
    &::before {
      ${baselineStrut(baselineTop)};
      vertical-align: 0;
    }
    &::after {
      ${baselineStrut(baselineBottom)};
      vertical-align: ${-1 * (baselineBottom || 0)};
    }
    ${bottomPos}
  `;
};

class TypographyImpl extends React.PureComponent<TypographyProps> {
  render() {
    const {
      children,
      scale,
      baselineTop,
      baselineBottom,
      theme: incomingTheme,
      classes = defaultClasses,
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <div
        className={css`
          ${typeScale(theme, scale, baselineTop, baselineBottom)} ${classes.root};
        `}
      >
        {children}
      </div>
    );
  }
}

export const Typography = withTheme(TypographyImpl);

export const TypographyProps = (
  scale: keyof TypographyTheme,
  baselineTop?: number,
  baselineBottom?: number,
  customTheme?: any
) => {
  const theme = defaultTheme(customTheme);
  return { className: typeScale(theme, scale, baselineTop, baselineBottom) };
};
