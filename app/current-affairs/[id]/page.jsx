import Link from "next/link";
import CurrentAffairDetail from "@/components/CurrentAffairDetail";

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateStaticParams() {
  try {
    const res = await fetch("https://api.edumerits.in/api/admin/current-affairs");
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.success || !Array.isArray(data.affairs)) return [];
    return data.affairs.map((affair) => ({ id: String(affair.id) }));
  } catch {
    return [];
  }
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`https://api.edumerits.in/api/admin/current-affairs/${params.id}`);
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    if (!data?.success || !data.affair) throw new Error("invalid");

    const title = data.affair.title || "Current Affair";
    const description = stripHtml(data.affair.content).slice(0, 155) || "Current affairs update for competitive exam preparation from EduMerit Institute.";

    return {
      title,
      description,
      alternates: { canonical: `/current-affairs/${params.id}` },
      openGraph: { title, description, url: `/current-affairs/${params.id}`, type: "article" },
    };
  } catch {
    return {
      title: "Current Affair Detail",
      description: "Current affairs update for competitive exam preparation from EduMerit Institute, Greater Noida.",
      alternates: { canonical: `/current-affairs/${params.id}` },
    };
  }
}

export default function CurrentAffairDetailPage({ params }) {
  return (
    <>
      <style>{`
        .detail-wrapper { max-width: 860px; margin: 0 auto; padding: 2rem 20px 4rem; }
        .detail-back-btn { display: inline-flex; align-items: center; gap: 8px; color: #0a1f44; text-decoration: none; font-weight: 600; font-size: 0.95rem; margin-bottom: 1.5rem; padding: 8px 16px; border: 2px solid #0a1f44; border-radius: 30px; transition: all 0.2s; }
        .detail-back-btn:hover { background: #0a1f44; color: white; }
        .detail-card { background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(10,31,68,0.1); padding: 2.5rem; border: 1px solid #e2e8f0; }
        .detail-date-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 1rem; }
        .detail-date { background: #0a1f44; color: white; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
        .detail-title { font-size: 1.6rem; color: #0a1f44; font-weight: 700; margin-bottom: 1.5rem; line-height: 1.4; }
        .detail-video-container { margin: 1.5rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.12); background: #000; }
        .detail-video-container iframe { width: 100%; height: 420px; display: block; border: none; }
        .detail-content { margin-top: 1.5rem; line-height: 1.8; color: #334155; font-size: 1rem; }
        .detail-content h1, .detail-content h2, .detail-content h3, .detail-content h4 { color: #0a1f44; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 700; }
        .detail-content h1 { font-size: 1.4rem; }
        .detail-content h2 { font-size: 1.3rem; }
        .detail-content h3 { font-size: 1.15rem; }
        .detail-content h4 { font-size: 1rem; }
        .detail-content p { margin-bottom: 0.9rem; }
        .detail-content ul, .detail-content ol { margin: 0.5rem 0 1rem 1.5rem; }
        .detail-content li { margin: 0.4rem 0; }
        .detail-content table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.9rem; overflow-x: auto; display: block; }
        .detail-content td, .detail-content th { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
        .detail-content th { background: #f1f5f9; font-weight: 600; color: #0a1f44; }
        .detail-content tr:hover td { background: #f8fafc; }
        .detail-content hr { margin: 1.5rem 0; border: 0; height: 2px; background: linear-gradient(90deg, #e2e8f0, #94a3b8, #e2e8f0); }
        .detail-content b, .detail-content strong { color: #0a1f44; }
        .detail-content blockquote { border-left: 4px solid #0a1f44; padding: 0.75rem 1rem; background: #f0f4ff; border-radius: 0 8px 8px 0; margin: 1rem 0; font-style: italic; }
        .detail-footer-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #e2e8f0; }
        .loading-state, .error-state { text-align: center; padding: 4rem 2rem; }
        .spinner { width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top-color: #0a1f44; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .detail-card { padding: 1.5rem; }
          .detail-title { font-size: 1.3rem; }
          .detail-video-container iframe { height: 240px; }
          .detail-content { font-size: 0.95rem; }
        }
      `}</style>

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-breadcrumb">
            <a href="/">
              <i className="fas fa-home"></i> Home
            </a>
            <i className="fas fa-chevron-right"></i>
            <Link href="/current-affairs">Current Affairs</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Detail</span>
          </div>
          <div className="page-hero-body">
            <div className="page-hero-icon">
              <i className="fas fa-book-open"></i>
            </div>
            <div>
              <h1>Current Affair Detail</h1>
              <p>Full detailed coverage for your exam preparation</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "2.5rem 0" }}>
        <div className="container">
          <div className="detail-wrapper">
            <Link href="/current-affairs" className="detail-back-btn">
              <i className="fas fa-arrow-left"></i> Back to Current Affairs
            </Link>

            <CurrentAffairDetail id={params.id} />
          </div>
        </div>
      </section>
    </>
  );
}
