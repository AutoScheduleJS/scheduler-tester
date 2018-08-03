import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { animated, Transition } from 'react-spring';
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

export interface TabInfo {
  icon?: React.Component;
  label?: string;
  id: string;
}

export interface TabsFixedProps extends CustomableProps {
  placement: TabsFixedPlacement;
  activeTab: string;
  onChange: (id: string, event: React.MouseEvent<HTMLDivElement>) => void;
  tabs: TabInfo[];
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

const tabButtonClasse = (
  theme: TabsFixedTheme,
  isActive: boolean,
  buttonClasses: ButtonClasses = {}
) => ({
  root: css`
    box-sizing: content-box;
    background-color: ${theme.tabs.backgroundColor};
    color: ${theme.tabs.color};
    border-bottom: ${isActive ? `2px solid ${theme.tabs.color}` : 'none'};
    border-radius: 0;
    grid-row: 1;
  `,
  innerBtn: {
    button: css`
      padding: 0 16px;
      height: ${theme.tabs.totalHeight};
    `,
    ...buttonClasses,
  },
});

interface TabsFixedState {
  activeI: number;
  activeTab: string;
  backward?: boolean;
}

const baseContentStyle = {
  width: '100%',
  position: 'absolute',
};

const rootClass = css`
  position: relative;
  overflow: hidden;
`;

class TabsFixedImpl extends React.PureComponent<TabsFixedProps> {
  state: TabsFixedState = {
    activeI: 0,
    activeTab: '',
  };
  static getDerivedStateFromProps(props: TabsFixedProps, state: TabsFixedState) {
    if (state.activeTab === props.activeTab) {
      return null;
    }
    const activeI = props.tabs.findIndex(tab => tab.id === props.activeTab);
    const previousI = props.tabs.findIndex(tab => tab.id === state.activeTab);
    return {
      activeI: activeI,
      activeTab: props.activeTab,
      backward: previousI === -1 ? undefined : previousI > activeI,
    } as TabsFixedState;
  }
  render() {
    const {
      activeTab,
      children,
      onChange,
      tabs,
      placement,
      theme: incomingTheme,
      classes = defaultClasses,
    } = this.props;
    if (!tabs.length) {
      return null;
    }
    const { activeI, backward } = this.state;
    const enter = { transform: 'translate3d(0%,0,0)' };
    const from = {
      transform: `translate3d(${backward === undefined ? 0 : backward ? -100 : 100}%,0,0)`,
    };
    const leave = { transform: `translate3d(${backward ? 100 : -100}%,0,0)` };
    const theme = defaultTheme(incomingTheme);
    return (
      <div
        className={css`
          ${rootClass} ${classes.root};
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
                onClick={e => onChange(tab.id, e)}
                classes={tabButtonClasse(theme, tab.id === activeTab, classes.tab)}
              />
            ))}
          </div>
        </div>
        <Transition native from={from} enter={enter} leave={leave} keys={[activeI]}>
          {(styles: any) => (
            <animated.div style={{ ...baseContentStyle, ...styles }}>
              {React.Children.toArray(children)[activeI]}
            </animated.div>
          )}
        </Transition>
      </div>
    );
  }
}

export const TabsFixed = withTheme(TabsFixedImpl);
