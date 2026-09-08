"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = "https://api.edumerits.in/api/admin/current-affairs";

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
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateString;
  }
}

function shareLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => alert("Link copied to clipboard!"))
    .catch(() => alert("Copy this URL: " + window.location.href));
}

export default function CurrentAffairDetail({ id }) {
  const [state, setState] = useState({ status: "loading", affair: null, message: "" });

  useEffect(() => {
    if (!id) {
      setState({ status: "no-id", affair: null, message: "" });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(`${API_BASE}/${id}`, { headers: { Accept: "application/json" }, signal: controller.signal });
        clearTimeout(tid);

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data = await res.json();
        if (!data || data.success !== true || !data.affair) throw new Error("Invalid API response");

        if (!cancelled) setState({ status: "ready", affair: data.affair, message: "" });
      } catch (error) {
        let msg = "Unable to load this current affair.";
        if (error.name === "AbortError") msg = "Request timed out. Please try again.";
        if (!cancelled) setState({ status: "error", affair: null, message: msg });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading current affair...</p>
      </div>
    );
  }

  if (state.status === "no-id") {
    return (
      <div className="error-state">
        <i className="fas fa-exclamation-circle" style={{ fontSize: "3rem", color: "#dc2626" }}></i>
        <h3>No affair ID provided.</h3>
        <Link href="/current-affairs" className="detail-back-btn" style={{ display: "inline-flex", marginTop: "1rem" }}>
          <i className="fas fa-arrow-left"></i> Back to list
        </Link>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="error-state">
        <i className="fas fa-exclamation-triangle" style={{ fontSize: "3rem", color: "#dc2626", marginBottom: "1rem", display: "block" }}></i>
        <h3>{state.message}</h3>
        <Link href="/current-affairs" className="detail-back-btn" style={{ display: "inline-flex", marginTop: "1rem" }}>
          <i className="fas fa-arrow-left"></i> Back to list
        </Link>
      </div>
    );
  }

  const affair = state.affair;
  const title = affair.title || "Current Affair";
  const content = affair.content || "<p>No content available.</p>";
  const youtubeUrl = affair.youtube_url || null;
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
  const dateStr = formatDate(affair.date || affair.created_at);
  const updatedStr = affair.updated_at ? formatDate(affair.updated_at) : null;

  return (
    <div className="detail-card">
      <div className="detail-date-row">
        <span className="detail-date">
          <i className="far fa-calendar-alt"></i> {dateStr}
        </span>
        {youtubeUrl && (
          <span style={{ background: "#ff0000", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600 }}>
            <i className="fab fa-youtube"></i> Video Available
          </span>
        )}
        {updatedStr && (
          <span style={{ color: "#6c757d", fontSize: "0.82rem" }}>
            <i className="fas fa-sync-alt"></i> Updated: {updatedStr}
          </span>
        )}
      </div>

      <h2 className="detail-title">{title}</h2>

      {youtubeUrl &&
        (embedUrl ? (
          <div className="detail-video-container">
            <iframe
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ff0000", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, margin: "1rem 0" }}
          >
            <i className="fab fa-youtube"></i> Watch on YouTube
          </a>
        ))}

      <div className="detail-content" dangerouslySetInnerHTML={{ __html: content }}></div>

      <div className="detail-footer-actions">
        <Link href="/current-affairs" className="detail-back-btn">
          <i className="fas fa-arrow-left"></i> Back to list
        </Link>
        <a href="#" className="btn-download" onClick={(e) => { e.preventDefault(); alert("PDF download coming soon."); }}>
          <i className="fas fa-download"></i> Download PDF
        </a>
        <button
          onClick={shareLink}
          style={{ background: "none", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "30px", cursor: "pointer", fontSize: "0.85rem" }}
        >
          <i className="fas fa-share-alt"></i> Share
        </button>
      </div>
    </div>
  );
}
