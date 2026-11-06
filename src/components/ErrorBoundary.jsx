import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-[#17101F] border border-[#8955B5]/40 text-center space-y-3">
          <h3 className="text-lg font-semibold text-[#D3C0E8]">Notice</h3>
          <p className="text-xs text-[#B7AFC1] font-mono">{String(this.state.error?.message || this.state.error)}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-gradient-to-r from-[#633B86] to-[#8955B5] text-[#F5F0FA] rounded-xl text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
