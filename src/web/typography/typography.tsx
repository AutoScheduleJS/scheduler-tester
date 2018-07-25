import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';

interface CustomableProps {
  classes?: {
    root: string;
  };
  theme?: any;
}

export enum Scale {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Subtitle1,
  Subtitle2,
  Body1,
  Body2,
  Button,
  Caption,
  Overline,
}

interface TypographyProps extends CustomableProps {
  scale: Scale;
}

interface TypographyTheme {
  typography: {
    typeface: string;
  };
}

const defaultTheme = (theme: any): TypographyTheme => ({
  typography: {
    typeface: "'Roboto', sans-serif",
    ...theme.typography,
  },
});

const defaultClasses = {
  root: {},
};

const typeScale = (theme: TypographyTheme, scale: Scale): string => {
  const base = `font-family: ${theme.typography.typeface}`;
  switch (scale) {
    case Scale.H1:
      return css`
        ${base};
      `;
  }
  return css`
    ${base};
  `;
};

class TypographyImpl extends React.PureComponent<TypographyProps> {
  render() {
    const { children, scale, theme: incomingTheme, classes = defaultClasses } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <div
        className={css`
          ${typeScale(theme, scale)} ${classes.root};
        `}
      >
        {children}
      </div>
    );
  }
}

export const Typography = withTheme(TypographyImpl);
