"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SLIDES = [
  {
    image: "/banners/ibps-po-2026.webp",
    alt: "Mission IBPS PO 2026 Batch — Prelims, Mains and combined pricing",
    href: "https://courses.edumerits.in/",
  },
  {
    image: "/banners/ibps-sbi-clerk-2026.webp",
    alt: "IBPS and SBI Clerk 2026 Batch — lowest price ever",
    href: "https://courses.edumerits.in/",
  },
  {
    image: "/banners/nicl-assistant-2026.webp",
    alt: "NICL Assistant Selection 2026 Batch pricing",
    href: "https://courses.edumerits.in/",
  },
  {
    image: "/banners/banking-mock-test.webp",
    alt: "Banking Mock Test — practice, analyze, improve",
    href: "/quiz",
    internal: true,
  },
  {
    image: "/banners/current-affairs.webp",
    alt: "Daily Current Affairs for Competitive Exams — stay ahead, stay updated",
    href: "/current-affairs",
    internal: true,
  },
];

export default function HeroBannerCarousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 4000);
  };
  const stop = () => clearInterval(intervalRef.current);

  useEffect(() => {
    start();
    return stop;
  }, []);

  const goTo = (index) => setCurrent((index + SLIDES.length) % SLIDES.length);

  return (
    <div className="hero-banner-carousel" onMouseEnter={stop} onMouseLeave={start}>
      <div className="hero-banner-track">
        {SLIDES.map((slide, index) => {
          const className = `hero-banner-slide${index === current ? " active" : ""}`;
          if (slide.internal) {
            return (
              <Link key={slide.image} href={slide.href} className={className}>
                <img src={slide.image} alt={slide.alt} />
              </Link>
            );
          }
          return (
            <a key={slide.image} href={slide.href} target="_blank" rel="noreferrer" className={className}>
              <img src={slide.image} alt={slide.alt} />
            </a>
          );
        })}
      </div>
      <button className="hero-banner-arrow prev" onClick={() => goTo(current - 1)} aria-label="Previous batch">
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="hero-banner-arrow next" onClick={() => goTo(current + 1)} aria-label="Next batch">
        <i className="fas fa-chevron-right"></i>
      </button>
      <div className="hero-banner-dots">
        {SLIDES.map((slide, index) => (
          <span
            key={slide.image}
            className={`hero-banner-dot${index === current ? " active" : ""}`}
            onClick={() => goTo(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
