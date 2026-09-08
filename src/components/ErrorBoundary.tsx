import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
 children: React.ReactNode;
}

interface ErrorBoundaryState {
 error: Error | null;
}

/**
 * Top-level safety net. Without this, an uncaught render error anywhere in the
 * tree (e.g. a synthesis response missing an expected field) unmounts the
 * entire app, leaving only the page's dark background visible - a "black
 * screen" with no indication anything went wrong.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
 constructor(props: ErrorBoundaryProps) {
 super(props);
 this.state = { error: null };
 }

 static getDerivedStateFromError(error: Error): ErrorBoundaryState {
 return { error };
 }

 componentDidCatch(error: Error, info: React.ErrorInfo) {
 console.error('Unhandled UI error caught by ErrorBoundary:', error, info);
 }

 private handleReset = () => {
 this.setState({ error: null });
 };

 render() {
 if (this.state.error) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-theme-bg text-[#e2e8f0] p-6">
 <div className="max-w-md w-full space-y-4 p-6 bg-semantic-red/10 border border-semantic-red/30 terminal-border text-center">
 <AlertTriangle className="w-8 h-8 text-semantic-red mx-auto" />
 <h1 className="text-sm font-bold font-mono uppercase tracking-wider text-semantic-red">
 Synthesis Protocol Interrupted
 </h1>
 <p className="text-xs font-mono text-semantic-red/90 leading-relaxed">
 {this.state.error.message || 'An unexpected client-side error occurred.'}
 </p>
 <button
 type="button"
 onClick={this.handleReset}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-semantic-red/30 terminal-border bg-semantic-red/10 hover:bg-semantic-red/20 text-semantic-red text-xs font-mono transition-colors"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 <span>Reset &amp; Retry</span>
 </button>
 </div>
 </div>
 );
 }

 return this.props.children;
 }
}
