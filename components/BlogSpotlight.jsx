import Link from "next/link";
import BlogList from "./BlogList";
import { loadPostsForBuild } from "./blogApi";

// Home page "From the Blog" — newest 3 published posts from the admin dashboard.
export default async function BlogSpotlight() {
  const posts = await loadPostsForBuild();
  const builtSlugs = posts.map((p) => p.slug);

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

        <BlogList initialPosts={posts} builtSlugs={builtSlugs} limit={3} className="blog-grid blog-grid-center" />

        <div className="blog-spotlight-footer">
          <Link href="/blog" className="btn-outline">
            <i className="fas fa-bullhorn"></i> View All Notifications
          </Link>
        </div>
      </div>
    </section>
  );
}
