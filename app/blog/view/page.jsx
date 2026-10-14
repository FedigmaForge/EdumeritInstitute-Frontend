import { Suspense } from "react";
import BlogPostViewer from "@/components/BlogPostViewer";

// Fallback for posts published in the admin dashboard after the last build.
// firebase.json rewrites /blog/<slug>/ here when no pre-built page exists; also works as /blog/view/?slug=…
export const metadata = { title: "Blog", robots: { index: false } };

export default function BlogViewPage() {
  return (
    <Suspense fallback={<div className="blog-empty" style={{ marginTop: 120 }}><i className="fas fa-spinner fa-spin"></i> Loading…</div>}>
      <BlogPostViewer />
    </Suspense>
  );
}
