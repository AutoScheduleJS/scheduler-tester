import * as React from 'react';

interface QueryMatcherProps {
  mediaQuery: string;
  defaultMatch?: boolean;
  children?: (v: boolean) => React.ReactNode;
  ToRender?: React.ComponentType<any>;
  [key: string]: any;
}

export class QueryMatcher extends React.Component<QueryMatcherProps> {
  state: { matches: boolean };

  private mql: MediaQueryList;

  constructor(props: QueryMatcherProps) {
    super(props);
    if (!window.matchMedia) {
      this.state = {
        matches: !!props.defaultMatch,
      };
      return;
    }
    this.mql = window.matchMedia(props.mediaQuery);
    this.state = {
      matches: this.mql.matches,
    };
    this.handleMatchChange = this.handleMatchChange.bind(this);
    this.mql.addListener(this.handleMatchChange);
  }

  render() {
    const { children, ToRender, ...otherProps } = this.props;
    if (children) {
      return children(this.state.matches);
    }
    if (ToRender && this.state.matches) {
      delete otherProps.defaultMatch;
      delete otherProps.mediaQuery;
      return <ToRender {...otherProps} />;
    }
    return null;
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
