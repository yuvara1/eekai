import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface State { error: Error | null; errorInfo: React.ErrorInfo | null }

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  level?: "page" | "section";
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    // In production, send to error tracking service here
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary caught]", error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return this.props.level === "section"
        ? <SectionError error={this.state.error} onReset={this.reset} />
        : <PageError error={this.state.error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}

function PageError({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5 mx-auto">
        <AlertTriangle size={28} className="text-destructive" />
      </div>
      <h2 className="text-xl font-semibold text-foreground tracking-tight mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-1">
        An unexpected error occurred. The team has been notified.
      </p>
      {import.meta.env.DEV && (
        <p className="text-xs text-destructive/70 font-mono mt-2 mb-5 max-w-md bg-destructive/5 px-3 py-2 rounded-lg text-left break-all">
          {error.message}
        </p>
      )}
      <div className="flex gap-3 mt-4">
        <Button variant="outline" size="sm" onClick={() => window.location.replace("/")}>
          <Home size={13} className="mr-1.5" /> Go home
        </Button>
        <Button size="sm" onClick={onReset}>
          <RefreshCw size={13} className="mr-1.5" /> Try again
        </Button>
      </div>
    </div>
  );
}

function SectionError({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
      <div className="flex items-center gap-3 min-w-0">
        <AlertTriangle size={16} className="text-destructive shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Failed to load this section</p>
          {import.meta.env.DEV && (
            <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">{error.message}</p>
          )}
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onReset} className="shrink-0">
        <RefreshCw size={12} className="mr-1.5" /> Retry
      </Button>
    </div>
  );
}

/** Convenience wrapper for wrapping any section of UI */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  level: "page" | "section" = "page",
) {
  return function WrappedWithErrorBoundary(props: P) {
    return (
      <ErrorBoundary level={level}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
