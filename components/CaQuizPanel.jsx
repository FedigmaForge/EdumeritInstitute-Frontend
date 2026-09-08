"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.edumerits.in";
// ^ NEXT_PUBLIC_API_BASE is only set in .env.development.local for local testing
//   (see that file) -- a production build always falls back to api.edumerits.in.
const CA_QUIZ_API_URL = API_BASE + "/api/admin/current-affairs-quiz/public";
const CA_QUIZ_LIST_API_URL = API_BASE + "/api/admin/current-affairs-quiz/public/list";
const CA_QUIZ_SUBMIT_API_URL = API_BASE + "/api/admin/current-affairs-quiz/public/submit";
const CA_QUIZ_LEADERBOARD_API_URL = API_BASE + "/api/admin/current-affairs-quiz/public/leaderboard";
const CA_QUIZ_MY_ATTEMPTS_API_URL = API_BASE + "/api/admin/current-affairs-quiz/public/my-attempts";

export const CA_QUIZ_TYPE_LABELS = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
const isValidMobile = (v) => /^[0-9]{10}$/.test(String(v || "").replace(/[\s\-+]/g, "").replace(/^91(?=\d{10}$)/, ""));

function caQuizOrdinal(n) {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

// "2026-08-27" -> "27 Aug 2026"
function formatCaQuizDate(d) {
  if (!d) return "";
  try {
    const date = new Date(d + "T00:00:00");
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return d;
  }
}

// "2026-08-27" -> "27th August, 2026"
function formatCaQuizOrdinalDate(d) {
  if (!d) return "";
  try {
    const date = new Date(d + "T00:00:00");
    if (isNaN(date.getTime())) return d;
    const day = date.getDate();
    const month = date.toLocaleDateString("en-IN", { month: "long" });
    return `${day}${caQuizOrdinal(day)} ${month}, ${date.getFullYear()}`;
  } catch {
    return d;
  }
}

function formatMMSS(totalSeconds) {
  const m = Math.max(0, Math.floor(totalSeconds / 60));
  const s = Math.max(0, totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatCaQuizHeading(quiz) {
  if (quiz.quizType === "weekly") {
    return quiz.quizEndDate
      ? `${formatCaQuizDate(quiz.quizDate)} – ${formatCaQuizDate(quiz.quizEndDate)}`
      : formatCaQuizOrdinalDate(quiz.quizDate);
  }
  if (quiz.quizType === "monthly") {
    try {
      const date = new Date(quiz.quizDate + "T00:00:00");
      if (!isNaN(date.getTime())) return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    } catch {
      /* fall through */
    }
  }
  return formatCaQuizOrdinalDate(quiz.quizDate);
}

function maskCaEmailForCompare(email) {
  const [local, domain] = String(email || "").split("@");
  if (!local || !domain) return null;
  const visible = local.slice(0, Math.min(3, local.length));
  const maskedLen = Math.max(local.length - visible.length, 3);
  return `${visible}${"*".repeat(maskedLen)}@${domain}`;
}

const medal = (rank) => (rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`);

function QuizListCard({ quiz, onAttempt }) {
  const durLabel = `${quiz.duration > 0 ? quiz.duration : quiz.questionCount} minutes`;
  const heading = quiz.title ? quiz.title : formatCaQuizHeading(quiz);
  return (
    <div className="ca-quiz-card">
      <div className="ca-quiz-card-icon">
        <i className="fas fa-file-circle-question"></i>
      </div>
      <div className="ca-quiz-card-body">
        <div className="ca-quiz-card-title">{heading}</div>
        <div className="ca-quiz-card-meta-row">
          <span>
            <i className="fas fa-file-lines"></i> {quiz.questionCount} Question{quiz.questionCount === 1 ? "" : "s"}
          </span>
          <span>
            <i className="far fa-clock"></i> {durLabel}
          </span>
        </div>
        <div className="ca-quiz-card-meta-row">
          <span>
            <i className="fas fa-star"></i> {quiz.totalMarks} Marks
          </span>
          <span>
            <i className="far fa-calendar"></i> {formatCaQuizDate(quiz.quizDate)}
          </span>
        </div>
        <div className="ca-quiz-card-footer">
          <button type="button" className="ca-quiz-attempt-btn" onClick={() => onAttempt(quiz.quizDate)}>
            Attempt Now
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ r, num }) {
  return (
    <div className="qb-card revealed">
      <div className="qb-head">
        <span className="qb-num">Q{num}.</span>
        {r.selectedIndex === null || r.selectedIndex === undefined ? (
          <span className="qb-badge" style={{ background: "#e2e8f0", color: "#475569" }}>Not Attempted</span>
        ) : r.isCorrect ? (
          <span className="qb-badge easy">Correct (+{r.marksAwarded})</span>
        ) : (
          <span className="qb-badge hard">Incorrect ({r.marksAwarded})</span>
        )}
        <span className="qb-q">{r.question}</span>
      </div>
      <div className="qb-options">
        {(r.options || []).map((opt, i) => {
          const isCorrect = i === r.correctIndex;
          const isWrongPick = i === r.selectedIndex && !isCorrect;
          return (
            <div key={i} className={`qb-opt${isCorrect ? " correct" : ""}${isWrongPick ? " wrong-selected" : ""}`}>
              <span className="qb-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
              {isCorrect && <i className="fas fa-check-circle qb-check" style={{ display: "inline", marginLeft: "auto", color: "#28a745" }}></i>}
              {isWrongPick && <i className="fas fa-times-circle" style={{ marginLeft: "auto", color: "#dc3545" }}></i>}
            </div>
          );
        })}
      </div>
      <div className="qb-answer" style={{ display: "block" }}>
        <div className="qb-expl">
          <strong>
            <i className="fas fa-circle-check"></i> Correct answer: {String.fromCharCode(65 + r.correctIndex)}
          </strong>
          {r.explanation && (
            <div style={{ marginTop: "6px" }}>
              <strong>Explanation:</strong> {r.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AttemptHistoryPanel({ status, rows, currentQuizId, typeLabel }) {
  return (
    <div className="ca-quiz-history-panel">
      <div className="ca-quiz-history-title">
        <i className="fas fa-chart-line"></i> Your {typeLabel} Quiz History
      </div>
      {status === "loading" && (
        <div className="ca-quiz-history-loading">
          <i className="fas fa-spinner fa-spin"></i> Loading your past attempts…
        </div>
      )}
      {status === "error" && <p className="ca-quiz-history-empty">Couldn&apos;t load your attempt history right now.</p>}
      {status === "empty" && <p className="ca-quiz-history-empty">This is your first {typeLabel} Quiz attempt — nice start!</p>}
      {status === "ready" &&
        rows.length > 0 &&
        (() => {
          const scores = rows.map((r) => Number(r.percentage) || 0);
          const best = Math.max(...scores);
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          return (
            <>
              <div className="ca-quiz-history-summary">
                <div>
                  <span className="ca-quiz-history-summary-value">{rows.length}</span>
                  <span className="ca-quiz-history-summary-label">Attempts</span>
                </div>
                <div>
                  <span className="ca-quiz-history-summary-value">{best.toFixed(0)}%</span>
                  <span className="ca-quiz-history-summary-label">Best</span>
                </div>
                <div>
                  <span className="ca-quiz-history-summary-value">{avg.toFixed(0)}%</span>
                  <span className="ca-quiz-history-summary-label">Average</span>
                </div>
              </div>
              <div className="ca-quiz-history-list">
                {rows.map((r, i) => {
                  const isCurrent = currentQuizId != null && String(r.quizId) === String(currentQuizId);
                  const prevPct = i < rows.length - 1 ? Number(rows[i + 1].percentage) || 0 : null;
                  const pct = Number(r.percentage) || 0;
                  const delta = prevPct === null ? null : pct - prevPct;
                  return (
                    <div className={`ca-quiz-history-row${isCurrent ? " current" : ""}`} key={r.quizId ?? i}>
                      <div className="ca-quiz-history-row-main">
                        <span className="ca-quiz-history-row-date">
                          {formatCaQuizDate(r.quizDate)}
                          {isCurrent ? " (this attempt)" : ""}
                        </span>
                        <span className="ca-quiz-history-row-score">
                          {r.score}/{r.total} <span className="ca-quiz-history-row-pct">({pct.toFixed(0)}%)</span>
                        </span>
                      </div>
                      {delta !== null && Math.round(delta) !== 0 && (
                        <span className={`ca-quiz-history-delta${delta > 0 ? " up" : " down"}`}>
                          <i className={`fas fa-arrow-${delta > 0 ? "up" : "down"}`}></i> {Math.abs(delta).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
    </div>
  );
}

export default function CaQuizPanel({ type, onClose }) {
  const [view, setView] = useState("list"); // 'list' | 'attempt' | 'review'
  const [listStatus, setListStatus] = useState("loading");
  const [listError, setListError] = useState("");
  const [quizzes, setQuizzes] = useState([]);

  const [attemptStatus, setAttemptStatus] = useState("idle"); // 'loading' | 'ready' | 'empty' | 'error'
  const [attemptError, setAttemptError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizMeta, setQuizMeta] = useState(null);
  const [attemptContext, setAttemptContext] = useState(null); // { quizId, quizType, quizDate }
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timeUp, setTimeUp] = useState(false);

  const [reviewData, setReviewData] = useState(null); // submit response
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);
  const [leaderboardStatus, setLeaderboardStatus] = useState("loading");
  const [leaderboardRows, setLeaderboardRows] = useState([]);
  const [historyStatus, setHistoryStatus] = useState("idle");
  const [historyRows, setHistoryRows] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [mobileInvalid, setMobileInvalid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const typeLabel = CA_QUIZ_TYPE_LABELS[type] || "";

  const fetchList = async () => {
    setListStatus("loading");
    setListError("");
    try {
      const res = await fetch(`${CA_QUIZ_LIST_API_URL}?quizType=${encodeURIComponent(type)}`, { headers: { Accept: "application/json" } });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.success !== true) {
        setListStatus("error");
        setListError((data && data.message) || "Please try again.");
        return;
      }
      const list = Array.isArray(data.quizzes) ? data.quizzes : [];
      setQuizzes(list);
      setListStatus(list.length === 0 ? "empty" : "ready");
    } catch (err) {
      console.error("Failed to load current affairs quiz list:", err);
      setListStatus("error");
      setListError("Network error — please try again.");
    }
  };

  useEffect(() => {
    setView("list");
    setQuestions([]);
    setAnswers({});
    setQIndex(0);
    setAttemptContext(null);
    setReviewData(null);
    setShowAnswers(false);
    setHistoryStatus("idle");
    setHistoryRows([]);
    setRemainingSeconds(0);
    setTimeUp(false);
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const attemptQuiz = async (quizDate) => {
    setAnswers({});
    setQuestions([]);
    setQIndex(0);
    setAttemptContext(null);
    setAttemptStatus("loading");
    setTimeUp(false);
    setView("attempt");

    try {
      const res = await fetch(`${CA_QUIZ_API_URL}?quizType=${encodeURIComponent(type)}&quizDate=${encodeURIComponent(quizDate)}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.success !== true) {
        setAttemptStatus("error");
        setAttemptError((data && data.message) || "Please go back and pick another date.");
        return;
      }
      const quiz = data.quiz || {};
      const qs = Array.isArray(data.questions) ? data.questions : [];
      setQuizMeta(quiz);
      if (qs.length === 0) {
        setAttemptStatus("empty");
        return;
      }
      setQuestions(qs);
      setAttemptContext({ quizId: quiz.id, quizType: type, quizDate });
      // 1 minute per question by default; an explicit admin-set duration (minutes) overrides that.
      setRemainingSeconds((quiz.duration > 0 ? quiz.duration : qs.length) * 60);
      setAttemptStatus("ready");
    } catch (err) {
      console.error("Failed to load current affairs quiz:", err);
      setAttemptStatus("error");
      setAttemptError("Network error — please try again.");
    }
  };

  // ── Countdown: ticks every second while attempting a loaded quiz ──
  useEffect(() => {
    if (view !== "attempt" || attemptStatus !== "ready") return;
    if (remainingSeconds <= 0) return;
    const t = setTimeout(() => setRemainingSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [view, attemptStatus, remainingSeconds]);

  // ── Time's up: locks answers and prompts the submit modal automatically ──
  useEffect(() => {
    if (view !== "attempt" || attemptStatus !== "ready") return;
    if (remainingSeconds !== 0 || timeUp) return;
    setTimeUp(true);
    setModalOpen(true);
  }, [remainingSeconds, view, attemptStatus, timeUp]);

  const goTo = (idx) => {
    if (idx < 0 || idx >= questions.length) return;
    setQIndex(idx);
  };

  const selectOption = (qid, idx) => {
    if (timeUp) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const loadLeaderboard = async (quizId, forEmail) => {
    setLeaderboardStatus("loading");
    try {
      const res = await fetch(`${CA_QUIZ_LEADERBOARD_API_URL}?quizId=${encodeURIComponent(quizId)}&limit=10`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.success !== true || !Array.isArray(data.leaderboard) || !data.leaderboard.length) {
        setLeaderboardStatus(res.ok && data && data.success ? "empty" : "error");
        setLeaderboardRows([]);
        return;
      }
      setLeaderboardRows(data.leaderboard);
      setLeaderboardStatus("ready");
    } catch (err) {
      console.error("Failed to load current affairs quiz leaderboard:", err);
      setLeaderboardStatus("error");
      setLeaderboardRows([]);
    }
  };

  const loadHistory = async (forEmail) => {
    setHistoryStatus("loading");
    try {
      const res = await fetch(
        `${CA_QUIZ_MY_ATTEMPTS_API_URL}?email=${encodeURIComponent(forEmail)}&quizType=${encodeURIComponent(type)}&limit=20`,
        { headers: { Accept: "application/json" } }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.success !== true || !Array.isArray(data.attempts)) {
        setHistoryStatus("error");
        setHistoryRows([]);
        return;
      }
      setHistoryRows(data.attempts);
      setHistoryStatus(data.attempts.length === 0 ? "empty" : "ready");
    } catch (err) {
      console.error("Failed to load current affairs quiz attempt history:", err);
      setHistoryStatus("error");
      setHistoryRows([]);
    }
  };

  const confirmSubmit = async () => {
    let ok = true;
    if (!isValidEmail(email)) {
      setEmailInvalid(true);
      ok = false;
    } else {
      setEmailInvalid(false);
    }
    if (!isValidMobile(mobile)) {
      setMobileInvalid(true);
      ok = false;
    } else {
      setMobileInvalid(false);
    }
    if (!ok || !attemptContext) return;

    setSubmitting(true);
    setSubmitError("");

    const answerList = questions
      .map((q) => ({ questionId: q.id, selectedIndex: answers[q.id] }))
      .filter((a) => a.selectedIndex !== undefined);
    const payload = { email, mobile, ...attemptContext, answers: answerList };

    try {
      const res = await fetch(CA_QUIZ_SUBMIT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setModalOpen(false);
        setReviewData(data);
        setSubmittedEmail(email);
        setShowAnswers(false);
        setView("review");
        setEmail("");
        setMobile("");
        loadLeaderboard(attemptContext.quizId, email);
        loadHistory(email);
      } else {
        throw new Error(data.message || "Submit failed");
      }
    } catch (err) {
      console.error("Failed to submit current affairs quiz:", err);
      setSubmitError("Couldn't submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const panelTitle = view === "review" ? `${typeLabel} Quiz` : `${typeLabel} Quiz`;
  const q = questions[qIndex];

  return (
    <section className="ca-quiz-section">
      <div className="container">
        <div className="ca-quiz-panel">
          <div className="ca-quiz-panel-header">
            <div>
              <h2>
                <i className="fas fa-pen-to-square"></i> <span>{panelTitle}</span>
              </h2>
              <div className="ca-quiz-meta">
                {view === "attempt" && quizMeta && attemptStatus === "ready" && (
                  <>
                    {quizMeta.title ? `${quizMeta.title} · ` : ""}
                    <i className="far fa-calendar-alt"></i> {formatCaQuizHeading(quizMeta)}
                    <span className="dot">•</span>
                    <i className="fas fa-stopwatch"></i> {quizMeta.duration > 0 ? quizMeta.duration : questions.length} min
                    <span className="dot">•</span>
                    <i className="fas fa-list-ol"></i> {questions.length} question{questions.length === 1 ? "" : "s"}
                  </>
                )}
                {view === "list" && listStatus === "ready" && `${quizzes.length} quiz${quizzes.length === 1 ? "" : "zes"} available`}
              </div>
            </div>
            <button type="button" className="ca-quiz-close" onClick={onClose} aria-label="Close quiz">
              <i className="fas fa-xmark"></i>
            </button>
          </div>

          <div className="ca-quiz-body">
            {view === "list" && (
              <>
                {listStatus === "loading" && (
                  <div className="loading-card">
                    <div className="spinner"></div>
                    <p>Loading {typeLabel} Quiz...</p>
                  </div>
                )}
                {listStatus === "error" && (
                  <div className="error-card">
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: "2.5rem", color: "#dc2626" }}></i>
                    <h3>Unable to Load Quizzes</h3>
                    <p>{listError}</p>
                  </div>
                )}
                {listStatus === "empty" && (
                  <div className="error-card">
                    <i className="fas fa-info-circle" style={{ fontSize: "2.5rem", color: "#f59e0b" }}></i>
                    <h3>No {typeLabel} Quiz Yet</h3>
                    <p>Please check back soon.</p>
                  </div>
                )}
                {listStatus === "ready" && (
                  <div className="ca-quiz-list-grid">
                    {quizzes.map((quiz) => (
                      <QuizListCard key={`${quiz.quizType}-${quiz.quizDate}`} quiz={quiz} onAttempt={attemptQuiz} />
                    ))}
                  </div>
                )}
              </>
            )}

            {view === "attempt" && (
              <>
                <button type="button" className="ca-quiz-back-btn" onClick={() => setView("list")}>
                  <i className="fas fa-arrow-left"></i> Back to {typeLabel} Quiz list
                </button>
                {attemptStatus === "loading" && (
                  <div className="loading-card">
                    <div className="spinner"></div>
                    <p>Loading quiz...</p>
                  </div>
                )}
                {attemptStatus === "error" && (
                  <div className="error-card">
                    <i className="fas fa-info-circle" style={{ fontSize: "2.5rem", color: "#f59e0b" }}></i>
                    <h3>Quiz Not Found</h3>
                    <p>{attemptError}</p>
                  </div>
                )}
                {attemptStatus === "empty" && (
                  <div className="error-card">
                    <i className="fas fa-info-circle" style={{ fontSize: "2.5rem", color: "#f59e0b" }}></i>
                    <h3>No Questions Yet</h3>
                    <p>This quiz doesn't have any questions added yet.</p>
                  </div>
                )}
                {attemptStatus === "ready" && q && (
                  <div className="ca-quiz-attempt-layout">
                    <div className="ca-quiz-attempt-main">
                      <div className="ca-quiz-progress-row">
                        <div className="ca-quiz-progress">
                          Question {qIndex + 1} of {questions.length}
                        </div>
                        <div className={`ca-quiz-timer${remainingSeconds <= 30 ? " low" : ""}`}>
                          <i className="fas fa-stopwatch"></i> <span>{formatMMSS(remainingSeconds)}</span>
                        </div>
                      </div>
                      <div className={`qb-card${timeUp ? " locked" : ""}`}>
                        <div className="qb-head">
                          <span className="qb-num">Q{qIndex + 1}.</span>
                          <span className="qb-badge" style={{ background: "#eef3fb", color: "#2b4f8c" }}>
                            +{q.marks}{q.negativeMarks > 0 ? ` / -${q.negativeMarks}` : ""} marks
                          </span>
                          <span className="qb-q">{q.question}</span>
                        </div>
                        <div className="qb-options">
                          {(q.options || []).map((opt, i) => (
                            <div
                              key={i}
                              className={`qb-opt${answers[q.id] === i ? " selected" : ""}`}
                              onClick={() => selectOption(q.id, i)}
                            >
                              <span className="qb-letter">{String.fromCharCode(65 + i)}</span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="ca-quiz-nav-row">
                        <button type="button" className="ca-quiz-nav-btn" disabled={qIndex === 0} onClick={() => goTo(qIndex - 1)}>
                          <i className="fas fa-arrow-left"></i> Previous
                        </button>
                        <button type="button" className="ca-quiz-finish-btn" onClick={() => setModalOpen(true)}>
                          <i className="fas fa-paper-plane"></i> Submit
                        </button>
                        <button type="button" className="ca-quiz-nav-btn" disabled={qIndex === questions.length - 1} onClick={() => goTo(qIndex + 1)}>
                          Next <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                    <div className="ca-quiz-palette-panel">
                      <div className="ca-quiz-palette-title">Questions</div>
                      <div className="ca-quiz-palette-grid">
                        {questions.map((qq, i) => (
                          <button
                            key={qq.id ?? i}
                            type="button"
                            className={`ca-quiz-palette-btn${answers[qq.id] !== undefined ? " answered" : ""}${i === qIndex ? " current" : ""}`}
                            onClick={() => goTo(i)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      <div className="ca-quiz-palette-legend">
                        <span>
                          <span className="ca-quiz-palette-swatch"></span> Not answered
                        </span>
                        <span>
                          <span className="ca-quiz-palette-swatch answered"></span> Answered
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {view === "review" && reviewData && (
              <>
                <button type="button" className="ca-quiz-back-btn" onClick={() => setView("list")}>
                  <i className="fas fa-arrow-left"></i> Back to {typeLabel} Quiz list
                </button>
                <div className="ca-quiz-review-layout">
                  <div className="ca-quiz-review-main">
                    <div className="ca-quiz-score-bar" style={{ display: "block" }}>
                      <i className="fas fa-trophy"></i> You scored{" "}
                      <strong>
                        {Number(reviewData.score).toFixed(2)} / {Number(reviewData.total).toFixed(2)}
                      </strong>{" "}
                      marks — {reviewData.correctCount} correct out of {Number(reviewData.totalQuestions || (reviewData.results || []).length)} question
                      {Number(reviewData.totalQuestions || (reviewData.results || []).length) === 1 ? "" : "s"}.
                    </div>
                    <div className="ca-quiz-leaderboard">
                      <div className="ca-quiz-leaderboard-title">
                        <i className="fas fa-trophy"></i> Leaderboard
                      </div>
                      {leaderboardStatus === "loading" && (
                        <div className="ca-quiz-lb-loading">
                          <i className="fas fa-spinner fa-spin"></i> Loading leaderboard…
                        </div>
                      )}
                      {leaderboardStatus === "error" && <p className="ca-quiz-lb-empty">Couldn't load the leaderboard right now.</p>}
                      {leaderboardStatus === "empty" && <p className="ca-quiz-lb-empty">No leaderboard entries yet — be the first!</p>}
                      {leaderboardStatus === "ready" &&
                        leaderboardRows.map((row) => {
                          const myMasked = maskCaEmailForCompare(submittedEmail);
                          const mine = myMasked && row.displayName === myMasked;
                          return (
                            <div className={`ca-quiz-lb-row${mine ? " mine" : ""}`} key={`${row.rank}-${row.displayName}`}>
                              <span className="ca-quiz-lb-rank">{medal(row.rank)}</span>
                              <span className="ca-quiz-lb-name">
                                {row.displayName}
                                {mine ? " (you)" : ""}
                              </span>
                              <span className="ca-quiz-lb-score">
                                {row.score}/{row.total}
                              </span>
                              <span className="ca-quiz-lb-pct">{row.percentage}%</span>
                            </div>
                          );
                        })}
                    </div>
                    <div style={{ margin: "1rem 0" }}>
                      {!showAnswers && (
                        <button type="button" className="ca-quiz-finish-btn" onClick={() => setShowAnswers(true)}>
                          <i className="fas fa-eye"></i> View All Answers
                        </button>
                      )}
                    </div>
                    {showAnswers && (
                      <div>
                        {(reviewData.results || []).map((r, i) => (
                          <ReviewCard key={r.questionId ?? i} r={r} num={i + 1} />
                        ))}
                      </div>
                    )}
                  </div>
                  <AttemptHistoryPanel
                    status={historyStatus}
                    rows={historyRows}
                    currentQuizId={attemptContext && attemptContext.quizId}
                    typeLabel={typeLabel}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`ca-contact-modal${modalOpen ? " open" : ""}`}>
        <div className="ca-contact-modal-box">
          <h3>
            <i className="fas fa-user-check"></i> One last step
          </h3>
          <p>Enter your email and mobile number to view all answers and your score.</p>
          <label htmlFor="caModalEmail">Email</label>
          <input
            type="email"
            id="caModalEmail"
            placeholder="you@example.com"
            autoComplete="email"
            className={emailInvalid ? "invalid" : ""}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={`ca-contact-err${emailInvalid ? " show" : ""}`}>Please enter a valid email address.</div>
          <label htmlFor="caModalMobile">Mobile Number</label>
          <input
            type="tel"
            id="caModalMobile"
            placeholder="10-digit mobile number"
            autoComplete="tel"
            maxLength={10}
            className={mobileInvalid ? "invalid" : ""}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <div className={`ca-contact-err${mobileInvalid || submitError ? " show" : ""}`}>
            {submitError || "Please enter a valid 10-digit mobile number."}
          </div>
          <div className="ca-contact-modal-actions">
            <button type="button" className="ca-quiz-back-btn" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="ca-quiz-attempt-btn" disabled={submitting} onClick={confirmSubmit}>
              <i className={`fas ${submitting ? "fa-spinner fa-spin" : "fa-check"}`}></i> {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
