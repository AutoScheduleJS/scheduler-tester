import * as React from 'react';

interface QueryMatcherProps {
  mediaQuery: string;
  children: (v: boolean) => React.ReactNode;
}

export class QueryMatcher extends React.Component<QueryMatcherProps> {
  state: { matches: false };

  private mql: MediaQueryList;

  constructor(props: QueryMatcherProps) {
    super(props);
    this.state = {
      matches: false,
    };
    if (!window.matchMedia) {
      return;
    }
    this.mql = window.matchMedia(props.mediaQuery);
    this.handleMatchChange = this.handleMatchChange.bind(this);
    this.mql.addListener(this.handleMatchChange);
  }

  render() {
    const { children } = this.props;
    return children(this.state.matches);
  }

  componentWillUnmount() {
    this.mql.removeListener(this.handleMatchChange);
  }

  private handleMatchChange(e: MediaQueryList) {
    this.setState({
      matches: e.matches,
    });
  }
}
