"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "https://api.edumerits.in/api/admin/current-affairs";
const QUIZ_API_URL = "https://api.edumerits.in/api/admin/quiz/all";
const API_BASE = "https://api.edumerits.in";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  let videoId = null;
  if (url.includes("youtu.be/")) {
    const m = url.match(/youtu\.be\/([^?]+)/);
    if (m) videoId = m[1];
  } else if (url.includes("youtube.com/watch")) {
    const m = url.match(/[?&]v=([^&]+)/);
    if (m) videoId = m[1];
  } else if (url.includes("youtube.com/embed/")) {
    const m = url.match(/embed\/([^?]+)/);
    if (m) videoId = m[1];
  } else if (url.includes("youtube.com/live/")) {
    const m = url.match(/\/live\/([^?]+)/);
    if (m) videoId = m[1];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&modestbranding=1&fs=1` : null;
}

function formatDate(dateString) {
  if (!dateString) return "Date not available";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateString;
  }
}

function getTextPreview(htmlContent) {
  if (!htmlContent) return "No content available";
  if (typeof document === "undefined") return "";
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  const text = (div.textContent || div.innerText || "").trim();
  return text.substring(0, 200) + (text.length > 200 ? "..." : "");
}

function copyAffairLink(id) {
  const url = window.location.origin + "/current-affairs/" + id;
  navigator.clipboard
    .writeText(url)
    .then(() => alert("Link copied to clipboard!"))
    .catch(() => alert("Copy this URL: " + url));
}

// Admins tag each day's quiz questions with category = "Current Affairs" and
// type that day's date into the Sub Topic field, e.g. "31-07-2026"
// (DD-MM-YYYY). This matches those to each affair card by date so only that
// day's questions show up under that day's card ("Test Yourself").

// "31-07-2026" -> "2026-07-31" (also accepts single-digit day/month).
function parseSubTopicDateKey(subTopic) {
  const m = String(subTopic || "").trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

// Reads UTC fields specifically, since MySQL DATE columns come back as
// UTC-midnight ISO strings — using local getters here could roll the date
// back a day for visitors west of UTC.
function parseAffairDateKey(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const y = date.getUTCFullYear();
  const mo = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

function getQuizYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Fetches every question tagged category = "Current Affairs" and groups
// them by their Sub Topic date. Never throws — a failure here just means no
// quiz sections render; it shouldn't block the affairs themselves.
async function fetchDailyQuizByDate() {
  try {
    const res = await fetch(QUIZ_API_URL, { headers: { Accept: "application/json" } });
    const data = await res.json();
    if (!res.ok || !data || data.success !== true || !Array.isArray(data.quizzes)) return new Map();

    const map = new Map();
    data.quizzes
      .filter((q) => (q.category || "").trim().toLowerCase() === "current affairs")
      .forEach((q) => {
        const key = parseSubTopicDateKey(q.subTopic);
        if (!key) return;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(q);
      });
    return map;
  } catch (err) {
    console.error("Failed to load daily current affairs quiz questions:", err);
    return new Map();
  }
}

function AffairQuizCard({ q, num }) {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState(null);
  const correct = Number(q.correctAnswer);
  const diff = (q.difficulty || "medium").toLowerCase();
  const ytId = getQuizYouTubeId(q.youtubeLink);
  const correctLetter = String.fromCharCode(65 + correct);

  return (
    <div className={`qb-card${revealed ? " revealed" : ""}`}>
      <div className="qb-head">
        <span className="qb-num">Q{num}.</span>
        <span className={`qb-badge ${diff}`}>{diff}</span>
        <span className="qb-q">{q.question}</span>
      </div>
      <div className="qb-options">
        {(q.options || []).map((opt, i) => (
          <div key={i} className={`qb-opt ${i === correct ? "correct" : ""} ${selected === i ? "selected" : ""}`} onClick={() => setSelected(i)}>
            <span className="qb-letter">{String.fromCharCode(65 + i)}</span>
            <span>{opt}</span>
            {i === correct && <i className="fas fa-check-circle qb-check"></i>}
          </div>
        ))}
      </div>
      <button type="button" className="qb-reveal-btn" onClick={() => setRevealed((v) => !v)}>
        <i className={`fas ${revealed ? "fa-eye-slash" : "fa-eye"}`}></i> {revealed ? "Hide Answer" : "View Answer"}
      </button>
      <div className="qb-answer">
        <div className="qb-expl">
          <strong>
            <i className="fas fa-circle-check"></i> Correct answer: {correctLetter}
          </strong>
          {q.explanation && (
            <div style={{ marginTop: "6px" }}>
              <strong>Explanation:</strong> {q.explanation}
            </div>
          )}
        </div>
        {(q.pdfUrl || (q.youtubeLink && ytId)) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "0.75rem" }}>
            {q.pdfUrl && (
              <a
                href={`${API_BASE}${q.pdfUrl}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", background: "#fff5f5", border: "1.5px solid #dc3545", color: "#dc3545" }}
              >
                <i className="fas fa-file-pdf"></i> View PDF Solution
              </a>
            )}
            {q.youtubeLink && ytId && (
              <a
                href={q.youtubeLink}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", background: "#fff5f5", border: "1.5px solid #ff0000", color: "#cc0000" }}
              >
                <i className="fab fa-youtube"></i> Watch Solution
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AffairQuizSection({ questions }) {
  if (!questions || questions.length === 0) return null;
  return (
    <div className="affair-quiz-section">
      <div className="affair-quiz-section-title">
        <i className="fas fa-pen-to-square"></i> Test Yourself
        <span className="qcount">
          {questions.length} question{questions.length === 1 ? "" : "s"}
        </span>
      </div>
      {questions.map((q, i) => (
        <AffairQuizCard key={q.id ?? i} q={q} num={i + 1} />
      ))}
    </div>
  );
}

export default function CurrentAffairsList() {
  const [state, setState] = useState({ status: "loading", affairs: [], message: "" });
  const [quizByDate, setQuizByDate] = useState(new Map());

  const fetchAffairs = async () => {
    setState({ status: "loading", affairs: [], message: "" });
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 15000);
      const [res, quizMap] = await Promise.all([
        fetch(API_URL, { headers: { Accept: "application/json" }, signal: controller.signal }),
        fetchDailyQuizByDate(),
      ]);
      clearTimeout(tid);

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      if (!data || data.success !== true || !Array.isArray(data.affairs)) throw new Error("Invalid API response structure");

      setQuizByDate(quizMap);
      setState({ status: "ready", affairs: data.affairs, message: "" });
    } catch (error) {
      let msg = "Unable to load current affairs.";
      if (error.name === "AbortError") msg = "Request timed out. Check your connection and try again.";
      else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) msg = "Network error: Cannot reach the API server.";
      else msg += " " + error.message;
      setState({ status: "error", affairs: [], message: msg });
    }
  };

  useEffect(() => {
    fetchAffairs();
  }, []);

  return (
    <div className="affairs-content">
      <div className="affairs-section-header">
        <h2>
          <i className="fas fa-newspaper"></i>
          Current Affairs
          <span className="api-badge">
            <i className="fas fa-sync-alt"></i> Live
          </span>
          {state.status === "ready" && (
            <span className="affairs-count-badge">
              {state.affairs.length} Article{state.affairs.length !== 1 ? "s" : ""}
            </span>
          )}
        </h2>
        <button
          onClick={fetchAffairs}
          style={{ background: "#0a1f44", color: "white", border: "none", padding: "8px 18px", borderRadius: "30px", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      <div className="affairs-grid">
        {state.status === "loading" && (
          <div className="loading-card">
            <div className="spinner"></div>
            <p>Fetching latest current affairs from server...</p>
          </div>
        )}

        {state.status === "error" && (
          <div className="error-card">
            <i className="fas fa-exclamation-triangle" style={{ fontSize: "3rem", color: "#dc2626" }}></i>
            <h3>Unable to Fetch Live Data</h3>
            <p>{state.message}</p>
            <button
              onClick={fetchAffairs}
              style={{ marginTop: "15px", background: "#0a1f44", color: "white", border: "none", padding: "10px 24px", borderRadius: "30px", cursor: "pointer" }}
            >
              <i className="fas fa-sync-alt"></i> Retry
            </button>
          </div>
        )}

        {state.status === "ready" && state.affairs.length === 0 && (
          <div className="error-card">
            <i className="fas fa-info-circle" style={{ fontSize: "3rem", color: "#f59e0b" }}></i>
            <h3>No Current Affairs Available</h3>
            <p>There are no entries at the moment. Please check back later.</p>
          </div>
        )}

        {state.status === "ready" &&
          state.affairs.map((affair) => {
            const id = affair.id || 0;
            const title = affair.title || "Current Affairs Update";
            const displayDate = formatDate(affair.date || affair.created_at);
            const youtubeUrl = affair.youtube_url || null;
            const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
            const updatedAt = affair.updated_at ? formatDate(affair.updated_at) : null;
            const affairDateKey = parseAffairDateKey(affair.date || affair.created_at);
            const dayQuestions = affairDateKey ? quizByDate.get(affairDateKey) || [] : [];

            return (
              <div className="affair-card" key={id}>
                <div className="affair-date">
                  <i className="far fa-calendar-alt"></i> {displayDate}
                  {youtubeUrl && (
                    <span style={{ marginLeft: "8px", background: "#ff0000", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem" }}>
                      <i className="fab fa-youtube"></i> Video
                    </span>
                  )}
                </div>
                <h4>{title}</h4>
                {youtubeUrl &&
                  (embedUrl ? (
                    <div className="affair-video-container">
                      <iframe
                        src={embedUrl}
                        title={`YouTube – ${title}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <a href={youtubeUrl} target="_blank" rel="noreferrer" className="affair-youtube">
                      <i className="fab fa-youtube"></i> Watch on YouTube
                    </a>
                  ))}
                <div className="affair-content-preview">
                  <p>{getTextPreview(affair.content || "")}</p>
                </div>
                {updatedAt && (
                  <small style={{ display: "block", marginTop: "8px", color: "#6c757d" }}>
                    <i className="fas fa-sync-alt"></i> Updated: {updatedAt}
                  </small>
                )}
                <div style={{ marginTop: "15px", borderTop: "1px solid #e2e8f0", paddingTop: "12px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <Link href={`/current-affairs/${id}`} className="btn-full-content">
                    <i className="fas fa-book-open"></i> Read Full Content
                  </Link>
                  <a href="#" className="btn-download" onClick={(e) => { e.preventDefault(); alert("PDF download coming soon."); }}>
                    <i className="fas fa-download"></i> Download PDF
                  </a>
                  <button
                    onClick={() => copyAffairLink(id)}
                    style={{ background: "none", border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: "30px", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    <i className="fas fa-share-alt"></i> Share
                  </button>
                </div>
                <AffairQuizSection questions={dayQuestions} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
