import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { mergeAll, mergeProps } from '../util/hoc.util';

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}
interface LayoutMasonryProps extends CustomableProps {
  columnGap?: string;
  rowGap?: string;
  itemWidth: string;
}

interface LayoutMasonryTheme {
  layout: {
    verticalGutter: string;
    horizontalGutter: string;
  };
}

const defaultTheme = (theme: any, columnGap, rowGap): LayoutMasonryTheme => {
  return mergeAll(
    {
      layout: {
        verticalGutter: '24px',
        horizontalGutter: '24px',
      },
    } as LayoutMasonryTheme,
    theme,
    { layout: { verticalGutter: columnGap, horizontalGutter: rowGap } }
  );
};

const themeToHostProps = (theme: LayoutMasonryTheme, itemWidth: string) => {
  const layout = theme.layout;
  return {
    className: css`
      display: grid;
      grid-column-gap: ${layout.verticalGutter};
      grid-row-gap: ${layout.horizontalGutter};
      grid-template-columns: repeat(auto-fill, minmax(${itemWidth}, 1fr));
      grid-auto-rows: 1px;
    `,
  };
};

class LayoutMasonryImpl extends React.PureComponent<LayoutMasonryProps> {
  render() {
    const {
      children,
      columnGap,
      rowGap,
      itemWidth,
      theme: incomingTheme,
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme, columnGap, rowGap);
    const hostProps = mergeProps(themeToHostProps(theme, itemWidth), defaultHostProps);
    return <div {...hostProps}>{children}</div>;
  }
}

export const LayoutMasonry = withTheme(LayoutMasonryImpl);
