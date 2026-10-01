/**
 * BlogPost — single post page.
 *
 * Reading experience: a progress bar, a generated table of contents that
 * tracks the section you're actually in, syntax-highlighted code with a
 * working copy button, and prev/next so an article is never a dead end.
 */
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  getPostBySlug, getPostContent, getPostNeighbours, readingTime, renderMarkdown,
} from "../lib/blog";
import { site, profile } from "../config";
import Seo from "../components/Seo";
import { blogPostingSchema } from "../lib/schema";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FabControls from "../components/FabControls";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import { TableOfContents } from "../components/TableOfContents";
import { useScrollProgress, useActiveSection } from "../hooks";

function formatDate(date) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function PostLink({ post, direction }) {
  if (!post) return <div />;
  return (
    <Link to={`/blog/${post.slug}`} className={`post-nav-card post-nav-card--${direction}`}>
      <span className="post-nav-label">
        <Icon name={direction === "prev" ? "chevronLeft" : "chevronRight"} size={14} />
        {direction === "prev" ? "Previous" : "Next"}
      </span>
      <strong>{post.title}</strong>
    </Link>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const progress = useScrollProgress();
  const bodyRef = useRef(null);

  /* Only the metadata is eager. The Markdown body is a separate lazy chunk,
     so the article you are reading is the only one a visitor downloads —
     and the command palette does not force the whole blog onto every page.
     A stale response from a previous slug is discarded rather than painted. */
  const [content, setContent] = useState(null);
  useEffect(() => {
    let live = true;
    setContent(null);
    getPostContent(slug).then((c) => {
      if (live) setContent(c);
    });
    return () => { live = false; };
  }, [slug]);

  const headingIds = content?.headings?.map((h) => h.id) ?? [];
  const activeHeading = useActiveSection(headingIds, { offset: 0.2 });

  /* Copy buttons are injected as raw HTML by the markdown renderer, so the
     handler is delegated from the container rather than bound per block. */
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;

    const onClick = async (e) => {
      const btn = e.target.closest("[data-copy-code]");
      if (!btn) return;

      const code = btn.closest(".code-block")?.querySelector("code")?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        // Clipboard API needs a secure context; fall back to a selection.
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch { /* give up quietly */ }
        ta.remove();
      }

      btn.textContent = "Copied";
      btn.classList.add("is-copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("is-copied");
      }, 1800);
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
    /* content is a dependency as well as slug: the body arrives from a lazy
       chunk, so on first paint this ref is still null and the handler would
       otherwise attach to nothing and the copy buttons would silently do
       nothing. */
  }, [slug, content]);

  if (!post) return <Navigate to="/blog" replace />;

  const description = post.excerpt || site.seo.description;
  const { prev, next } = getPostNeighbours(slug);

  return (
    <>
      <Seo
        title={`${post.title} — Blog`}
        description={description}
        path={`/blog/${slug}`}
        type="article"
        publishedTime={post.date}
        modifiedTime={post.date}
        tags={post.tags}
        imageAlt={`${post.title} — an article by ${profile.name}`}
        jsonLd={blogPostingSchema(post, { excerpt: description, author: profile.name })}
      />
      <Navbar />

      <div className="post-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>

      <article className="post">
        <Reveal className="post-head">
          <span className="kicker"><i>Journal</i> {post.tags[0] || "Notes"}</span>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-meta-item">
              <Icon name="calendar" size={13} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="sep" aria-hidden="true" />
            <span className="post-meta-item">
              <Icon name="clock" size={13} />
              {readingTime(post)} min read
            </span>
            {post.words > 0 && (
              <>
                <span className="sep" aria-hidden="true" />
                <span>{post.words.toLocaleString()} words</span>
              </>
            )}
          </div>
          {post.tags.length > 1 && (
            <div className="post-tags">
              {post.tags.map((t) => (
                <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`} className="post-tag">
                  {t}
                </Link>
              ))}
            </div>
          )}
        </Reveal>

        <div className="post-layout">
          <TableOfContents
            headings={content?.headings}
            activeId={activeHeading}
          />

          <div className="post-main">
            {content ? (
              <div
                className="post-body"
                ref={bodyRef}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content.body) }}
              />
            ) : (
              <div className="page-skeleton" role="status">
                <span className="page-skeleton-bar" style={{ width: "92%" }} />
                <span className="page-skeleton-bar" style={{ width: "100%" }} />
                <span className="page-skeleton-bar" style={{ width: "78%" }} />
                <span className="page-skeleton-bar" style={{ width: "46%" }} />
                <span className="page-skeleton-bar" style={{ width: "88%" }} />
                <span className="sr-only">Loading article.</span>
              </div>
            )}

            <footer className="post-foot">
              <div className="post-foot-share">
                <span className="kicker"><i>Enjoyed this?</i> Share it</span>
                <div className="post-share-links">
                  <a
                    className="post-share"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${site.url}/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="x" size={14} /> Post
                  </a>
                  <a
                    className="post-share"
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${site.url}/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="linkedin" size={14} /> Share
                  </a>
                  <a
                    className="post-share"
                    href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`${site.url}/blog/${post.slug}`)}`}
                  >
                    <Icon name="mail" size={14} /> Email
                  </a>
                </div>
              </div>

              <Link to="/blog" className="text-link">
                <Icon name="chevronLeft" size={14} /> All posts
              </Link>
            </footer>
          </div>
        </div>

        {(prev || next) && (
          <nav className="post-nav" aria-label="More articles">
            <PostLink post={prev} direction="prev" />
            <PostLink post={next} direction="next" />
          </nav>
        )}
      </article>

      <Footer />
      <FabControls />
    </>
  );
}
