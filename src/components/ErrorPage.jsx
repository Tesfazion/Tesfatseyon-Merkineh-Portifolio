/**
 * ErrorPage — the app-wide fallback when even the router fails to render.
 *
 * Deliberately dependency-free: no Link, no config-driven content, no
 * hooks. If this component depends on something that just broke, it would
 * break too, and the visitor would be left with a blank page — which is
 * the exact failure this page exists to prevent.
 */
export default function ErrorPage() {
  return (
    <main className="notfound error-page">
      <span className="notfound-code" aria-hidden="true">Error</span>
      <h1 className="notfound-title">
        The site hit a <em>problem</em>
      </h1>
      <p className="notfound-text">
        Something went wrong while rendering this page. Reloading usually
        fixes it — and if it keeps happening, get in touch and I'll sort it out.
      </p>

      <div className="notfound-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Reload the page
        </button>
        <a className="btn btn-ghost" href="mailto:tesfatseyon16@gmail.com">
          Report the problem
        </a>
      </div>
    </main>
  );
}
