import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[VOLTEACH ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6"
          dir="rtl"
        >
          <div className="max-w-lg w-full text-center space-y-6">
            <div className="text-7xl select-none">⚡</div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">אופס! משהו השתבש</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                אירעה שגיאה בלתי צפויה בפורטל VOLTEACH.
                <br />
                ניתן לרענן את הדף כדי לחזור לפעילות רגילה.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-[10px] text-red-400 bg-slate-900 border border-red-500/20 rounded-xl p-4 overflow-auto max-h-40 font-mono whitespace-pre-wrap break-all">
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
              >
                🔄 רענן את הדף
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-8 py-3.5 text-sm font-bold text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
              >
                ← נסה שוב
              </button>
            </div>

            <p className="text-xs text-slate-600">
              אם הבעיה חוזרת,{' '}
              <a
                href="mailto:volteach.contact@gmail.com"
                className="text-indigo-400 underline hover:text-white transition-colors"
              >
                צור איתנו קשר
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
