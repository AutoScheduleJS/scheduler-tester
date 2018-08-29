import * as React from 'react';
import * as ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export class Modal extends React.PureComponent {
  state = {
    isMounted: false,
  };

  private el: HTMLDivElement;

  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    if (!this.state.isMounted) {
      return null;
    }
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
