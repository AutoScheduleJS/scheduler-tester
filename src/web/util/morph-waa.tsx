import * as React from 'react';

interface MorphWaaProps {
  fromNode: React.ReactNode;
  toNode: React.ReactNode;
  state: 'from' | 'to';
}

interface MorphWaaState {
  state: 'from' | 'to';
}

export class MorphWaa extends React.Component<MorphWaaProps> {
  state: MorphWaaState = {
    state: 'from',
  };

  static getDerivedStateFromProps(props: MorphWaaProps, state: MorphWaaState) {
    if (props.state === state.state) {
      return null;
    }
    return { state: props.state };
  }

  render() {
    return (
      <React.Fragment>
        {this.state.state === 'from' && this.props.fromNode}
        {this.state.state === 'to' && this.props.toNode}
      </React.Fragment>
    );
  }
}
