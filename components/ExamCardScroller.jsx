"use client";

import { useEffect, useRef, useState } from "react";

const EXAMS_API = "https://api.edumerits.in/api/admin/exams";
const IMAGE_BASE = "https://api.edumerits.in";
const EXAM_ORDER = ["IBPS PO", "SBI PO", "IBPS and SBI Clerk", "NICL"];
const TYPE_ORDER = ["Preliminary Examination", "Main Examination", "Preliminary & Main"];

// The site is a static export, so the exam list baked in at build time goes stale
// (re-uploaded cover photos get new filenames and the old ones 404). We refetch
// the live list in the browser and only use the build-time data as a first paint.
async function fetchLiveExams(signal) {
  const res = await fetch(`${EXAMS_API}?t=${Date.now()}`, { signal, cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.success || !Array.isArray(data.exams)) return null;
  return [...data.exams]
    .sort((a, b) => {
      const examDiff = EXAM_ORDER.indexOf(a.examName) - EXAM_ORDER.indexOf(b.examName);
      if (examDiff !== 0) return examDiff;
      return TYPE_ORDER.indexOf(a.examType) - TYPE_ORDER.indexOf(b.examType);
    })
    .map((exam) => ({
      ...exam,
      imageUrl: exam.coverPhoto ? `${IMAGE_BASE}${exam.coverPhoto}` : null,
    }));
}

const ENROLL_URL = "https://courses.edumerits.in/";

function ExamCard({ exam }) {
  return (
    <div className="exam-card">
      <div className="exam-card-poster">
        <img
          src={exam.imageUrl || undefined}
          alt={`${exam.examName} — ${exam.examType}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling.style.display = "flex";
          }}
        />
        <div className="exam-card-poster-fallback">
          <i className="fas fa-university"></i>
        </div>
      </div>
      <div className="exam-card-body">
        <span className="exam-card-type">{exam.examType}</span>
        <h4>{exam.examName}</h4>
        <div className="exam-card-price-row">
          <span className="exam-card-price">₹{exam.price}</span>
        </div>
        <a href={ENROLL_URL} target="_blank" rel="noreferrer" className="exam-card-btn">
          Enroll Now <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  );
}

export default function ExamCardScroller({ exams: initialExams }) {
  const [exams, setExams] = useState(initialExams);

  useEffect(() => {
    const controller = new AbortController();
    fetchLiveExams(controller.signal)
      .then((live) => {
        if (live && live.length > 0) setExams(live);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

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
  }, [exams]);

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
    <div className="exam-scroller" onMouseEnter={pause} onMouseLeave={resume}>
      <button
        className="exam-scroller-arrow prev"
        onClick={() => scroll(-1)}
        onFocus={pause}
        onBlur={resume}
        aria-label="Scroll left"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <div
        className="exam-scroller-track"
        ref={trackRef}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        {exams.map((exam) => (
          <ExamCard exam={exam} key={`${exam.id}-${exam.imageUrl}`} />
        ))}
      </div>
      <button
        className="exam-scroller-arrow next"
        onClick={() => scroll(1)}
        onFocus={pause}
        onBlur={resume}
        aria-label="Scroll right"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}
