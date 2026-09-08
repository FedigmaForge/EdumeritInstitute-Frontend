"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.edumerits.in";
// ^ NEXT_PUBLIC_API_BASE is only set in .env.development.local for local testing
//   (see that file) -- a production build always falls back to api.edumerits.in.
const FREE_QUIZ_ENDPOINT = "/api/admin/free-quiz/all";
const SUBMIT_ENDPOINT = "/api/admin/free-quiz/submit";
const LEADERBOARD_ENDPOINT = "/api/admin/free-quiz/leaderboard";
const MY_ATTEMPTS_ENDPOINT = "/api/admin/free-quiz/my-attempts";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
const isValidMobile = (v) => /^[0-9]{10}$/.test(String(v || "").replace(/[\s\-+]/g, "").replace(/^91(?=\d{10}$)/, ""));

// Mirrors the backend's maskEmailForLeaderboard exactly, so the visitor's
// own row in the masked leaderboard can be identified and highlighted.
function maskEmailForCompare(email) {
  const [local, domain] = String(email || "").split("@");
  if (!local || !domain) return null;
  const visible = local.slice(0, Math.min(3, local.length));
  const maskedLen = Math.max(local.length - visible.length, 3);
  return `${visible}${"*".repeat(maskedLen)}@${domain}`;
}

// "2026-09-07T10:15:00.000Z" -> "7 Sep 2026, 3:45 pm"
function formatAttemptDateTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const datePart = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const timePart = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
    return `${datePart}, ${timePart}`;
  } catch {
    return "";
  }
}

function subjectsInSet(set) {
  const byName = new Map();
  set.questions.forEach((q) => {
    const name = (q.category || "").trim() || "General";
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(q);
  });
  return [...byName.keys()].sort((a, b) => a.localeCompare(b)).map((name) => ({ name, questions: byName.get(name) }));
}

// Splits a set's total duration evenly across its subjects — the single
// source of truth for "how much time does subject X get in set Y", used
// both by the filtered card display and the runner itself. The last subject
// (alphabetically) absorbs any leftover seconds from the floor() division.
function sectionsForSet(set) {
  const subjectDefs = subjectsInSet(set);
  const totalSeconds = set.duration > 0 ? set.duration * 60 : 0;
  const n = subjectDefs.length;
  const base = totalSeconds > 0 ? Math.floor(totalSeconds / n) : 0;
  return subjectDefs.map((s, i) => ({
    name: s.name,
    questions: s.questions,
    seconds: totalSeconds > 0 ? (i === n - 1 ? totalSeconds - base * (n - 1) : base) : 0,
  }));
}

function buildSets(allQuizzes) {
  const byId = new Map();
  allQuizzes.forEach((q) => {
    if (q.quizSetId == null) return; // Free Quiz questions always belong to a set
    if (!byId.has(q.quizSetId)) {
      byId.set(q.quizSetId, { id: q.quizSetId, title: q.setTitle || "Free Quiz Set", duration: Number(q.duration || 0), questions: [] });
    }
    byId.get(q.quizSetId).questions.push(q);
  });
  return [...byId.values()].filter((s) => s.questions.length > 0);
}

