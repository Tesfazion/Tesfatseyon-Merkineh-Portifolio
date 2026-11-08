/**
 * BlogIndex — featured post plus the archive, filterable by tag.
 *
 * Filters are driven by URL search params rather than component state, so
 * a filtered view is linkable and the browser back button steps through
 * filters the way a visitor expects. Posts are already imported and
 * bundled at build time, so filtering is a pure in-memory operation —
 * no loading states, no fetch.
 */
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllPosts, getAllTags, readingTime } from "../lib/blog";
import { site } from "../config";
import Seo from "../components/Seo";
import { breadcrumbSchema } from "../lib/schema";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FabControls from "../components/FabControls";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";

function formatDate(date) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogIndex() {
  const [params, setParams] = useSearchParams();
  const activeTag = params.get("tag") || "All";

  const posts = useMemo(() => getAllPosts(), []);
  const tags = useMemo(() => getAllTags(), []);

  const visible = useMemo(
    () => (activeTag === "All" ? posts : posts.filter((p) => p.tags.includes(activeTag))),
    [posts, activeTag]
  );

  const setTag = (tag) => {
    if (tag === "All") params.delete("tag");
    else params.set("tag", tag);
    // replace: filtering is a refinement of this page, not a new one the
    // visitor wants a Back entry for.
    setParams(params, { replace: true });
  };

  const [featured, ...rest] = visible;

  return (
    <>
      <Seo
        title={activeTag === "All" ? `Blog — ${site.seo.title}` : `${activeTag} — Blog`}
        description="Essays on web development, short-form video editing, and building honest client work — from Tesfatseyon Merkinh."
        path="/blog"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <Navbar />

      <main>
        <section className="container blog-head">
          <Reveal className="sec-head">
            <span className="kicker"><i>Journal</i> Writing</span>
            <h1 className="sec-title">Notes on <em>building</em> &amp; <em>editing</em></h1>
            <p className="sec-sub">
              How I structure React apps, what actually holds a short-form
              viewer, and why I insist on showing the work instead of
              claiming the results.
            </p>
          </Reveal>

          {tags.length > 0 && (
            <Reveal className="filter-bar" role="group" aria-label="Filter posts by topic">
              {["All", ...tags].map((t) => (
                <button
                  key={t}
                  className={`filter-btn${activeTag === t ? " active" : ""}`}
                  onClick={() => setTag(t)}
                  aria-pressed={activeTag === t}
                >
                  {t}
                </button>
              ))}
            </Reveal>
          )}
        </section>

        <section className="container blog-archive">
          {visible.length === 0 ? (
            <p className="empty-state">No posts under “{activeTag}” yet.</p>
          ) : (
            <>
              {activeTag === "All" && featured && (
                <Reveal>
                  <Link to={`/blog/${featured.slug}`} className="blog-featured">
                    <div className="blog-featured-main">
                      <div className="blog-card-meta">
                        <span className="tag">{featured.tags[0] || "Notes"}</span>
                        <span>{formatDate(featured.date)}</span>
                        <span className="chip-read">{readingTime(featured)} min read</span>
                      </div>
                      <h2>{featured.title}</h2>
                      <p>{featured.excerpt}</p>
                      <span className="text-link">
                        Read the feature <Icon name="arrowRight" size={14} />
                      </span>
                    </div>
                    <div className="blog-featured-aside">
                      <span className="tag">Latest note</span>
                      <span className="blog-featured-aside-title">
                        {featured.tags.join(" · ")}
                      </span>
                      <span className="chip-read">
                        {featured.words.toLocaleString()} words — edited, not padded
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )}

              <div className="blog-grid">
                {rest.map((post, i) => (
                  <Reveal key={post.slug} delay={(i % 2) * 70}>
                    <Link to={`/blog/${post.slug}`} className="card blog-card">
                      <div className="blog-card-meta">
                        <span className="tag">{post.tags[0] || "Notes"}</span>
                        <span>{formatDate(post.date)}</span>
                        <span className="chip-read">{readingTime(post)} min read</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <span className="text-link">
                        Read post <Icon name="arrowRight" size={14} />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
      <FabControls />
    </>
  );
}
