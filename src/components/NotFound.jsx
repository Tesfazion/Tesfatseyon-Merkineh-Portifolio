/**
 * NotFound — in-app 404 for unknown routes.
 *
 * App.jsx sends every unmatched path here so a mistyped URL never
 * silently renders the homepage (bad for both users and SEO). Unknown
 * slugs under /blog redirect to the blog index instead.
 */
import { Link, useLocation } from "react-router-dom";
import { site, modesList } from "../config";
import Seo from "./Seo";
import Icon from "./Icon";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <>
      <Seo
        title={`Page not found — ${site.seo.title}`}
        description="That page does not exist. Head back to the homepage or pick a service."
        /* The address the visitor actually asked for, not a hardcoded
           /404 — otherwise every dead link on the internet reports the
           same og:url when it gets shared onward. Seo drops the canonical
           for noindex routes; og:url still needs something honest. */
        path={pathname}
        /* Without this a 404 is a perfectly indexable page, so a typo in a
           shared link can end up as a real entry in someone's search
           results. */
        noindex
      />

      <main className="notfound">
        <span className="notfound-code">404</span>
        <h1 className="notfound-title">
          This page <em>does not exist</em>
        </h1>
        <p className="notfound-text">
          The link may be out of date, or the address might have a typo.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            <Icon name="arrowDown" size={16} /> Back to home
          </Link>
          {modesList.map((m) => (
            <Link key={m.key} to={m.route} className="btn btn-ghost">
              {m.label}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}