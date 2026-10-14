"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BlogPostView from "./BlogPostView";

// Reads the slug from ?slug= or from the real URL (/blog/<slug>/ rewritten here by Firebase Hosting).
export default function BlogPostViewer() {
  const params = useSearchParams();
  const [slug, setSlug] = useState(undefined);

  useEffect(() => {
    let s = params.get("slug");
    if (!s) {
      const parts = window.location.pathname.split("/").filter(Boolean); // ["blog", slug]
      if (parts[0] === "blog" && parts[1] && parts[1] !== "view") s = decodeURIComponent(parts[1]);
    }
    setSlug(s || null);
  }, [params]);

  if (slug === undefined) return <div className="blog-empty" style={{ marginTop: 120 }}><i className="fas fa-spinner fa-spin"></i> Loading…</div>;
  return <BlogPostView key={slug || "none"} slug={slug} initialPost={null} />;
}
