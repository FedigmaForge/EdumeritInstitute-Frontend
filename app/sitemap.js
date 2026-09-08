import { BLOG_POSTS } from "@/components/blogPosts";

const SITE_URL = "https://edumerits.in";

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/about-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/bank-exams", priority: 0.9, changeFrequency: "weekly" },
  { path: "/ssc-exams", priority: 0.9, changeFrequency: "weekly" },
  { path: "/current-affairs", priority: 0.9, changeFrequency: "daily" },
  { path: "/daily-headlines", priority: 0.8, changeFrequency: "daily" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/quiz", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
];

async function getCurrentAffairEntries() {
  try {
    const res = await fetch("https://api.edumerits.in/api/admin/current-affairs");
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.success || !Array.isArray(data.affairs)) return [];

    return data.affairs
      .filter((a) => a?.id)
      .map((a) => ({
        url: `${SITE_URL}/current-affairs/${a.id}`,
        lastModified: a.updated_at || a.date || a.created_at || undefined,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const affairEntries = await getCurrentAffairEntries();

  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...affairEntries, ...blogEntries];
}
