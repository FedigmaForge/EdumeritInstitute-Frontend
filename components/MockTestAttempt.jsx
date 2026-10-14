"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { authFetch, getToken } from "./studentAuth";
import StudentAuthModal from "./StudentAuthModal";

// Takes one Main Mock Test test: /mock-test/attempt/?test=<id>
// Flow: login → instructions → timed questions → submit → score + solutions.
// Backend: GET/POST /api/main-mock-test/tests/:id/{start,submit} (MainMockAttemptController.js)

const LETTERS = "ABCDEF";

const clock = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
};

export default function MockTestAttempt() {
  const testId = useSearchParams().get("test");
  const [stage, setStage] = useState("loading"); // login | loading | error | intro | running | result
  const [error, setError] = useState("");
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // questionId -> option index
  const [review, setReview] = useState(() => new Set()); // marked for review
  const [current, setCurrent] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState(null);
  const [filter, setFilter] = useState("all"); // solutions filter
  const [authOpen, setAuthOpen] = useState(true);
  const submitted = useRef(false);

  const seriesHref = test?.sectionSlug && test?.examSlug ? `/mock-test/${test.sectionSlug}/${test.examSlug}/` : "/mock-test/";

  const load = useCallback(() => {
    if (!testId) {
      setError("No test selected.");
      setStage("error");
      return;
    }
    if (!getToken()) {
      setAuthOpen(true);
      setStage("login");
      return;
    }
    setStage("loading");
    authFetch(`/api/main-mock-test/tests/${encodeURIComponent(testId)}/start`)
      .then((d) => {
        setTest(d.test);
        setQuestions(d.questions || []);
        setStage("intro");
      })
      .catch((err) => {
        if (err.status === 401) { setAuthOpen(true); return setStage("login"); }
        setError(err.message || "Could not load this test.");
        setStage("error");
      });
  }, [testId]);

  useEffect(() => { load(); }, [load]);

  const durationSec = (test?.durationMins || 0) * 60;
  const elapsed = startedAt ? (now - startedAt) / 1000 : 0;
  const left = durationSec ? durationSec - elapsed : null;

  const submit = useCallback(async () => {
    if (submitted.current) return;
    submitted.current = true;
    setSubmitting(true);
    setConfirm(false);
    try {
      const d = await authFetch(`/api/main-mock-test/tests/${encodeURIComponent(testId)}/submit`, {
        method: "POST",
        body: { answers, timeTakenSec: Math.round((Date.now() - startedAt) / 1000) },
      });
      setResult(d);
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      submitted.current = false;
      setError(err.status === 401 ? "Your login expired. Please log in again and submit." : err.message || "Submit failed. Please try again.");
      if (err.status === 401) { setAuthOpen(true); setStage("login"); }
    } finally {
      setSubmitting(false);
    }
  }, [answers, startedAt, testId]);

  // Timer
  useEffect(() => {
    if (stage !== "running") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [stage]);

  // Time up → auto submit
  useEffect(() => {
    if (stage === "running" && left !== null && left <= 0) submit();
  }, [stage, left, submit]);

  // Warn before leaving mid-test
  useEffect(() => {
    if (stage !== "running") return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [stage]);

  const begin = () => {
    const t = Date.now();
    submitted.current = false;
    setAnswers({});
    setReview(new Set());
    setCurrent(0);
    setResult(null);
    setError("");
    setStartedAt(t);
    setNow(t);
    setStage("running");
  };

  /* ───────── Screens ───────── */

  if (stage === "login") {
    return (
      <>
        <div className="mts-empty">
          <i className="fas fa-lock"></i> Please log in to take this test.{" "}
          <button type="button" className="mta-link" onClick={() => setAuthOpen(true)}>Log in</button>{" · "}
          <Link href="/mock-test/">Browse mock tests</Link>
        </div>
        {authOpen && (
          <StudentAuthModal
            reason="Log in or sign up to start this mock test."
            onClose={() => setAuthOpen(false)}
            onDone={() => {
              setError("");
              // logged out mid-test (token expired on submit) → back to the same attempt
              if (startedAt && questions.length) setStage("running");
              else load();
            }}
          />
        )}
      </>
    );
  }

  if (stage === "loading") {
    return <div className="mt-loading"><i className="fas fa-spinner fa-spin"></i> Loading test…</div>;
  }

  if (stage === "error") {
    return (
      <div className="mts-empty">
        <i className="fas fa-circle-exclamation"></i> {error}{" "}
        <Link href={seriesHref}>Back to tests</Link>
      </div>
    );
  }

  if (stage === "intro") {
    const negative = questions.some((q) => q.negativeMarks > 0);
    return (
      <div className="mta-intro">
        <span className="mts-chip">{test.examTitle} · {test.seriesTitle}</span>
        <h1 className="mts-title">{test.name}</h1>
        <div className="mta-intro-stats">
          <div><strong>{test.totalQuestions}</strong><span>Questions</span></div>
          <div><strong>{test.totalMarks}</strong><span>Marks</span></div>
          <div><strong>{test.durationMins || "—"}</strong><span>Mins</span></div>
        </div>
        <h3>Instructions</h3>
        <ul className="mta-rules">
          {test.durationMins ? (
            <li>You have <b>{test.durationMins} minutes</b>. The test is submitted automatically when time runs out.</li>
          ) : (
            <li>There is no time limit for this test.</li>
          )}
          <li>Each question has one correct answer. Marks for each question are shown above it.</li>
          {negative ? <li>Wrong answers carry <b>negative marks</b>. Unanswered questions get 0.</li> : <li>There is no negative marking.</li>}
          <li>You can move between questions, change answers and mark questions for review before submitting.</li>
          <li>Don&apos;t refresh or close this page during the test — your answers will be lost.</li>
        </ul>
        <div className="mta-intro-actions">
          <Link href={seriesHref} className="mta-btn ghost">Back</Link>
          <button type="button" className="mts-start" onClick={begin}>Start Test</button>
        </div>
      </div>
    );
  }

  if (stage === "result" && result) {
    const r = result.result;
    const shown = result.questions.filter((q) => filter === "all" || q.status === filter);
    return (
      <div className="mta-result">
        <div className="mta-result-head">
          <div>
            <span className="mts-chip">{test.examTitle}</span>
            <h1 className="mts-title">{test.name} — Result</h1>
          </div>
          <div className="mta-score">
            <strong>{r.score}</strong>
            <span>/ {r.totalMarks}</span>
          </div>
        </div>
        <div className="mta-result-stats">
          <div className="ok"><strong>{r.correct}</strong><span>Correct</span></div>
          <div className="bad"><strong>{r.wrong}</strong><span>Wrong</span></div>
          <div><strong>{r.skipped}</strong><span>Skipped</span></div>
          <div><strong>{r.accuracy}%</strong><span>Accuracy</span></div>
          <div><strong>{r.timeTakenSec ? clock(r.timeTakenSec) : "—"}</strong><span>Time taken</span></div>
        </div>
        <div className="mta-intro-actions">
          <Link href={seriesHref} className="mta-btn ghost">Back to tests</Link>
          <button type="button" className="mts-start" onClick={begin}>Re-attempt</button>
        </div>

        <div className="mt-title-row">
          <h2 className="mt-title mts-series-title">Solutions</h2>
          <span className="mt-title-line"></span>
        </div>
        <div className="mta-filters">
          {[["all", "All"], ["correct", "Correct"], ["wrong", "Wrong"], ["skipped", "Skipped"]].map(([k, l]) => (
            <button key={k} type="button" className={`mt-tab${filter === k ? " active" : ""}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        {shown.length === 0 && <div className="mts-empty">No questions here.</div>}
        {shown.map((q) => {
          const no = result.questions.indexOf(q) + 1;
          return (
            <div className={`mta-sol ${q.status}`} key={q.id}>
              <div className="mta-q-head">
                <span>Q{no}{q.sectionName ? ` · ${q.sectionName}` : ""}</span>
                <span className={`mta-tag ${q.status}`}>
                  {q.status === "correct" ? `+${q.marks}` : q.status === "wrong" ? `-${q.negativeMarks}` : "0"} · {q.status}
                </span>
              </div>
              <p className="mta-q-text">{q.question}</p>
              <div className="mta-opts">
                {q.options.map((o, i) => (
                  <div
                    key={i}
                    className={`mta-opt static${i === q.correctAnswer ? " right" : ""}${i === q.selected && i !== q.correctAnswer ? " wrongpick" : ""}`}
                  >
                    <span className="mta-letter">{LETTERS[i]}</span>
                    <span>{o}</span>
                    {i === q.correctAnswer && <i className="fas fa-check mta-mark"></i>}
                    {i === q.selected && i !== q.correctAnswer && <i className="fas fa-times mta-mark"></i>}
                  </div>
                ))}
              </div>
              {q.explanation && (
                <div className="mta-expl"><b>Explanation:</b> {q.explanation}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* ───────── Running ───────── */
  const q = questions[current];
  const answeredCount = Object.keys(answers).length;
  const pick = (i) => setAnswers((a) => ({ ...a, [q.id]: i }));
  const clear = () => setAnswers((a) => { const n = { ...a }; delete n[q.id]; return n; });
  const toggleReview = () =>
    setReview((s) => { const n = new Set(s); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; });

  return (
    <div className="mta">
      <div className="mta-bar">
        <div className="mta-bar-name">{test.name}</div>
        <div className={`mta-timer${left !== null && left < 60 ? " low" : ""}`}>
          <i className="fas fa-clock"></i> {left !== null ? clock(left) : clock(elapsed)}
        </div>
        <button type="button" className="mts-start mta-submit" disabled={submitting} onClick={() => setConfirm(true)}>
          {submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting…</> : "Submit"}
        </button>
      </div>

      <div className="mta-body">
        <div className="mta-question">
          <div className="mta-q-head">
            <span>Question {current + 1} of {questions.length}{q.sectionName ? ` · ${q.sectionName}` : ""}</span>
            <span className="mta-marks">+{q.marks}{q.negativeMarks > 0 ? ` / -${q.negativeMarks}` : ""}</span>
          </div>
          <p className="mta-q-text">{q.question}</p>
          <div className="mta-opts">
            {q.options.map((o, i) => (
              <button
                type="button"
                key={i}
                className={`mta-opt${answers[q.id] === i ? " picked" : ""}`}
                onClick={() => pick(i)}
              >
                <span className="mta-letter">{LETTERS[i]}</span>
                <span>{o}</span>
              </button>
            ))}
          </div>
          <div className="mta-nav">
            <button type="button" className="mta-btn ghost" onClick={toggleReview}>
              <i className={`fa${review.has(q.id) ? "s" : "r"} fa-bookmark`}></i> {review.has(q.id) ? "Unmark" : "Mark for review"}
            </button>
            <button type="button" className="mta-btn ghost" onClick={clear} disabled={answers[q.id] === undefined}>Clear</button>
            <span className="mta-nav-gap"></span>
            <button type="button" className="mta-btn" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
              <i className="fas fa-chevron-left"></i> Prev
            </button>
            {current < questions.length - 1 ? (
              <button type="button" className="mta-btn primary" onClick={() => setCurrent(current + 1)}>
                Next <i className="fas fa-chevron-right"></i>
              </button>
            ) : (
              <button type="button" className="mta-btn primary" onClick={() => setConfirm(true)}>Finish</button>
            )}
          </div>
        </div>

        <aside className="mta-palette">
          <div className="mta-palette-head">{answeredCount} of {questions.length} answered</div>
          <div className="mta-grid">
            {questions.map((qq, i) => (
              <button
                type="button"
                key={qq.id}
                className={`mta-cell${answers[qq.id] !== undefined ? " done" : ""}${review.has(qq.id) ? " review" : ""}${i === current ? " now" : ""}`}
                onClick={() => setCurrent(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mta-legend">
            <span><i className="mta-dot done"></i> Answered</span>
            <span><i className="mta-dot review"></i> Review</span>
            <span><i className="mta-dot"></i> Not answered</span>
          </div>
        </aside>
      </div>

      {error && <div className="mt-toast"><i className="fas fa-circle-exclamation"></i> {error}</div>}

      {confirm && (
        <div className="sa-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setConfirm(false)}>
          <div className="sa-modal">
            <h3>Submit test?</h3>
            <p className="sa-reason">
              You have answered {answeredCount} of {questions.length} questions
              {questions.length - answeredCount > 0 ? ` — ${questions.length - answeredCount} unanswered` : ""}.
              {review.size > 0 ? ` ${review.size} marked for review.` : ""}
            </p>
            <div className="mta-intro-actions">
              <button type="button" className="mta-btn ghost" onClick={() => setConfirm(false)}>Keep going</button>
              <button type="button" className="mts-start" onClick={submit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
