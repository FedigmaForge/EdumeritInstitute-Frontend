"use client";

import { useEffect, useRef } from "react";

const ENROLL_URL = "https://courses.edumerits.in/";

function ExamCard({ exam }) {
  return (
    <div className="exam-card">
      <div className="exam-card-poster">
        <img
          src={exam.imageUrl}
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

export default function ExamCardScroller({ exams }) {
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
          <ExamCard exam={exam} key={exam.id} />
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
