import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  scope?: '3d' | 'ui';
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class Game3DErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Game3DErrorBoundary] 3D Canvas error caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0914] text-white p-6 z-20">
          <div className="p-6 rounded-2xl bg-[#1c1328] border border-amber-500/40 text-center max-w-md shadow-2xl">
            <span className="text-4xl mb-3 block">🪔</span>
            <h2 className="text-xl font-bold text-amber-300 mb-2">3D Scene Temporarily Interrupted</h2>
            <p className="text-sm text-neutral-300 mb-4">
              A 3D rendering glitch occurred, but your celebration progress and UI remain safe.
            </p>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-lg transition-transform active:scale-95"
            >
              Resume 3D Celebration ✨
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export class UIErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[UIErrorBoundary] UI overlay error caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <div className="px-4 py-2.5 rounded-xl bg-red-950/90 border border-red-500/50 text-white text-xs flex items-center gap-3 shadow-xl backdrop-blur-md">
            <span>HUD overlay encountered a minor issue.</span>
            <button
              onClick={this.handleReset}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors"
            >
              Restore HUD
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
