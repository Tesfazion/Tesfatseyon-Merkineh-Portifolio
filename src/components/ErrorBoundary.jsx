/**
 * ErrorBoundary — keeps a rendering failure from becoming a blank page.
 *
 * React unmounts the whole tree if an error escapes, so without this a
 * single bad prop means a white screen and no way back. Each route is
 * wrapped individually, so a failure in the blog leaves the rest of the
 * site usable, and the boundary can be reset without a full reload.
 */
import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Kept in the console rather than sent anywhere: a static site has no
    // backend, and silently swallowing the error would make it undebuggable.
    console.error("Portfolio error:", error, info?.componentStack);
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    const { children, fallback, label = "this section" } = this.props;

    if (!error) return children;

    /* A custom fallback (e.g. the full-page ErrorPage) owns its recovery. */
    if (fallback) return fallback;

    return (
      <div className="error-boundary" role="alert">
        <h2>Something broke in {label}</h2>
        <p>
          This part of the page failed to load. The rest of the site still
          works — or reload to start clean.
        </p>
        <div className="error-boundary-actions">
          <button type="button" className="btn btn-primary" onClick={this.reset}>
            Try again
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
        {import.meta.env?.DEV && (
          <pre className="error-boundary-detail">{String(error.message || error)}</pre>
        )}
      </div>
    );
  }
}
