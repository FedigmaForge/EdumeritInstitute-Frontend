import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/components/blogPosts";

const SITE_URL = "https://edumerits.in";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = getBlogPost(params.slug);
  if (!post) {
    return { title: "Blog Post Not Found" };
  }

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

function readingTime(post) {
  const words = post.content
    .map((b) => (b.type === "list" ? b.items.join(" ") : b.text))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

export default function BlogPostPage({ params }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
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

      <article className="blog-post-page">
        <div className="container">
          <div className="blog-post-wrap">
            <Link href="/blog" className="detail-back-btn">
              <i className="fas fa-arrow-left"></i> Back to Blog
            </Link>

            <header className="blog-post-header">
              <span className="blog-card-category">{post.category}</span>
              <h1>{post.title}</h1>
              <div className="blog-post-meta">
                <span>
                  <i className="far fa-calendar-alt"></i> {formatDate(post.date)}
                </span>
                <span>
                  <i className="far fa-clock"></i> {readingTime(post)} min read
                </span>
                <span>
                  <i className="fas fa-building"></i> EduMerit Institute
                </span>
              </div>
            </header>

            <div className="blog-post-body">
              {post.content.map((block, i) => {
                if (block.type === "heading") return <h2 key={i}>{block.text}</h2>;
                if (block.type === "list")
                  return (
                    <ul key={i}>
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  );
                return <p key={i}>{block.text}</p>;
              })}
            </div>

            <div className="blog-post-footer">
              <Link href="/blog" className="detail-back-btn">
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
    </>
  );
}
