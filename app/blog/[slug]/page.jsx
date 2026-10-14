import { notFound } from "next/navigation";
import BlogPostView from "@/components/BlogPostView";
import { loadPostsForBuild, loadPostForBuild } from "@/components/blogApi";

const SITE_URL = "https://edumerits.in";

// One page per published post (from the admin dashboard → Blog) at build time.
// The page loads the live post from the API in the browser, so edits show without a rebuild.
// Posts published after the last build open via /blog/view/ (firebase.json rewrite) until the next build.
// NOTE: don't add `dynamicParams = false` — it breaks `next dev` with output: "export".
export async function generateStaticParams() {
  const posts = await loadPostsForBuild();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = await loadPostForBuild(params.slug);
  if (!post) return { title: "Blog Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await loadPostForBuild(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: { "@type": "Organization", name: "EduMerit Institute" },
    publisher: {
      "@type": "Organization",
      name: "EduMerit Institute",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/Logo/EdumeritLogo.svg` },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    description: post.excerpt,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostView slug={params.slug} initialPost={post} />
    </>
  );
}
