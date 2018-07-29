import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Button, ButtonEmphaze } from '../button/button';

interface CustomableProps {
  classes?: {
    root: string;
    tabs: string;
    tab: string;
    label: string;
  };
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
    backgroundColor: theme.palette.primary.variant,
    color: theme.palette.primary.on,
    ...theme.tabs,
  },
});

const defaultClasses = {
  root: '',
  tabs: '',
  tab: '',
  label: '',
};

const tabFromTheme = (theme: TabsFixedTheme, isActive: boolean) => css`
  height: ${theme.tabs.totalHeight};
  background-color: ${theme.tabs.backgroundColor};
  color: ${theme.tabs.color};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-transform: uppercase;
  border-bottom: ${isActive ? `2px solid ${theme.tabs.color}` : 'none'};
`;

const placementToJustify = (placement: TabsFixedPlacement) => {
  switch (placement) {
    case TabsFixedPlacement.Centered:
      return 'justify-content: center';
    case TabsFixedPlacement.FullWidth:
      return '';
    case TabsFixedPlacement.LeftAligned:
      return 'justify-content: flex-start';
    case TabsFixedPlacement.RightAligned:
      return 'justify-content: flex-end';
  }
};

const placementToCss = (placement: TabsFixedPlacement) => {
  return css`
    display: flex;
    ${placementToJustify(placement)};
  `;
};

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
        <div
          className={css`
            ${placementToCss(placement)} ${classes.tabs};
          `}
        >
          {tabs.map(tab => (
            <div
              className={css`
                ${tabFromTheme(theme, tab.id === activeTab)} ${classes.tab};
              `}
            >
              <Button emphaze={ButtonEmphaze.Low} label={tab.label} icon={tab.icon} />
            </div>
          ))}
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
