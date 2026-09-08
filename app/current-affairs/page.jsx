import CurrentAffairsSection from "@/components/CurrentAffairsSection";

export const metadata = {
  title: "Current Affairs — Daily, Weekly & Monthly Updates",
  description:
    "Daily, weekly and monthly current affairs updates for Bank, SSC and other competitive exam preparation, from EduMerit Institute, Greater Noida.",
  alternates: { canonical: "/current-affairs" },
  openGraph: { title: "Current Affairs | EduMerit Institute", description: "Daily, weekly and monthly current affairs for competitive exam preparation.", url: "/current-affairs" },
};

export default function CurrentAffairsPage() {
  return (
    <>
      <style>{`
        .affair-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .affair-card:hover { transform: translateY(-5px); box-shadow: 0 20px 35px -12px rgba(0,0,0,0.15); }
        .affair-video-container { margin: 20px 0; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .affair-video-container iframe { width: 100%; height: 220px; display: block; border: none; }
        .affair-youtube { display: inline-flex; align-items: center; gap: 10px; background: #ff0000; color: white; padding: 8px 18px; border-radius: 40px; text-decoration: none; font-weight: 600; font-size: 0.85rem; margin-top: 15px; transition: all 0.2s ease; }
        .affair-youtube:hover { background: #cc0000; color: white; }
        .affair-content-preview { margin-top: 12px; line-height: 1.6; color: #334155; font-size: 0.95rem; }
        .loading-card, .error-card { text-align: center; padding: 3rem; background: white; border-radius: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); grid-column: 1 / -1; }
        .spinner { width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top-color: #2b4f8c; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .api-badge { background: #10b981; color: white; font-size: 0.7rem; padding: 3px 10px; border-radius: 20px; margin-left: 10px; vertical-align: middle; }
        .affairs-count-badge { background: #e2e8f0; color: #475569; font-size: 0.8rem; padding: 4px 12px; border-radius: 20px; font-weight: 600; margin-left: 8px; }
        .affairs-section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
        .affairs-section-header h2 { display: flex; align-items: center; gap: 0.75rem; margin: 0; }
        .btn-full-content { display: inline-flex; align-items: center; gap: 6px; background: #0a1f44; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; border: none; cursor: pointer; }
        .btn-full-content:hover { background: #1a3a6e; color: white; transform: translateY(-1px); }
        @media (max-width: 768px) { .affair-video-container iframe { height: 200px; } }

        /* Daily/Weekly/Monthly Quiz CTA row, above the quiz panel / affairs list */
        .ca-quiz-cta-section { padding: 1.5rem 0 0; }
        .ca-quiz-cta-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .hero-stat-pill.hero-quiz-cta {
            background: #ff6b35; border-color: #ff6b35; color: #fff; text-decoration: none; cursor: pointer;
            font-weight: 700; font-family: inherit; outline: none; border: none;
            padding: 10px 20px; border-radius: 30px; display: inline-flex; align-items: center; gap: 8px;
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .hero-stat-pill.hero-quiz-cta:hover { background: #e85a2a; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 18px rgba(255, 107, 53, 0.35); }
        .hero-stat-pill.hero-quiz-cta i { color: #fff; }
        .hero-quiz-cta.active { background: #0a1f44; border-color: #0a1f44; box-shadow: 0 8px 18px rgba(10, 31, 68, 0.35); }

        /* Current Affairs Quiz panel */
        .ca-quiz-section { padding: 1.5rem 0 0.5rem; }
        .ca-quiz-panel { background: #fff; border-radius: 1.25rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); padding: 1.75rem; border: 1px solid #eef1f5; }
        .ca-quiz-panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .ca-quiz-panel-header h2 { display: flex; align-items: center; gap: 0.6rem; margin: 0; color: #0a1f44; font-size: 1.35rem; }
        .ca-quiz-meta { margin-top: 6px; color: #64748b; font-size: 0.9rem; }
        .ca-quiz-meta span.dot { margin: 0 8px; }
        .ca-quiz-close { background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; color: #475569; font-size: 0.95rem; flex-shrink: 0; }
        .ca-quiz-close:hover { background: #e2e8f0; }
        .ca-quiz-score-bar { margin-top: 1rem; padding: 12px 16px; background: #eafaf0; border: 1px solid #28a745; border-radius: 10px; color: #1a7431; font-weight: 600; }

        .ca-quiz-list-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        @media (max-width: 760px) { .ca-quiz-list-grid { grid-template-columns: 1fr; } }
        .ca-quiz-card { display: flex; gap: 1.1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.1rem; }
        .ca-quiz-card-icon { flex-shrink: 0; width: 96px; height: 84px; border-radius: 12px; background: #ddeeff; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #4a90e2; }
        .ca-quiz-card-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
        .ca-quiz-card-title { font-size: 1.05rem; font-weight: 700; color: #0f172a; }
        .ca-quiz-card-meta-row { display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.85rem; color: #475569; }
        .ca-quiz-card-meta-row span { display: inline-flex; align-items: center; gap: 6px; }
        .ca-quiz-card-meta-row i { color: #4a90e2; width: 14px; text-align: center; }
        .ca-quiz-card-footer { display: flex; justify-content: flex-end; margin-top: 4px; }
        .ca-quiz-attempt-btn { background: #4a90e2; color: #fff; border: none; padding: 9px 22px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; }
        .ca-quiz-attempt-btn:hover { background: #3a7bc8; }
        .ca-quiz-back-btn { background: none; border: 1px solid #cbd5e1; color: #334155; padding: 7px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; margin-bottom: 1rem; display: inline-flex; align-items: center; gap: 6px; }
        .ca-quiz-back-btn:hover { background: #f1f5f9; }
        @media (max-width: 480px) { .ca-quiz-card { flex-direction: column; } .ca-quiz-card-icon { width: 100%; height: 70px; } }

        .ca-quiz-attempt-layout { display: flex; gap: 1.5rem; align-items: flex-start; }
        .ca-quiz-attempt-main { flex: 1; min-width: 0; }
        .ca-quiz-progress-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
        .ca-quiz-progress { font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 0; }
        .ca-quiz-timer { display: inline-flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.05rem; color: #222; padding: 6px 14px; border-radius: 10px; background: #fff3cd; border: 1.5px solid #ffc107; }
        .ca-quiz-timer.low { background: #f8d7da; border-color: #dc3545; color: #a71d2a; animation: ca-quiz-pulse 1s infinite; }
        @keyframes ca-quiz-pulse { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
        .qb-card.locked .qb-opt { pointer-events: none; opacity: .7; }
        .ca-quiz-nav-row { display: flex; justify-content: space-between; align-items: center; margin-top: 1.1rem; gap: 10px; flex-wrap: wrap; }
        .ca-quiz-nav-btn { background: #fff; border: 1.5px solid #cbd5e1; color: #334155; padding: 9px 20px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
        .ca-quiz-nav-btn:hover:not(:disabled) { background: #f1f5f9; }
        .ca-quiz-nav-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .ca-quiz-finish-btn { background: #28a745; color: #fff; border: none; padding: 9px 22px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
        .ca-quiz-finish-btn:hover { background: #218838; }
        .ca-quiz-palette-panel { flex-shrink: 0; width: 220px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; }
        .ca-quiz-palette-title { font-size: 0.78rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 10px; }
        .ca-quiz-palette-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .ca-quiz-palette-btn { width: 36px; height: 36px; border-radius: 8px; border: 1.5px solid #cbd5e1; background: #fff; color: #334155; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
        .ca-quiz-palette-btn:hover { border-color: #4a90e2; }
        .ca-quiz-palette-btn.answered { background: #4a90e2; border-color: #4a90e2; color: #fff; }
        .ca-quiz-palette-btn.current { box-shadow: 0 0 0 2px rgba(10,31,68,0.35); border-color: #0a1f44; }
        .ca-quiz-palette-legend { margin-top: 12px; font-size: 0.75rem; color: #64748b; display: flex; flex-direction: column; gap: 6px; }
        .ca-quiz-palette-legend span { display: inline-flex; align-items: center; gap: 6px; }
        .ca-quiz-palette-swatch { width: 14px; height: 14px; border-radius: 4px; display: inline-block; border: 1.5px solid #cbd5e1; background: #fff; }
        .ca-quiz-palette-swatch.answered { background: #4a90e2; border-color: #4a90e2; }
        @media (max-width: 760px) {
            .ca-quiz-attempt-layout { flex-direction: column; }
            .ca-quiz-palette-panel { width: 100%; }
            .ca-quiz-palette-grid { grid-template-columns: repeat(8, 1fr); }
        }

        .qb-opt.wrong-selected { background: #fdecea; border: 1.5px solid #dc3545; }

        .ca-contact-modal { display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.55); z-index: 1000; align-items: center; justify-content: center; padding: 1rem; }
        .ca-contact-modal.open { display: flex; }
        .ca-contact-modal-box { background: #fff; border-radius: 16px; padding: 1.75rem; max-width: 420px; width: 100%; box-shadow: 0 20px 45px rgba(0,0,0,0.25); }
        .ca-contact-modal-box h3 { margin: 0 0 6px; color: #0a1f44; display: flex; align-items: center; gap: 8px; }
        .ca-contact-modal-box p { margin: 0 0 1.1rem; color: #64748b; font-size: 0.9rem; }
        .ca-contact-modal-box label { display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px; margin-top: 14px; }
        .ca-contact-modal-box input { width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; font-family: inherit; }
        .ca-contact-modal-box input.invalid { border-color: #dc3545; }
        .ca-contact-err { display: none; color: #dc3545; font-size: 0.78rem; margin-top: 5px; }
        .ca-contact-err.show { display: block; }
        .ca-contact-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.4rem; }

        /* Results screen: current result (left) + this user's attempt history (right) */
        .ca-quiz-review-layout { display: flex; gap: 1.5rem; align-items: flex-start; }
        .ca-quiz-review-main { flex: 1; min-width: 0; }
        .ca-quiz-history-panel { flex-shrink: 0; width: 300px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.1rem; position: sticky; top: 90px; }
        .ca-quiz-history-title { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; font-weight: 700; color: #0a1f44; margin-bottom: 12px; }
        .ca-quiz-history-title i { color: #4a90e2; }
        .ca-quiz-history-loading, .ca-quiz-history-empty { color: #64748b; font-size: 0.85rem; }
        .ca-quiz-history-summary { display: flex; justify-content: space-between; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 6px; margin-bottom: 12px; }
        .ca-quiz-history-summary > div { display: flex; flex-direction: column; align-items: center; flex: 1; }
        .ca-quiz-history-summary-value { font-size: 1.05rem; font-weight: 800; color: #0a1f44; }
        .ca-quiz-history-summary-label { font-size: 0.7rem; color: #64748b; margin-top: 2px; }
        .ca-quiz-history-list { display: flex; flex-direction: column; gap: 8px; max-height: 420px; overflow-y: auto; }
        .ca-quiz-history-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; font-size: 0.82rem; }
        .ca-quiz-history-row.current { border-color: #4a90e2; background: #eaf2fe; }
        .ca-quiz-history-row-main { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ca-quiz-history-row-date { color: #475569; font-weight: 600; }
        .ca-quiz-history-row-score { color: #0f172a; font-weight: 700; }
        .ca-quiz-history-row-pct { color: #64748b; font-weight: 600; }
        .ca-quiz-history-delta { flex-shrink: 0; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
        .ca-quiz-history-delta.up { color: #28a745; }
        .ca-quiz-history-delta.down { color: #dc3545; }
        @media (max-width: 860px) {
            .ca-quiz-review-layout { flex-direction: column; }
            .ca-quiz-history-panel { width: 100%; position: static; }
        }

        .ca-quiz-leaderboard { max-width: 560px; background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 20px; margin: 1rem 0; }
        .ca-quiz-leaderboard-title { display: flex; align-items: center; gap: 8px; font-size: 1.05rem; font-weight: 700; color: #0a1f44; margin-bottom: 14px; }
        .ca-quiz-leaderboard-title i { color: #f0a500; }
        .ca-quiz-lb-loading, .ca-quiz-lb-empty { color: #6c757d; font-size: 0.9rem; }
        .ca-quiz-lb-row { display: grid; grid-template-columns: 40px 1fr auto auto; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 0.88rem; }
        .ca-quiz-lb-row:nth-child(even) { background: #f8f9fa; }
        .ca-quiz-lb-row.mine { background: #e8f0fe; border: 1.5px solid #4a90e2; font-weight: 700; }
        .ca-quiz-lb-rank { font-weight: 700; text-align: center; }
        .ca-quiz-lb-name { color: #333; overflow-wrap: anywhere; }
        .ca-quiz-lb-score { color: #555; font-weight: 600; white-space: nowrap; }
        .ca-quiz-lb-pct { color: #28a745; font-weight: 700; white-space: nowrap; }

        /* Daily quiz block embedded in each affair card ("Test Yourself") */
        .affair-quiz-section { margin-top: 18px; padding-top: 16px; border-top: 1px dashed #cbd5e1; }
        .affair-quiz-section-title { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; font-weight: 700; color: #0a1f44; margin-bottom: 12px; }
        .affair-quiz-section-title .qcount { font-size: 0.75rem; font-weight: 600; color: #4a90e2; background: #eef3fb; padding: 2px 10px; border-radius: 20px; }
        .qb-card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.25rem; margin-bottom: 14px; }
        .qb-card:last-child { margin-bottom: 0; }
        .qb-head { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
        .qb-num { font-weight: 700; color: #222; }
        .qb-q { font-weight: 600; color: #222; flex: 1 1 100%; margin-top: 0.25rem; }
        .qb-badge { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; }
        .qb-badge.easy { background: #28a745; color: #fff; }
        .qb-badge.medium { background: #e6a817; color: #222; }
        .qb-badge.hard { background: #dc3545; color: #fff; }
        .qb-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem; }
        @media (max-width: 560px) { .qb-options { grid-template-columns: 1fr; } }
        .qb-opt { display: flex; align-items: center; gap: 0.5rem; padding: 8px 12px; border-radius: 8px; font-size: 0.9rem; background: #f8f9fa; border: 1px solid #dee2e6; cursor: pointer; transition: background .15s, border-color .15s; }
        .qb-opt:hover { background: #eef3fb; }
        .qb-opt.selected { background: #e8f0fe; border: 1.5px solid #4a90e2; }
        .qb-opt.selected .qb-letter { background: #4a90e2; color: #fff; }
        .qb-letter { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; background: #dee2e6; color: #555; }
        .qb-opt .qb-check { display: none; margin-left: auto; }
        .qb-answer { display: none; margin-top: 1rem; }
        .qb-card.revealed .qb-answer { display: block; }
        .qb-card.revealed .qb-opt.correct { background: #d4edda; border: 1.5px solid #28a745; }
        .qb-card.revealed .qb-opt.correct .qb-letter { background: #28a745; color: #fff; }
        .qb-card.revealed .qb-opt.correct .qb-check { display: inline; color: #28a745; }
        .qb-reveal-btn { padding: 9px 20px; border: none; border-radius: 8px; background: #4a90e2; color: #fff; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
        .qb-reveal-btn:hover { background: #3a7bc8; }
        .qb-expl { padding: 10px 14px; background: #e8f4f8; border-left: 4px solid #4a90e2; border-radius: 6px; font-size: 0.88rem; }
      `}</style>

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-breadcrumb">
            <a href="/">
              <i className="fas fa-home"></i> Home
            </a>
            <i className="fas fa-chevron-right"></i>
            <span>Current Affairs</span>
          </div>
          <div className="page-hero-body">
            <div className="page-hero-icon">
              <i className="fas fa-newspaper"></i>
            </div>
            <div>
              <h1>Current Affairs</h1>
              <p>Stay updated with daily, weekly &amp; monthly current affairs for all competitive exams</p>
            </div>
          </div>
          <div className="page-hero-stats">
            <span className="hero-stat-pill">
              <i className="fas fa-calendar-day"></i> Daily Updates
            </span>
            <span className="hero-stat-pill">
              <i className="fas fa-calendar-week"></i> Weekly Digest
            </span>
            <span className="hero-stat-pill">
              <i className="fas fa-calendar-alt"></i> Monthly Compilation
            </span>
            <span className="hero-stat-pill">
              <i className="fas fa-download"></i> Free PDF Downloads
            </span>
          </div>
        </div>
      </section>

      <CurrentAffairsSection />
    </>
  );
}
