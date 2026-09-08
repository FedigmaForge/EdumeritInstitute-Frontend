"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = "https://api.edumerits.in";
const ENDPOINT = "/api/admin/headlines/all";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

const toHeadlines = (content) =>
  String(content || "").split("\n").map((l) => l.trim()).filter(Boolean);

const fmtDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  const dd = String(date.getDate()).padStart(2, "0");
  return `${dd}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
};

function HeadlineCard({ entry, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const ytId = getYouTubeId(entry.youtubeUrl);
  const lines = toHeadlines(entry.content);
  const dateLabel = fmtDate(entry.date);
  const preview = lines[0] || "No headlines";
  const moreCount = lines.length > 1 ? lines.length - 1 : 0;

  return (
    <div className={`hl-card${open ? " open" : ""}`}>
      <div className="hl-head" onClick={() => setOpen((v) => !v)}>
        <span className="hl-head-title">Headlines of the Day {dateLabel}</span>
        <i className="fas fa-chevron-down hl-chevron"></i>
      </div>
      <div className="hl-box">
        {!open && (
          <div className="hl-preview">
            {preview}
            {moreCount > 0 && <span style={{ color: "#0b5ca8", fontWeight: 600 }}> +{moreCount} more</span>}
          </div>
        )}
        <div className="hl-full">
          <ul className="hl-list">
            {lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          {ytId && (
            <div className="hl-video">
              <iframe src={`https://www.youtube.com/embed/${ytId}`} title="Shorts" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          )}
          {ytId && (
            <div>
              <a className="hl-watch" href={entry.youtubeUrl} target="_blank" rel="noreferrer">
                <i className="fab fa-youtube"></i> Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DailyHeadlines() {
  const [status, setStatus] = useState("loading");
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}${ENDPOINT}`);
        const data = await res.json();
        setEntries(res.ok && data.success && Array.isArray(data.headlines) ? data.headlines : []);
        setStatus("ready");
      } catch (err) {
        console.error("Failed to load headlines:", err);
        setStatus("error");
      }
    })();
  }, []);

  const dates = useMemo(
    () => [...new Set(entries.map((e) => (e.date || "").slice(0, 10)).filter(Boolean))],
    [entries]
  );

  const list = selectedDate === "all" ? entries : entries.filter((e) => (e.date || "").slice(0, 10) === selectedDate);

  return (
    <div className="hl-wrap">
      <div className="hl-banner">
        <h2>Headlines of the Day</h2>
      </div>

      <div className="hl-toolbar">
        <label style={{ fontWeight: 600, color: "#222" }}>
          Date:
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            <option value="all">All</option>
            {dates.map((d) => (
              <option key={d} value={d}>
                {fmtDate(d)}
              </option>
            ))}
          </select>
        </label>
        {status === "ready" && (
          <span style={{ fontWeight: 700, color: "#444" }}>
            {list.length} day{list.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {status === "loading" && (
        <div className="hl-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading headlines…</p>
        </div>
      )}

      {status === "error" && (
        <div className="hl-state">
          <i className="fas fa-triangle-exclamation" style={{ color: "#dc3545" }}></i>
          <p>Couldn't load headlines right now.</p>
        </div>
      )}

      {status === "ready" && list.length === 0 && (
        <div className="hl-state">
          <i className="fas fa-bullhorn"></i>
          <p>No headlines available yet.</p>
        </div>
      )}

      {status === "ready" &&
        list.map((entry, idx) => <HeadlineCard entry={entry} defaultOpen={idx === 0} key={entry.id ?? idx} />)}
    </div>
  );
}
