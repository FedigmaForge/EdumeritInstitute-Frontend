"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { fetchBlogPosts, postHref } from "./blogApi";

// Blog grid that starts from the build-time list and refreshes from the admin API.
// limit: show only the newest N (home page). empty: what to render when there are no posts.
export default function BlogList({ initialPosts = [], builtSlugs, limit, className = "blog-grid", empty = null }) {
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    let alive = true;
    fetchBlogPosts()
      .then((live) => { if (alive) setPosts(live); })
      .catch(() => { /* keep build-time posts */ });
    return () => { alive = false; };
  }, []);

  const list = limit ? posts.slice(0, limit) : posts;
  if (list.length === 0) return empty;
  return (
    <div className={className}>
      {list.map((post) => (
        <BlogCard post={post} key={post.slug} href={postHref(post.slug, builtSlugs)} />
      ))}
    </div>
  );
}
