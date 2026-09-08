import DailyHeadlines from "@/components/DailyHeadlines";

export const metadata = {
  title: "Daily Headlines — Quick Current Affairs Roundup",
  description:
    "Quick daily headline roundups covering national and international news relevant to Bank and SSC exam preparation, from EduMerit Institute, Greater Noida.",
  alternates: { canonical: "/daily-headlines" },
  openGraph: { title: "Daily Headlines | EduMerit Institute", description: "Quick daily headline roundups for competitive exam preparation.", url: "/daily-headlines" },
};

export default function DailyHeadlinesPage() {
  return (
    <>
      <style>{`
        .hl-wrap { max-width: 1000px; margin: 0 auto; }
        .hl-banner { background: #0b5ca8; color: #fff; padding: 22px 28px; border-radius: 8px; margin-bottom: 24px; }
        .hl-banner h2 { margin: 0; font-size: 2rem; font-weight: 800; color: #fff; }
        .hl-toolbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:1.25rem; }
        .hl-toolbar select { margin-left:.5rem; padding:.45rem .75rem; border-radius:8px; border:1px solid #ddd; font-size:.95rem; }
        .hl-card { margin-bottom: 26px; }
        .hl-head { background: #eaf3fb; border: 1px solid #cfe2f5; border-radius: 10px; padding: 16px 22px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none; transition: background .15s; }
        .hl-head:hover { background: #dceafb; }
        .hl-head-title { color: #0b5ca8; font-weight: 700; font-size: 1.2rem; }
        .hl-chevron { color: #0b5ca8; font-size: 1rem; transition: transform .2s; }
        .hl-card.open .hl-chevron { transform: rotate(180deg); }
        .hl-box { border: 1px solid #d7dde3; border-radius: 10px; background: #fff; margin: -2px 28px 0 14px; padding: 16px 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
        .hl-preview { color: #222; font-size: 1rem; }
        .hl-full { display: none; }
        .hl-card.open .hl-full { display: block; }
        .hl-list { margin: 0; padding-left: 0; list-style: none; }
        .hl-list li { position: relative; padding: 11px 0 11px 28px; font-size: 1rem; line-height: 1.55; border-bottom: 1px solid #f0f0f0; color: #222; }
        .hl-list li:last-child { border-bottom: none; }
        .hl-list li::before { content: "\\f0a4"; font-family: "Font Awesome 6 Free"; font-weight: 900; position: absolute; left: 0; top: 12px; color: #0b5ca8; font-size: .8rem; }
        .hl-video { margin-top: 16px; width: 300px; max-width: 100%; aspect-ratio: 9/16; max-height: 460px; background:#000; border-radius:10px; overflow:hidden; }
        .hl-video iframe { width:100%; height:100%; border:0; display:block; }
        .hl-watch { display:inline-flex; align-items:center; gap:6px; margin-top:14px; padding:8px 16px; background:#fff5f5; border:1.5px solid #ff0000; color:#cc0000; border-radius:8px; text-decoration:none; font-size:.9rem; font-weight:600; }
        .hl-state { text-align:center; padding:60px 20px; color:#6c757d; }
        .hl-state i { font-size:48px; margin-bottom:12px; display:block; }
        @media (max-width:640px){ .hl-box { margin: -2px 8px 0 8px; } .hl-video { width:100%; aspect-ratio:16/9; } }
      `}</style>

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-breadcrumb">
            <a href="/">
              <i className="fas fa-home"></i> Home
            </a>
            <i className="fas fa-chevron-right"></i>
            <span>Daily Headlines</span>
          </div>
        </div>
      </section>

      <section className="course-detail-section">
        <div className="container">
          <DailyHeadlines />
        </div>
      </section>
    </>
  );
}
