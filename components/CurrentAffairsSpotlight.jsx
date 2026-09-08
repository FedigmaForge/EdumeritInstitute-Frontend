import Link from "next/link";
import CurrentAffairsScroller from "./CurrentAffairsScroller";

const API_URL = "https://api.edumerits.in/api/admin/current-affairs";
const LATEST_COUNT = 12;

async function getLatestAffairs() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.success || !Array.isArray(data.affairs)) return [];

    return [...data.affairs]
      .filter((a) => a?.id)
      .sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0))
      .slice(0, LATEST_COUNT);
  } catch {
    return [];
  }
}

export default async function CurrentAffairsSpotlight() {
  const affairs = await getLatestAffairs();
  if (affairs.length === 0) return null;

  return (
    <section className="ca-spotlight">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Stay Exam-Ready</span>
          <h2>Latest Current Affairs Uploads</h2>
          <div className="divider"></div>
        </div>
      </div>

      <CurrentAffairsScroller affairs={affairs} />

      <div className="container">
        <div className="ca-spotlight-footer">
          <Link href="/current-affairs" className="btn-outline">
            <i className="fas fa-play-circle"></i> Watch More Current Affairs Videos
          </Link>
        </div>
      </div>
    </section>
  );
}
