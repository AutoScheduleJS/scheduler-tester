import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { ButtonClasses, ButtonEmphaze } from '../button/button';
import { StButton } from '../st-button';

interface TabsFixedClasses {
  root?: string;
  tabs?: string;
  tab?: ButtonClasses;
}

interface CustomableProps {
  classes?: TabsFixedClasses;
  theme?: any;
}

export enum TabsFixedPlacement {
  FullWidth,
  Centered,
  LeftAligned,
  RightAligned,
}

export interface TabsFixedProps extends CustomableProps {
  placement: TabsFixedPlacement;
  activeTab: string;
  onChange: (id: string, event: Event) => void;
  tabs: Array<{ icon?: React.Component; label?: string; id: string }>;
}

interface TabsFixedTheme {
  tabs: {
    totalHeight: string;
    backgroundColor: string;
    color: string;
  };
}

const defaultTheme = (theme: any): TabsFixedTheme => ({
  tabs: {
    totalHeight: '48px',
    backgroundColor: theme.palette.surface.main,
    color: theme.palette.primary.main,
    ...theme.tabs,
  },
});

const defaultClasses: TabsFixedClasses = {
  root: '',
  tabs: '',
  tab: {},
};

const placementToJustify = (placement: TabsFixedPlacement) => {
  switch (placement) {
    case TabsFixedPlacement.Centered:
      return 'justify-content: center';
    case TabsFixedPlacement.FullWidth:
      return 'justify-content: stretch';
    case TabsFixedPlacement.LeftAligned:
      return 'justify-content: flex-start';
    case TabsFixedPlacement.RightAligned:
      return 'justify-content: flex-end';
  }
};

const containerCss = (placement: TabsFixedPlacement) => css`
  display: flex;
  ${placementToJustify(placement)};
`;

const tabsCss = css`
  display: inline-grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
`;

const tabButtonClasse = (theme: TabsFixedTheme, isActive: boolean): ButtonClasses => ({
  root: css`
    box-sizing: content-box;
    height: ${theme.tabs.totalHeight};
    background-color: ${theme.tabs.backgroundColor};
    color: ${theme.tabs.color};
    border-bottom: ${isActive ? `2px solid ${theme.tabs.color}` : 'none'};
    border-radius: 0;
    padding: 0 16px;
    grid-row: 1;
  `,
});

class TabsFixedImpl extends React.PureComponent<TabsFixedProps> {
  componentWillReceiveProps(nextProp: TabsFixedProps) {
    if (this.props.activeTab !== nextProp.activeTab) {
      console.log('activeIndex changed!');
    }
  }
  render() {
    const {
      activeTab,
      children,
      tabs,
      placement,
      theme: incomingTheme,
      classes = defaultClasses,
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <div
        className={css`
          ${classes.root};
        `}
      >
        <div className={containerCss(placement)}>
          <div
            className={css`
              ${tabsCss} ${classes.tabs};
            `}
          >
            {tabs.map(tab => (
              <StButton
                emphaze={ButtonEmphaze.Low}
                label={tab.label}
                icon={tab.icon}
                onClick={e => {
                  console.log('e :', e);
                }}
                classes={{ ...tabButtonClasse(theme, tab.id === activeTab), button: classes.tab }}
              />
            ))}
          </div>
        </div>
        {children}
      </div>
    );
  }
}

/**
 * With or without animation: activeIndex; onChange; content -> children
 */

export const TabsFixed = withTheme(TabsFixedImpl);
