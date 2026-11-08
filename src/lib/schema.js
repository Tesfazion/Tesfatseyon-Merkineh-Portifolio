/**
 * JSON-LD schema builders.
 *
 * Kept out of Seo.jsx on purpose: Seo.jsx is a component, and React Fast
 * Refresh only works on files that export nothing but components. Building
 * the schema from config also means the structured data can never drift
 * from the visible content the way a hand-written index.html block does.
 */
import { site, company } from "../config";

export function personSchema(profile, socials) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: site.url,
    image: `${site.url}/og.jpg`,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
      addressCountry: "ET",
    },
    /* The studio is part of the professional identity, so it belongs in the
       schema rather than only in the copy. */
    worksFor: {
      "@type": "Organization",
      name: company.name,
      url: company.url,
      email: `mailto:${company.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: company.location,
        addressCountry: "ET",
      },
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education,
    },
    knowsAbout: [
      "React", "Next.js", "TypeScript", "Python", "Tailwind CSS",
      "Node.js", "UI/UX Design", "SEO", "CapCut", "DaVinci Resolve",
      "Color Grading",
    ],
    sameAs: Object.values(socials),
  };
}

export function breadcrumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function blogPostingSchema(post, { excerpt, author }) {
  const url = `${site.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: excerpt,
    url,
    /* Google wants an object here; a bare URL string is tolerated but
       loses the `contentUrl` the rich result actually reads. */
    mainEntityOfPage: { "@type": "WebPage", "@id": url, contentUrl: url },
    datePublished: post.date,
    dateModified: post.modified || post.date,
    keywords: post.tags.join(", "),
    wordCount: post.words,
    inLanguage: "en",
    author: { "@type": "Person", name: author },
    publisher: { "@type": "Person", name: author, url: site.url },
  };
}
