"use client";

import { useState } from "react";

const STORIES = [
  { id: "oJevVSTUat0", name: "Aradhya Mishra", role: "Student" },
  { id: "3Nrw4LJpfvs", name: "Samarth's Parent", role: "Parent Testimonial" },
  { id: "V-4gdW5_JdA", name: "Priya Ma'am", role: "Faculty" },
];

function StoryCard({ story }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="success-story-card">
      <div className="success-story-video">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${story.id}?autoplay=1`}
            title={`${story.name} — ${story.role}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <button
            type="button"
            className="success-story-play"
            onClick={() => setPlaying(true)}
            aria-label={`Play video — ${story.name}, ${story.role}`}
          >
            <img
              src={`https://img.youtube.com/vi/${story.id}/hqdefault.jpg`}
              alt={`${story.name} — ${story.role}`}
              loading="lazy"
            />
            <span className="success-story-play-icon">
              <i className="fas fa-play"></i>
            </span>
          </button>
        )}
      </div>
      <div className="success-story-caption">
        <strong>{story.name}</strong>
        <span>{story.role}</span>
      </div>
    </div>
  );
}

export default function SuccessStories() {
  return (
    <div className="success-stories-grid">
      {STORIES.map((story) => (
        <StoryCard story={story} key={story.id} />
      ))}
    </div>
  );
}
