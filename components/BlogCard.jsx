import Link from "next/link";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function BlogCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card-banner">
        <i className={`fas ${post.bannerIcon || "fa-bullhorn"} blog-card-banner-icon`}></i>
        <span className="blog-card-banner-tag">{post.category}</span>
        <h3>{post.bannerText || post.title}</h3>
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
    </Link>
  );
}
