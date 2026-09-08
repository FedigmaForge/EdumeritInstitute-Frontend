import Link from "next/link";
import { BLOG_POSTS } from "@/components/blogPosts";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "Blog — Exam Notifications & Updates",
  description:
    "EduMerit Institute blog — banking & SSC exam notifications, results, admit card alerts and important announcements for competitive exam aspirants.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Exam Notifications & Updates | EduMerit Institute",
    description: "Exam notifications, results, admit card alerts and important announcements.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = BLOG_POSTS;

  return (
    <section className="blog-list-section blog-list-section-top">
      <div className="container">
        <div className="blog-list-breadcrumb">
          <Link href="/">
            <i className="fas fa-home"></i> Home
          </Link>
          <i className="fas fa-chevron-right"></i>
          <span>Blog</span>
        </div>

        <div className="section-header" style={{ textAlign: "left", margin: "0 0 2.5rem" }}>
          <span className="eyebrow">
            <i className="fas fa-bullhorn"></i> Notifications &amp; Updates
          </span>
          <h1 style={{ fontSize: "2rem", margin: "0.6rem 0 0" }}>Blog</h1>
        </div>

        {posts.length === 0 ? (
          <div className="blog-empty">
            <i className="fas fa-bullhorn" style={{ fontSize: "2.5rem", color: "var(--navy)", marginBottom: "1rem", display: "block" }}></i>
            <h3 style={{ color: "var(--navy)", marginBottom: "0.75rem" }}>No Notifications Published Yet</h3>
            <p>
              We're setting this space up for real exam notifications, results and admit card alerts. In the
              meantime, message us on WhatsApp and our team will share the latest updates directly.
            </p>
            <a
              href="https://wa.me/919211278818?text=Hi%20EduMerit%20Institute,%20I%20want%20the%20latest%20exam%20notifications%20and%20updates"
              target="_blank"
              rel="noreferrer"
              className="btn-accent"
            >
              <i className="fab fa-whatsapp"></i> Ask on WhatsApp
            </a>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <BlogCard post={post} key={post.slug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
