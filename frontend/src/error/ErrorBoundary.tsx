import { Component, ErrorInfo, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  fallback: React.ElementType;
}

interface IState {
  error: Error | null;
}

export default class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log('error: ', error);
    console.log('errorInfo: ', errorInfo);
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error !== null) {
      return <this.props.fallback error={error} />;
    }
    return children;
  }
}
