import { Component, ErrorInfo, PropsWithChildren, ReactNode } from 'react';

type EBProps = PropsWithChildren<{ fallback: ReactNode }>;

export class ErrorBoundary extends Component<EBProps, { hasError: boolean }> {
    public state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}
