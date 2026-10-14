import Link from "next/link";
import { imageUrl } from "./blogApi";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(dateString) ? `${dateString}T00:00:00` : dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

// href: optional — defaults to the post's own page.
export default function BlogCard({ post, href }) {
  const to = href || `/blog/${post.slug}/`;
  const cover = imageUrl(post.coverImage);
  const inner = (
    <>
      <div
        className={`blog-card-banner${cover ? " has-image" : ""}`}
        style={cover ? { backgroundImage: `url(${cover})` } : undefined}
      >
        {!cover && <i className={`fas ${post.bannerIcon || "fa-bullhorn"} blog-card-banner-icon`}></i>}
        {post.category && <span className="blog-card-banner-tag">{post.category}</span>}
        {!cover && <h3>{post.bannerText || post.title}</h3>}
      </div>
      <div className="blog-card-body">
        <span className="blog-card-date">
          <i className="far fa-calendar-alt"></i> {formatDate(post.date)}
        </span>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <span className="blog-card-link">
          Read Article <i className="fas fa-arrow-right"></i>
        </span>
      </div>
    </>
  );
  // Posts published after the last build open the generic viewer — use a full page load for those.
  return to.startsWith("/blog/view/") ? (
    <a href={to} className="blog-card">{inner}</a>
  ) : (
    <Link href={to} className="blog-card">{inner}</Link>
  );
}
