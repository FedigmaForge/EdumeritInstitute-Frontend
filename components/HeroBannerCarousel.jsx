"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.edumerits.in";

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url}`;
};

const FALLBACK_SLIDES = [
  {
    id: "1",
    image: "/banners/ibps-po-2026.webp",
    alt: "Mission IBPS PO 2026 Batch — Prelims, Mains and combined pricing",
    href: "https://courses.edumerits.in/",
    internal: false,
  },
  {
    id: "2",
    image: "/banners/ibps-sbi-clerk-2026.webp",
    alt: "IBPS and SBI Clerk 2026 Batch — lowest price ever",
    href: "https://courses.edumerits.in/",
    internal: false,
  },
  {
    id: "3",
    image: "/banners/nicl-assistant-2026.webp",
    alt: "NICL Assistant Selection 2026 Batch pricing",
    href: "https://courses.edumerits.in/",
    internal: false,
  },
  {
    id: "4",
    image: "/banners/banking-mock-test.webp",
    alt: "Banking Mock Test — practice, analyze, improve",
    href: "/quiz",
    internal: true,
  },
  {
    id: "5",
    image: "/banners/current-affairs.webp",
    alt: "Daily Current Affairs for Competitive Exams — stay ahead, stay updated",
    href: "/current-affairs",
    internal: true,
  },
];

export default function HeroBannerCarousel() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  // Fetch dynamic banners from admin API for site=edumerits
  useEffect(() => {
    let active = true;

    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/banners?site=edumerits`);
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;

        if (data?.success && data.banners) {
          const ordered = Object.keys(data.banners)
            .sort((a, b) => Number(a) - Number(b))
            .map((id, index) => {
              const b = data.banners[id];
              if (!b || !b.imageUrl) return null;

              const fallback = FALLBACK_SLIDES[index] || FALLBACK_SLIDES[0];

              let href = fallback?.href || "https://courses.edumerits.in/";
              let internal = Boolean(fallback?.internal);

              // If subtitle or link is configured as a URL/path, use it as destination
              if (b.subtitle && b.subtitle.trim() && b.subtitle.trim() !== ".") {
                const sub = b.subtitle.trim();
                if (sub.startsWith("http://") || sub.startsWith("https://")) {
                  href = sub;
                  internal = false;
                } else if (sub.startsWith("/")) {
                  href = sub;
                  internal = true;
                }
              }

              const alt =
                b.title && b.title.trim() && b.title.trim() !== "."
                  ? b.title.trim()
                  : fallback?.alt || `EduMerit Slide ${id}`;

              return {
                id,
                image: resolveImageUrl(b.imageUrl),
                alt,
                href,
                internal,
              };
            })
            .filter(Boolean);

          if (ordered.length > 0) {
            setSlides(ordered);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic banners for edumerits, using fallback:", err);
      }
    };

    fetchBanners();
    return () => {
      active = false;
    };
  }, []);

  const count = slides.length;

  const start = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (count <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, 4000);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    start();
    return stop;
  }, [count]);

  useEffect(() => {
    if (current >= count && count > 0) {
      setCurrent(0);
    }
  }, [current, count]);

  const goTo = (index) => {
    if (count === 0) return;
    setCurrent((index + count) % count);
  };

  return (
    <div className="hero-banner-carousel" onMouseEnter={stop} onMouseLeave={start}>
      <div className="hero-banner-track">
        {slides.map((slide, index) => {
          const className = `hero-banner-slide${index === current ? " active" : ""}`;
          if (slide.internal) {
            return (
              <Link key={slide.id || slide.image} href={slide.href} className={className}>
                <img src={slide.image} alt={slide.alt} />
              </Link>
            );
          }
          return (
            <a
              key={slide.id || slide.image}
              href={slide.href}
              target="_blank"
              rel="noreferrer"
              className={className}
            >
              <img src={slide.image} alt={slide.alt} />
            </a>
          );
        })}
      </div>
      {count > 1 && (
        <>
          <button className="hero-banner-arrow prev" onClick={() => goTo(current - 1)} aria-label="Previous batch">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="hero-banner-arrow next" onClick={() => goTo(current + 1)} aria-label="Next batch">
            <i className="fas fa-chevron-right"></i>
          </button>
          <div className="hero-banner-dots">
            {slides.map((slide, index) => (
              <span
                key={slide.id || slide.image}
                className={`hero-banner-dot${index === current ? " active" : ""}`}
                onClick={() => goTo(index)}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