function formatMMSS(totalSeconds) {
  const m = Math.max(0, Math.floor(totalSeconds / 60));
  const s = Math.max(0, totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function SetTile({ title, questionCount, subjectTags, durationLabel, onStart }) {
  return (
    <div className="qb-tile" onClick={onStart}>
      <div className="qb-tile-icon">
        <i className="fas fa-layer-group"></i>
      </div>
      <div className="qb-tile-name">{title}</div>
      <div className="qb-tile-count">{questionCount}</div>
      {durationLabel}
      <div className="qb-tile-subjects">
        {subjectTags.map((t) => (
          <span className="qb-tile-subject-tag" key={t}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function RunnerQuestionCard({ q, num, locked, selected, onSelect }) {
  const diff = (q.difficulty || "medium").toLowerCase();
  const qid = String(q.id);
  return (
    <div className={`qb-card${locked ? " locked" : ""}`}>
      <div className="qb-head">
        <span className="qb-num">Q{num}.</span>
        <span className={`qb-badge ${diff}`}>{diff}</span>
        {q.subTopic && (
          <span className="qb-tag">
            <i className="fas fa-tag"></i> {q.subTopic}
          </span>
        )}
        <span className="qb-q">{q.question}</span>
      </div>
      <div className="qb-options">
        {(q.options || []).map((opt, i) => (
          <div key={i} className={`qb-opt${selected === i ? " selected" : ""}`} onClick={() => !locked && onSelect(qid, i)}>
            <span className="qb-letter">{String.fromCharCode(65 + i)}</span>
            <span>{opt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewQuestionCard({ q, num, picked }) {
  const correct = Number(q.correctAnswer);
  return (
    <div className="qb-card revealed">
      <div className="qb-head">
        <span className="qb-num">Q{num}.</span>
        <span className="qb-q">{q.question}</span>
      </div>
      <div className="qb-options">
        {(q.options || []).map((opt, i) => (
          <div key={i} className={`qb-opt${i === correct ? " correct" : ""}${picked === i && i !== correct ? " wrong-pick" : ""}`}>
            <span className="qb-letter">{String.fromCharCode(65 + i)}</span>
            <span>{opt}</span>
            {i === correct && <i className="fas fa-check-circle qb-check"></i>}
          </div>
        ))}
      </div>
      {q.explanation && (
        <div className="qb-expl">
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
    </div>
  );
}

export default function QuizBank() {
  const searchParams = useSearchParams();
  const categoryParam = (searchParams.get("category") || "").trim();

  const [loadStatus, setLoadStatus] = useState("loading");
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [screen, setScreen] = useState("sets"); // 'sets' | 'runner' | 'results'

  // Runner state
  const [runnerSet, setRunnerSet] = useState(null);
  const [runnerCategory, setRunnerCategory] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lockedSections, setLockedSections] = useState(() => new Set());
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [toast, setToast] = useState("");
  const [results, setResults] = useState(null);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [reviewVisible, setReviewVisible] = useState(false);

  // Contact modal (mandatory before results are shown)
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [mobileInvalid, setMobileInvalid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Leaderboard (every visitor, best attempt each — cross-visitor ranking)
  const [lbStatus, setLbStatus] = useState("loading");
  const [lbRows, setLbRows] = useState([]);
  const [lbTitle, setLbTitle] = useState("");

  // Your Attempts (this visitor's own history for this set/category — not a cross-visitor leaderboard)
  const [myAttemptsStatus, setMyAttemptsStatus] = useState("loading");
  const [myAttemptsRows, setMyAttemptsRows] = useState([]);
  const [myAttemptsTitle, setMyAttemptsTitle] = useState("");

  const toastTimerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}${FREE_QUIZ_ENDPOINT}`);
        const data = await res.json();
        setAllQuizzes(res.ok && data.success && Array.isArray(data.quizzes) ? data.quizzes : []);
        setLoadStatus("ready");
      } catch (err) {
        console.error("Failed to load free quiz:", err);
        setLoadStatus("error");
      }
    })();
  }, []);

  const sets = useMemo(() => buildSets(allQuizzes), [allQuizzes]);

  // ?category=English (etc.) — only sets containing that subject are shown,
  // each card showing just that subject's name/count/allotted time. Starting
  // one of these cards runs ONLY that section, not the whole multi-subject set.
  const filteredMatches = useMemo(() => {
    if (!categoryParam) return null;
    const wantedNorm = categoryParam.toLowerCase();
    const out = [];
    sets.forEach((set) => {
      const section = sectionsForSet(set).find((s) => s.name.toLowerCase() === wantedNorm);
      if (section) out.push({ set, section });
    });
    return out;
  }, [sets, categoryParam]);

  const startRunner = (set, onlySubjectName) => {
    let subs = sectionsForSet(set);
    if (onlySubjectName) {
      subs = subs.filter((s) => s.name.toLowerCase() === onlySubjectName.toLowerCase());
      if (subs.length === 0) return;
    }
    setRunnerSet(set);
    setRunnerCategory(onlySubjectName || "");
    setSubjects(subs);
    setSectionIndex(0);
    setAnswers({});
    setLockedSections(new Set());
    setRemainingSeconds(subs[0].seconds);
    setResults(null);
    setReviewVisible(false);
    setScreen("runner");
  };

  // ── Section timer: ticks every second while a timed set is running ──
  useEffect(() => {
    if (screen !== "runner") return;
    if (!runnerSet || runnerSet.duration <= 0) return; // untimed set — no countdown
    if (remainingSeconds <= 0) return;
    const t = setTimeout(() => setRemainingSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, runnerSet, remainingSeconds]);

  // ── Time's up: locks the current section and auto-advances (or finishes) ──
  useEffect(() => {
    if (screen !== "runner") return;
    if (!runnerSet || runnerSet.duration <= 0) return;
    if (remainingSeconds !== 0) return;
    const subj = subjects[sectionIndex];
    if (!subj) return;
    setLockedSections((prev) => (prev.has(subj.name) ? prev : new Set(prev).add(subj.name)));
    setToast(`Time's up for ${subj.name}! Moving to the next section…`);
    const isLast = sectionIndex === subjects.length - 1;
    const t = setTimeout(() => {
      setToast("");
      if (isLast) {
        finishQuiz();
      } else {
        setSectionIndex(sectionIndex + 1);
        setRemainingSeconds(subjects[sectionIndex + 1].seconds);
      }
    }, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, screen, runnerSet]);

  const currentSubject = subjects[sectionIndex];
  const currentLocked = currentSubject ? lockedSections.has(currentSubject.name) : false;

  const handleSelectOption = (qid, idx) => {
    if (currentLocked) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const handleNextSection = () => {
    if (!currentSubject) return;
    setLockedSections((prev) => new Set(prev).add(currentSubject.name));
    if (sectionIndex < subjects.length - 1) {
      const nextIdx = sectionIndex + 1;
      setSectionIndex(nextIdx);
      setRemainingSeconds(subjects[nextIdx].seconds);
    } else {
      finishQuiz();
    }
  };

  function finishQuiz() {
    if (currentSubject) setLockedSections((prev) => new Set(prev).add(currentSubject.name));

    let obtained = 0,
      total = 0,
      correctCount = 0,
      answeredCount = 0;
    const perSubject = subjects.map((subject) => {
      let subObtained = 0,
        subTotal = 0,
        subCorrect = 0;
      subject.questions.forEach((q) => {
        const marks = Number(q.marks ?? 1);
        const negativeMarks = Number(q.negativeMarks ?? 0);
        subTotal += marks;
        const picked = answers[String(q.id)];
        if (picked === undefined) return;
        answeredCount++;
        if (picked === Number(q.correctAnswer)) {
          subObtained += marks;
          subCorrect++;
        } else {
          subObtained -= negativeMarks;
        }
      });
      obtained += subObtained;
      total += subTotal;
      correctCount += subCorrect;
      return { name: subject.name, obtained: subObtained, total: subTotal, correct: subCorrect, count: subject.questions.length };
    });

    const totalQuestions = subjects.reduce((n, s) => n + s.questions.length, 0);
    setResults({ obtained, total, correctCount, answeredCount, totalQuestions, perSubject });
    setModalOpen(true);
  }

  const cancelModal = () => {
    setModalOpen(false);
    setScreen("sets");
    setRunnerSet(null);
  };

  const loadLeaderboard = async (category, quizSetId) => {
    setLbStatus("loading");
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      else params.set("quizSetId", quizSetId);
      const res = await fetch(`${API_BASE}${LEADERBOARD_ENDPOINT}?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load leaderboard");
      const rows = data.leaderboard || [];
      setLbRows(rows);
      setLbTitle(category || data.setTitle || "");
      setLbStatus(rows.length ? "ready" : "empty");
    } catch (err) {
      console.error(err);
      setLbStatus("error");
      setLbRows([]);
    }
  };

  const loadMyAttempts = async (category, quizSetId, forEmail) => {
    setMyAttemptsStatus("loading");
    try {
      const params = new URLSearchParams();
      params.set("email", forEmail);
      if (category) params.set("category", category);
      else params.set("quizSetId", quizSetId);
      const res = await fetch(`${API_BASE}${MY_ATTEMPTS_ENDPOINT}?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load your attempts");
      // Backend returns newest-first; show oldest -> newest so "Attempt 1, 2, 3…" reads as a timeline.
      const rows = [...(data.attempts || [])].reverse();
      setMyAttemptsRows(rows);
      setMyAttemptsTitle(category || data.setTitle || "");
      setMyAttemptsStatus(rows.length ? "ready" : "empty");
    } catch (err) {
      console.error(err);
      setMyAttemptsStatus("error");
      setMyAttemptsRows([]);
    }
  };

  const confirmSubmit = async () => {
    let ok = true;
    if (!isValidEmail(email)) {
      setEmailInvalid(true);
      ok = false;
    } else setEmailInvalid(false);
    if (!isValidMobile(mobile)) {
      setMobileInvalid(true);
      ok = false;
    } else setMobileInvalid(false);
    if (!ok) return;

    setSubmitting(true);
    setSubmitError("");

    const questionIds = subjects.flatMap((s) => s.questions.map((q) => q.id));
    const answerList = Object.entries(answers).map(([questionId, selectedIndex]) => ({ questionId, selectedIndex }));
    const payload = {
      email,
      mobile,
      quizSetId: runnerSet.id,
      category: runnerCategory || "",
      questionIds,
      answers: answerList,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_BASE}${SUBMIT_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSubmittedEmail(email);
        setModalOpen(false);
        setScreen("results");
        loadLeaderboard(runnerCategory, runnerSet.id);
        loadMyAttempts(runnerCategory, runnerSet.id, email);
      } else {
        throw new Error(data.message || "Submit failed");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Couldn't submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const backToSets = () => {
    setScreen("sets");
    setRunnerSet(null);
    setResults(null);
  };

  // ── Screen: Sets ──
  if (screen === "sets") {
    return (
      <div id="fqSetsScreen">
        <div className="section-header">
          <span className="section-tag">Free Quiz</span>
          <h2>{categoryParam ? `Free Quiz — ${categoryParam}` : "Choose a Set"}</h2>
          <div className="divider"></div>
          {categoryParam && (
            <p style={{ color: "var(--text-gray)", marginTop: "0.5rem" }}>
              Showing sets with {categoryParam} questions — timed for just this section.
            </p>
          )}
        </div>

        {(loadStatus === "loading") && (
          <div className="qb-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading sets…</p>
          </div>
        )}

        {loadStatus === "error" && (
          <div className="qb-state">
            <i className="fas fa-triangle-exclamation"></i>
            <p>Couldn't load Free Quiz sets. Please refresh the page or try again later.</p>
          </div>
        )}

        {loadStatus === "ready" && !categoryParam && sets.length === 0 && (
          <div className="qb-state">
            <i className="fas fa-gift"></i>
            <p>No Free Quiz sets are available yet. Check back soon!</p>
          </div>
        )}

        {loadStatus === "ready" && !categoryParam && sets.length > 0 && (
          <div className="qb-tile-grid">
            {sets.map((set) => {
              const subs = subjectsInSet(set);
              return (
                <SetTile
                  key={set.id}
                  title={set.title}
                  questionCount={`${set.questions.length} question${set.questions.length === 1 ? "" : "s"} across ${subs.length} subject${subs.length === 1 ? "" : "s"}`}
                  durationLabel={
                    set.duration > 0 ? (
                      <span className="qb-tile-duration">
                        <i className="fas fa-stopwatch"></i> {set.duration} min total
                      </span>
                    ) : (
                      <span className="qb-tile-duration untimed">
                        <i className="fas fa-infinity"></i> Untimed
                      </span>
                    )
                  }
                  subjectTags={subs.map((s) => s.name)}
                  onStart={() => startRunner(set)}
                />
              );
            })}
          </div>
        )}

        {loadStatus === "ready" && categoryParam && filteredMatches && filteredMatches.length === 0 && (
          <div className="qb-state">
            <i className="fas fa-gift"></i>
            <p>No {categoryParam} questions in a Free Quiz set yet. Check back soon!</p>
          </div>
        )}

        {loadStatus === "ready" && categoryParam && filteredMatches && filteredMatches.length > 0 && (
          <div className="qb-tile-grid">
            {filteredMatches.map(({ set, section }) => (
              <SetTile
                key={set.id}
                title={set.title}
                questionCount={`${section.questions.length} question${section.questions.length === 1 ? "" : "s"}`}
                durationLabel={
                  section.seconds > 0 ? (
                    <span className="qb-tile-duration">
                      <i className="fas fa-stopwatch"></i> {Math.round(section.seconds / 60)} min
                    </span>
                  ) : (
                    <span className="qb-tile-duration untimed">
                      <i className="fas fa-infinity"></i> Untimed
                    </span>
                  )
                }
                subjectTags={[section.name]}
                onStart={() => startRunner(set, section.name)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Screen: Runner ──
  if (screen === "runner" && runnerSet && currentSubject) {
    const isLast = sectionIndex === subjects.length - 1;
    return (
      <div id="fqRunnerScreen">
        {toast && (
          <div className="fq-toast">
            <i className="fas fa-circle-info"></i> {toast}
          </div>
        )}
        <div className="fq-runner-bar">
          <div>
            <div className="fq-runner-title">{runnerSet.title}</div>
            <div className="fq-runner-sub">
              Section {sectionIndex + 1} of {subjects.length}: {currentSubject.name} ({currentSubject.questions.length} question
              {currentSubject.questions.length === 1 ? "" : "s"})
            </div>
            <div className="fq-sections" style={{ marginTop: "8px" }}>
              {subjects.map((s, i) => (
                <span key={s.name} className={`fq-section-pill${i < sectionIndex ? " done" : i === sectionIndex ? " active" : ""}`}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div className={`fq-timer${runnerSet.duration <= 0 ? " untimed" : remainingSeconds <= 30 ? " low" : ""}`}>
              <i className="fas fa-stopwatch"></i> <span>{runnerSet.duration <= 0 ? "Untimed" : formatMMSS(remainingSeconds)}</span>
            </div>
            <div className="fq-runner-actions">
              {!isLast && (
                <button type="button" className="fq-btn fq-btn-next" onClick={handleNextSection}>
                  Next Section <i className="fas fa-arrow-right"></i>
                </button>
              )}
              {isLast && (
                <button type="button" className="fq-btn fq-btn-finish" onClick={finishQuiz}>
                  Finish Quiz <i className="fas fa-flag-checkered"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        <div>
          {currentSubject.questions.map((q, idx) => (
            <RunnerQuestionCard
              key={q.id}
              q={q}
              num={idx + 1}
              locked={currentLocked}
              selected={answers[String(q.id)]}
              onSelect={handleSelectOption}
            />
          ))}
        </div>

        <div className={`qb-modal-overlay${modalOpen ? " open" : ""}`}>
          <div className="qb-modal">
            <h3>Almost there!</h3>
            <p className="sub">Enter your details to see your results. Both fields are required.</p>
            <div className="qb-field">
              <label htmlFor="modalEmail">
                Email <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="email"
                id="modalEmail"
                placeholder="you@example.com"
                autoComplete="email"
                className={emailInvalid ? "invalid" : ""}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className={`err${emailInvalid ? " show" : ""}`}>Please enter a valid email address.</div>
            </div>
            <div className="qb-field">
              <label htmlFor="modalMobile">
                Mobile number <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="tel"
                id="modalMobile"
                placeholder="10-digit mobile number"
                autoComplete="tel"
                maxLength={15}
                className={mobileInvalid ? "invalid" : ""}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <div className={`err${mobileInvalid || submitError ? " show" : ""}`}>
                {submitError || "Please enter a valid 10-digit mobile number."}
              </div>
            </div>
            <div className="qb-modal-actions">
              <button type="button" className="qb-btn-cancel" onClick={cancelModal}>
                Cancel
              </button>
              <button type="button" className="qb-btn-confirm" disabled={submitting} onClick={confirmSubmit}>
                <i className={`fas ${submitting ? "fa-spinner fa-spin" : "fa-check"}`}></i> {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Screen: Results ──
  if (screen === "results" && results) {
    const { obtained, total, correctCount, answeredCount, totalQuestions, perSubject } = results;
    const pct = total > 0 ? Math.max(0, Math.round((obtained / total) * 100)) : 0;
    const myMasked = maskEmailForCompare(submittedEmail);

    return (
      <div id="fqResultsScreen">
        <div className="qb-results-cards-row">
        <div className="qb-result">
          <div className="qb-result-icon">
            <i className="fas fa-circle-check"></i>
          </div>
          <div className="qb-result-score">
            {obtained.toFixed(2)} / {total.toFixed(2)} marks
          </div>
          <div className="qb-result-pct">{pct}%</div>
          <p>
            {correctCount} correct out of {answeredCount} answered ({totalQuestions} question{totalQuestions === 1 ? "" : "s"} total)
          </p>
        </div>

        <div className="fq-breakdown">
          <div style={{ fontWeight: 700, color: "#1a2b4a", marginBottom: "10px" }}>Section-wise score</div>
          {perSubject.map((s) => (
            <div className="fq-breakdown-row" key={s.name}>
              <span className="fq-breakdown-subject">
                {s.name} <span style={{ fontWeight: 400, color: "#6c757d" }}>({s.correct}/{s.count})</span>
              </span>
              <span className="fq-breakdown-score">
                {s.obtained.toFixed(2)} / {s.total.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        </div>

        <div className="fq-result-actions">
          {!reviewVisible && (
            <button type="button" className="fq-btn fq-btn-next" onClick={() => setReviewVisible(true)}>
              <i className="fas fa-eye"></i> Review Answers
            </button>
          )}
          <button type="button" className="fq-btn fq-btn-finish" onClick={backToSets}>
            <i className="fas fa-rotate-right"></i> Choose Another Set
          </button>
        </div>

        <div className="qb-results-cards-row">
        <div className="qb-leaderboard">
          <div className="qb-leaderboard-title">
            <i className="fas fa-trophy"></i> Leaderboard{lbStatus === "ready" && lbTitle ? ` — ${lbTitle}` : ""}
          </div>
          {lbStatus === "loading" && <div className="qb-leaderboard-loading">Loading leaderboard…</div>}
          {lbStatus === "error" && <div className="qb-leaderboard-empty">Couldn't load the leaderboard right now.</div>}
          {lbStatus === "empty" && <div className="qb-leaderboard-empty">No attempts yet — be the first to top this leaderboard!</div>}
          {lbStatus === "ready" &&
            lbRows.map((row) => (
              <div className={`qb-lb-row${myMasked && row.displayName === myMasked ? " mine" : ""}`} key={`${row.rank}-${row.displayName}`}>
                <span className="qb-lb-rank">#{row.rank}</span>
                <span className="qb-lb-name">
                  {row.displayName}
                  {myMasked && row.displayName === myMasked ? " (you)" : ""}
                </span>
                <span className="qb-lb-score">
                  {Number(row.score).toFixed(2)} / {Number(row.total).toFixed(2)}
                </span>
                <span className="qb-lb-pct">{row.percentage}%</span>
              </div>
            ))}
        </div>

        <div className="qb-leaderboard">
          <div className="qb-leaderboard-title">
            <i className="fas fa-chart-line"></i> Your Attempts{myAttemptsStatus === "ready" && myAttemptsTitle ? ` — ${myAttemptsTitle}` : ""}
          </div>
          {myAttemptsStatus === "loading" && <div className="qb-leaderboard-loading">Loading your attempts…</div>}
          {myAttemptsStatus === "error" && <div className="qb-leaderboard-empty">Couldn't load your attempts right now.</div>}
          {myAttemptsStatus === "empty" && <div className="qb-leaderboard-empty">No past attempts found for this email yet.</div>}
          {myAttemptsStatus === "ready" &&
            (() => {
              const scores = myAttemptsRows.map((r) => Number(r.percentage) || 0);
              const best = Math.max(...scores);
              const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
              return (
                <>
                  <div style={{ display: "flex", gap: "1.5rem", marginBottom: "12px", fontSize: "0.85rem", color: "#6c757d" }}>
                    <span>
                      <strong style={{ color: "#1a2b4a" }}>{myAttemptsRows.length}</strong> attempt{myAttemptsRows.length === 1 ? "" : "s"}
                    </span>
                    <span>
                      Best: <strong style={{ color: "#1a2b4a" }}>{best.toFixed(0)}%</strong>
                    </span>
                    <span>
                      Average: <strong style={{ color: "#1a2b4a" }}>{avg.toFixed(0)}%</strong>
                    </span>
                  </div>
                  {myAttemptsRows.map((row, i) => {
                    const isCurrent = i === myAttemptsRows.length - 1;
                    const prevPct = i > 0 ? Number(myAttemptsRows[i - 1].percentage) || 0 : null;
                    const pct = Number(row.percentage) || 0;
                    const delta = prevPct === null ? null : pct - prevPct;
                    return (
                      <div className={`qb-lb-row${isCurrent ? " mine" : ""}`} key={`${row.submittedAt}-${i}`}>
                        <span className="qb-lb-rank">#{i + 1}</span>
                        <span className="qb-lb-name">
                          {formatAttemptDateTime(row.submittedAt)}
                          {isCurrent ? " (this attempt)" : ""}
                        </span>
                        <span className="qb-lb-score">
                          {Number(row.score).toFixed(2)} / {Number(row.total).toFixed(2)}
                        </span>
                        <span className="qb-lb-pct">
                          {row.percentage}%
                          {delta !== null && Math.round(delta) !== 0 && (
                            <span style={{ marginLeft: "6px", color: delta > 0 ? "#28a745" : "#dc3545", fontWeight: 700 }}>
                              <i className={`fas fa-arrow-${delta > 0 ? "up" : "down"}`}></i> {Math.abs(delta).toFixed(0)}%
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </>
              );
            })()}
        </div>
        </div>

        {reviewVisible && (
          <div>
            {subjects.map((subject) => (
              <div key={subject.name}>
                <h3 style={{ margin: "1.5rem 0 0.75rem", color: "#1a2b4a" }}>{subject.name}</h3>
                {subject.questions.map((q, idx) => (
                  <ReviewQuestionCard key={q.id} q={q} num={idx + 1} picked={answers[String(q.id)]} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
