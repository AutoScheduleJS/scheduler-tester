import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';

interface ResponsiveThemeProps {
  baseTheme: any;
  rules: Array<{ key: string; query: string }>;
  handleBreakpoint: (theme: any, key: string[]) => any;
}

export class ResponsiveTheme extends React.Component<ResponsiveThemeProps> {
  state: { theme: any };

  private mqls: Array<{ key: string; mql: MediaQueryList }>;

  constructor(props: ResponsiveThemeProps) {
    super(props);
    if (!window.matchMedia) {
      this.state = {
        theme: props.baseTheme,
      };
      return;
    }

    this.mqls = props.rules.map(rule => ({ key: rule.key, mql: window.matchMedia(rule.query) }));
    const theme = props.handleBreakpoint(
      props.baseTheme,
      this.mqls.filter(mql => mql.mql.matches).map(mql => mql.key)
    );
    this.state = {
      theme,
    };
    this.handleMatchChange = this.handleMatchChange.bind(this);
    this.mqls.forEach(mql => mql.mql.addListener(this.handleMatchChange));
  }

  render() {
    const { children } = this.props;
    const theme = this.state.theme;
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  }

  componentWillUnmount() {
    this.mqls.forEach(mql => mql.mql.removeListener(this.handleMatchChange));
  }

  private handleMatchChange(e: MediaQueryList) {
    const rule = this.props.rules.find(rule => rule.query === e.media);
    if (!rule) {
      return;
    }
    this.setState({
      theme: this.props.handleBreakpoint(this.state.theme, [rule.key]),
    });
  }
}
