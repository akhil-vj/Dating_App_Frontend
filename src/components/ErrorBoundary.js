import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center">
            <div className="text-6xl text-red-500 mb-4">😕</div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Refresh Page
            </button>
            <div className="mt-6 p-4 bg-gray-100 rounded text-left overflow-auto max-h-40">
              <p className="text-xs text-gray-700 font-mono break-words">
                {this.state.error?.toString() || 'Unknown error'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
