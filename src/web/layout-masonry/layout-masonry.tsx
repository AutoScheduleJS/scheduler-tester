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

const windowMock = {
  addEventListener: () => {},
  removeEventListener: () => {},
  requestAnimationFrame: fn => {
    fn();
  },
};

class LayoutMasonryImpl extends React.PureComponent<LayoutMasonryProps> {
  private gridRef: React.RefObject<HTMLDivElement>;
  private window = window || windowMock;
  constructor(props) {
    super(props);
    this.resizeItems = this.resizeItems.bind(this);
    this.gridRef = React.createRef();
  }
  componentDidMount() {
    this.window.addEventListener('resize', this.resizeItems);
    this.resizeItems();
  }

  componentWillUnmount() {
    this.window.removeEventListener('resize', this.resizeItems);
  }

  componentDidUpdate() {
    this.resizeItems();
  }

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
    return (
      <div ref={this.gridRef} {...hostProps}>
        {children}
      </div>
    );
  }

  private resizeItems() {
    this.window.requestAnimationFrame(() => {
      const grid = this.gridRef.current;
      if (!grid) {
        return;
      }
      const items = grid.children;
      if (!items) {
        return;
      }
      grid.style.gridAutoRows = 'auto';
      grid.style.alignItems = 'self-start';
      Array.from(items).forEach(item => {
        const span = Math.ceil((item.clientHeight + 24) / 25);
        (item as HTMLDivElement).style.gridRowEnd = `span ${span}`;
      });
      grid.style.gridAutoRows = '';
      grid.style.alignItems = '';
    });
  }
}

export const LayoutMasonry = withTheme(LayoutMasonryImpl);
