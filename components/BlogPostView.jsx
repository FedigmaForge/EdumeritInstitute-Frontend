"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBlogPost, imageUrl, readingTime } from "./blogApi";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(dateString) ? `${dateString}T00:00:00` : dateString);
  return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

// One blog post. initialPost = build-time copy (may be null for posts published after the build);
// the live version is always fetched from the admin API.
export default function BlogPostView({ slug, initialPost = null }) {
  const [post, setPost] = useState(initialPost);
  const [status, setStatus] = useState(initialPost ? "ready" : "loading");

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    fetchBlogPost(slug)
      .then((p) => { if (alive) { setPost(p); setStatus("ready"); } })
      .catch((err) => {
        if (!alive) return;
        if (err.status === 404) { setPost(null); setStatus("notfound"); }
        else if (!initialPost) setStatus("error");
      });
    return () => { alive = false; };
  }, [slug, initialPost]);

  if (!post) {
    return (
      <article className="blog-post-page">
        <div className="container"><div className="blog-post-wrap">
          {status === "loading" ? (
            <div className="blog-empty"><i className="fas fa-spinner fa-spin"></i> Loading…</div>
          ) : (
            <div className="blog-empty">
              <h3 style={{ color: "var(--navy)", marginBottom: "0.75rem" }}>
                {status === "notfound" ? "This post is not available" : "Could not load this post"}
              </h3>
              <Link href="/blog/" className="detail-back-btn"><i className="fas fa-arrow-left"></i> Back to Blog</Link>
            </div>
          )}
        </div></div>
      </article>
    );
  }

  const cover = imageUrl(post.coverImage);
  return (
    <article className="blog-post-page">
      <div className="container">
        <div className="blog-post-wrap">
          <Link href="/blog/" className="detail-back-btn">
            <i className="fas fa-arrow-left"></i> Back to Blog
          </Link>

          <header className="blog-post-header">
            {post.category && <span className="blog-card-category">{post.category}</span>}
            <h1>{post.title}</h1>
            <div className="blog-post-meta">
              {post.date && <span><i className="far fa-calendar-alt"></i> {formatDate(post.date)}</span>}
              <span><i className="far fa-clock"></i> {readingTime(post)} min read</span>
              <span><i className="fas fa-building"></i> EduMerit Institute</span>
            </div>
          </header>

          {cover && <img className="blog-post-cover" src={cover} alt={post.title} />}

          <div className="blog-post-body">
            {(post.content || []).map((block, i) => {
              if (block.type === "heading") return <h2 key={i}>{block.text}</h2>;
              if (block.type === "list")
                return (
                  <ul key={i}>
                    {(block.items || []).map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                );
              return <p key={i}>{block.text}</p>;
            })}
          </div>

          <div className="blog-post-footer">
            <Link href="/blog/" className="detail-back-btn">
              <i className="fas fa-arrow-left"></i> Back to Blog
            </Link>
            <a
              href="https://wa.me/919211278818?text=Hi%20EduMerit%20Institute,%20I%20have%20a%20question%20about%20this%20update"
              target="_blank"
              rel="noreferrer"
              className="btn-accent"
            >
              <i className="fab fa-whatsapp"></i> Ask a Question
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
