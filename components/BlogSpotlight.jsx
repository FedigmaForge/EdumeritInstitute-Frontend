import Link from "next/link";
import { BLOG_POSTS } from "./blogPosts";
import BlogCard from "./BlogCard";

export default function BlogSpotlight() {
  if (BLOG_POSTS.length === 0) return null;
  const posts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="blog-spotlight-section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">
            <i className="fas fa-bullhorn"></i> From the Blog
          </span>
          <h2>Notifications &amp; Updates</h2>
          <div className="divider"></div>
        </div>

        <div className="blog-grid blog-grid-center">
          {posts.map((post) => (
            <BlogCard post={post} key={post.slug} />
          ))}
        </div>

        <div className="blog-spotlight-footer">
          <Link href="/blog" className="btn-outline">
            <i className="fas fa-bullhorn"></i> View All Notifications
          </Link>
        </div>
      </div>
    </section>
  );
}
