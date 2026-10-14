// Blog posts from the admin dashboard ("Blog" in edumerit-admin → edumerit_blog_posts).
// Public API: GET /api/blog  and  GET /api/blog/:slug  (published posts only).
// The old hardcoded list in blogPosts.js is only a fallback when the API is unreachable.

import { BLOG_POSTS, getBlogPost } from "./blogPosts";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.edumerits.in";

const getJson = async (url, timeoutMs = 10000) => {
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    const res = await fetch(url, { signal: ctrl?.signal });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      const err = new Error(data.message || `HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  } finally {
    if (t) clearTimeout(t);
  }
};

// Uploaded images are stored as "/uploads/blog/…" on the API server.
export const imageUrl = (u) => (!u ? "" : /^https?:\/\//.test(u) ? u : `${API_BASE}${u}`);

// Link for a post: its pre-built page, or the generic viewer for posts published after the last build.
export const postHref = (slug, builtSlugs) =>
  !builtSlugs || builtSlugs.includes(slug) ? `/blog/${slug}/` : `/blog/view/?slug=${encodeURIComponent(slug)}`;

export async function fetchBlogPosts(timeoutMs) {
  const d = await getJson(`${API_BASE}/api/blog`, timeoutMs);
  return d.posts || [];
}

export async function fetchBlogPost(slug, timeoutMs) {
  const d = await getJson(`${API_BASE}/api/blog/${encodeURIComponent(slug)}`, timeoutMs);
  return d.post;
}

/* ── Build-time helpers (static export) ── */

// Posts list at build time: API when reachable, otherwise the static list.
export async function loadPostsForBuild() {
  try {
    return await fetchBlogPosts(15000);
  } catch (err) {
    console.warn("[blog] API unavailable at build time, using static posts:", err.message);
    return BLOG_POSTS;
  }
}

// One post at build time: API first; static copy only if the API is unreachable.
export async function loadPostForBuild(slug) {
  try {
    return await fetchBlogPost(slug, 15000);
  } catch (err) {
    if (err.status === 404) return null;
    return getBlogPost(slug);
  }
}

export function readingTime(post) {
  const words = (post?.content || [])
    .map((b) => (b.type === "list" ? (b.items || []).join(" ") : b.text || ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}
