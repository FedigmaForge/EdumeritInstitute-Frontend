import { Suspense } from "react";
import QuizBank from "@/components/QuizBank";

export const metadata = {
  title: "Free Quiz — Timed Sectional Practice Sets",
  description:
    "Free timed practice sets for Quantitative Aptitude, Reasoning, English and General Awareness — sectional-exam style, with a leaderboard, for Bank and SSC exam preparation.",
  alternates: { canonical: "/quiz" },
  openGraph: { title: "Free Quiz | EduMerit Institute", description: "Timed practice sets with a leaderboard for Bank and SSC exam preparation.", url: "/quiz" },
};

export default function QuizPage() {
  return (
    <>
      <style>{`
        .qb-tile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.1rem; }
        .qb-tile { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 1.4rem 1.2rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: transform .15s, box-shadow .15s, border-color .15s; display: flex; flex-direction: column; gap: 0.6rem; }
        .qb-tile:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(74,144,226,0.18); border-color: #4a90e2; }
        .qb-tile-icon { font-size: 1.8rem; color: #4a90e2; }
        .qb-tile-name { font-size: 1.05rem; font-weight: 700; color: #1a2b4a; }
        .qb-tile-count { font-size: 0.82rem; font-weight: 600; color: #6c757d; }
        .qb-tile-subjects { display: flex; flex-wrap: wrap; gap: 6px; }
        .qb-tile-subject-tag { padding: 2px 9px; border-radius: 20px; font-size: 10.5px; font-weight: 600; background: #e8f0fe; color: #1a56db; }
        .qb-tile-duration { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: #8a6300; background: #fff3cd; padding: 3px 10px; border-radius: 20px; width: fit-content; }
        .qb-tile-duration.untimed { color: #6c757d; background: #e9ecef; }

        .qb-card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.5rem; margin-bottom: 1.1rem; }
        .qb-head { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
        .qb-num { font-weight: 700; color: #222; }
        .qb-q { font-weight: 600; color: #222; flex: 1 1 100%; margin-top: 0.25rem; }
        .qb-badge { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; }
        .qb-badge.easy   { background:#28a745; color:#fff; }
        .qb-badge.medium { background:#e6a817; color:#222; }
        .qb-badge.hard   { background:#dc3545; color:#fff; }
        .qb-tag { padding: 2px 10px; border-radius: 20px; font-size: 11px; background:#e8f0fe; color:#1a56db; }
        .qb-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0; }
        @media (max-width: 560px){ .qb-options { grid-template-columns: 1fr; } }
        .qb-opt { display: flex; align-items: center; gap: 0.5rem; padding: 8px 12px; border-radius: 8px; font-size: 0.9rem; background: #f8f9fa; border: 1px solid #dee2e6; cursor: pointer; transition: background .15s, border-color .15s; }
        .qb-opt:hover { background: #eef3fb; }
        .qb-opt.selected { background: #e8f0fe; border: 1.5px solid #4a90e2; }
        .qb-opt.selected .qb-letter { background: #4a90e2; color: #fff; }
        .qb-letter { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; background:#dee2e6; color:#555; }
        .qb-opt .qb-check { display: none; margin-left: auto; }
        .qb-card.revealed .qb-opt.correct { background:#d4edda; border:1.5px solid #28a745; }
        .qb-card.revealed .qb-opt.correct .qb-letter { background:#28a745; color:#fff; }
        .qb-card.revealed .qb-opt.correct .qb-check { display: inline; color:#28a745; }
        .qb-card.revealed .qb-opt.wrong-pick { background:#f8d7da; border:1.5px solid #dc3545; }
        .qb-card.locked .qb-opt { pointer-events: none; opacity: .75; }
        .qb-expl { padding: 10px 14px; background:#e8f4f8; border-left:4px solid #4a90e2; border-radius: 6px; font-size: 0.88rem; margin-top: 1rem; }
        .qb-state { text-align: center; padding: 60px 20px; color: #6c757d; }
        .qb-state i { font-size: 48px; margin-bottom: 12px; display: block; }

        .fq-runner-bar { position: sticky; top: 0; z-index: 20; background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 14px 18px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 1.25rem; box-shadow: 0 2px 10px rgba(0,0,0,0.07); }
        .fq-runner-title { font-weight: 700; color: #1a2b4a; font-size: 1rem; }
        .fq-runner-sub { font-size: 0.8rem; color: #6c757d; margin-top: 2px; }
        .fq-sections { display: flex; gap: 6px; flex-wrap: wrap; }
        .fq-section-pill { padding: 3px 11px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #e9ecef; color: #6c757d; }
        .fq-section-pill.done { background: #d4edda; color: #1e7e34; }
        .fq-section-pill.active { background: #4a90e2; color: #fff; }
        .fq-timer { display: inline-flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.15rem; color: #222; padding: 8px 16px; border-radius: 10px; background: #fff3cd; border: 1.5px solid #ffc107; }
        .fq-timer.low { background: #f8d7da; border-color: #dc3545; color: #a71d2a; animation: fq-pulse 1s infinite; }
        .fq-timer.untimed { background: #e9ecef; border-color: #ced4da; color: #6c757d; }
        @keyframes fq-pulse { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
        .fq-runner-actions { display: flex; gap: 10px; }
        .fq-btn { padding: 10px 20px; border: none; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
        .fq-btn-next { background: #4a90e2; color: #fff; }
        .fq-btn-next:hover { background: #3a7bc8; }
        .fq-btn-finish { background: #28a745; color: #fff; }
        .fq-btn-finish:hover { background: #218838; }
        .fq-toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); background: #222; color: #fff; padding: 12px 22px; border-radius: 10px; font-weight: 600; font-size: 0.9rem; z-index: 200; box-shadow: 0 6px 20px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 8px; }

        .qb-result { text-align: center; padding: 32px 24px; background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin-bottom: 24px; max-width: 520px; margin-left: auto; margin-right: auto; }
        .qb-result-icon { font-size: 46px; color: #28a745; margin-bottom: 8px; }
        .qb-result-score { font-size: 2.1rem; font-weight: 800; color: #222; }
        .qb-result-pct { font-size: 1.05rem; font-weight: 700; color: #4a90e2; margin-top: 2px; }
        .qb-result p { color: #6c757d; margin: 12px 0 0; font-size: 0.9rem; }
        .fq-breakdown { max-width: 520px; margin: 0 auto 1.5rem; background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 18px 20px; }
        .fq-breakdown-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-size: 0.9rem; }
        .fq-breakdown-row:last-child { border-bottom: none; }
        .fq-breakdown-subject { font-weight: 700; color: #1a2b4a; }
        .fq-breakdown-score { font-weight: 700; color: #28a745; }
        .fq-result-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem; }

        .qb-modal-overlay { display: none; position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; padding: 1rem; }
        .qb-modal-overlay.open { display: flex; }
        .qb-modal { background: #fff; border-radius: 14px; padding: 28px; width: 100%; max-width: 420px; box-shadow: 0 10px 40px rgba(0,0,0,0.25); }
        .qb-modal h3 { margin: 0 0 4px; color: #222; }
        .qb-modal p.sub { color: #6c757d; font-size: 0.88rem; margin: 0 0 1.25rem; }
        .qb-field { margin-bottom: 1rem; }
        .qb-field label { display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px; color: #333; }
        .qb-field input { width: 100%; padding: 10px 12px; border: 1px solid #ced4da; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; }
        .qb-field input.invalid { border-color: #dc3545; }
        .qb-field .err { color: #dc3545; font-size: 0.78rem; margin-top: 4px; display: none; }
        .qb-field .err.show { display: block; }
        .qb-modal-actions { display: flex; gap: 10px; margin-top: 1.25rem; }
        .qb-modal-actions button { flex: 1; padding: 11px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.95rem; }
        .qb-btn-cancel { background: #e9ecef; color: #333; }
        .qb-btn-confirm { background: #28a745; color: #fff; }
        .qb-btn-confirm:disabled { opacity: .65; cursor: default; }

        /* Results screen: every results card (score, section-wise, leaderboard, your attempts)
           sits in a horizontal row instead of stacked full-width blocks. */
        .qb-results-cards-row { display: flex; gap: 1.25rem; align-items: flex-start; flex-wrap: wrap; max-width: 1100px; margin: 0 auto 1.5rem; }
        .qb-results-cards-row .qb-leaderboard,
        .qb-results-cards-row .qb-result,
        .qb-results-cards-row .fq-breakdown { flex: 1 1 380px; max-width: none; margin: 0; }
        @media (max-width: 760px) { .qb-results-cards-row { flex-direction: column; } }

        .qb-leaderboard { max-width: 520px; margin: 0 auto 1.5rem; background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 20px; text-align: left; }
        .qb-leaderboard-title { display: flex; align-items: center; gap: 8px; font-size: 1.05rem; font-weight: 700; color: #0a1f44; margin-bottom: 14px; }
        .qb-leaderboard-title i { color: #f0a500; }
        .qb-leaderboard-loading, .qb-leaderboard-empty { color: #6c757d; font-size: 0.9rem; }
        .qb-lb-row { display: grid; grid-template-columns: 40px 1fr auto auto; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 0.88rem; }
        .qb-lb-row:nth-child(even) { background: #f8f9fa; }
        .qb-lb-row.mine { background: #e8f0fe; border: 1.5px solid #4a90e2; font-weight: 700; }
        .qb-lb-rank { font-weight: 700; text-align: center; }
        .qb-lb-name { color: #333; overflow-wrap: anywhere; }
        .qb-lb-score { color: #555; font-weight: 600; white-space: nowrap; }
        .qb-lb-pct { color: #28a745; font-weight: 700; white-space: nowrap; }
      `}</style>

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-breadcrumb">
            <a href="/">
              <i className="fas fa-home"></i> Home
            </a>
            <i className="fas fa-chevron-right"></i>
            <span>Free Quiz</span>
          </div>
          <div className="page-hero-body">
            <div className="page-hero-icon">
              <i className="fas fa-gift"></i>
            </div>
            <div>
              <h1>Free Quiz</h1>
              <p>Timed practice sets — each set&apos;s time is split evenly across its subjects, sectional-exam style.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="course-detail-section">
        <div className="container">
          <Suspense fallback={<div className="qb-state"><i className="fas fa-spinner fa-spin"></i><p>Loading…</p></div>}>
            <QuizBank />
          </Suspense>
        </div>
      </section>
    </>
  );
}
