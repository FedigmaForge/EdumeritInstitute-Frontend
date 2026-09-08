"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

function getYouTubeId(url) {
  if (!url) return null;
  const m =
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/[?&]v=([^&]+)/) ||
    url.match(/embed\/([^?]+)/) ||
    url.match(/\/live\/([^?]+)/);
  return m ? m[1] : null;
}

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function CurrentAffairCard({ affair }) {
  const videoId = getYouTubeId(affair.youtube_url);
  return (
    <Link href={`/current-affairs/${affair.id}`} className="ca-video-card">
      <div className="ca-video-thumb">
        {videoId ? (
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={affair.title || "Current affairs video"}
            loading="lazy"
          />
        ) : (
          <div className="ca-video-thumb-fallback">
            <i className="fas fa-newspaper"></i>
          </div>
        )}
        {videoId && (
          <span className="ca-video-play">
            <i className="fas fa-play"></i>
          </span>
        )}
      </div>
      <div className="ca-video-body">
        <span className="ca-video-date">
          <i className="far fa-calendar-alt"></i> {formatDate(affair.date || affair.created_at)}
        </span>
        <h4>{affair.title || "Current Affairs Update"}</h4>
      </div>
    </Link>
  );
}

export default function CurrentAffairsScroller({ affairs }) {
  const trackRef = useRef(null);
  const autoScrollRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      if (pausedRef.current) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollLeft += 1;
      }
    };

    autoScrollRef.current = setInterval(step, 20);
    return () => clearInterval(autoScrollRef.current);
  }, [affairs]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <div className="ca-scroller" onMouseEnter={pause} onMouseLeave={resume}>
      <button className="ca-scroller-arrow prev" onClick={() => scroll(-1)} onFocus={pause} onBlur={resume} aria-label="Scroll left">
        <i className="fas fa-chevron-left"></i>
      </button>
      <div className="ca-scroller-track" ref={trackRef} onTouchStart={pause} onTouchEnd={resume}>
        {affairs.map((affair) => (
          <CurrentAffairCard affair={affair} key={affair.id} />
        ))}
      </div>
      <button className="ca-scroller-arrow next" onClick={() => scroll(1)} onFocus={pause} onBlur={resume} aria-label="Scroll right">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}
