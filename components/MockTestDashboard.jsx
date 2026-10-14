"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_TEST_SECTIONS as STATIC_SECTIONS, MOCK_TEST_CATALOG, seriesHref } from "./mockTestData";
import { fetchMockSections } from "./mockTestApi";

// Fallback list of pre-built exam pages when the page didn't pass one.
const STATIC_BUILT = MOCK_TEST_CATALOG.map((c) => `/mock-test/${c.sectionId}/${c.slug}/`);

// "/mock-test/full-length/sbi-po-mains-mock-test/" -> { section, slug }
const parseExamHref = (href) => {
  const m = /^\/mock-test\/([^/?#]+)\/([^/?#]+)\/?$/.exec(href || "");
  return m && m[1] !== "view" ? { section: m[1], slug: m[2] } : null;
};

export default function MockTestDashboard({ builtPages }) {
  const BUILT_PAGES = new Set(builtPages || STATIC_BUILT);
  const router = useRouter();
  const params = useSearchParams();
  // Static catalogue first (instant render), then the live list from the admin panel.
  const [MOCK_TEST_SECTIONS, setSections] = useState(STATIC_SECTIONS);
  useEffect(() => {
    let alive = true;
    fetchMockSections()
      .then((live) => { if (alive && live.length) setSections(live); })
      .catch(() => { /* keep static data */ });
    return () => { alive = false; };
  }, []);

  const sectionId = params.get("section") || MOCK_TEST_SECTIONS[0].id;
  const section = MOCK_TEST_SECTIONS.find((s) => s.id === sectionId) || MOCK_TEST_SECTIONS[0];
  const tabNames = Object.keys(section.tabs);
  const [tab, setTab] = useState(tabNames[0]);

  useEffect(() => {
    setTab((cur) => (section.tabs[cur] ? cur : Object.keys(section.tabs)[0]));
  }, [section]);

  const selectSection = (id) => {
    router.push(`/mock-test/?section=${id}`, { scroll: false });
  };

  const cards = section.tabs[tab] || [];

  return (
    <div className="mt-dash">
      <aside className="mt-sidebar">
        <div className="mt-sidebar-heading">Mock Test</div>
        <ul>
          {MOCK_TEST_SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`mt-side-link${s.id === section.id ? " active" : ""}`}
                onClick={() => selectSection(s.id)}
              >
                <i className={s.icon}></i>
                <span>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="mt-main">
        <div className="mt-title-row">
          <h2 className="mt-title">{section.title}</h2>
          <span className="mt-title-line"></span>
        </div>

        {tabNames.length > 1 && (
          <div className="mt-tabs" role="tablist">
            {tabNames.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={tab === name}
                className={`mt-tab${tab === name ? " active" : ""}`}
                onClick={() => setTab(name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-grid">
          {cards.map((c) => {
            const inner = (
              <>
                <span className="mt-card-icon" style={{ background: c.color }}>
                  {c.icon ? <i className={c.icon}></i> : <span className="mt-card-badge">{c.badge}</span>}
                  {c.live && <span className="mt-live-dot">{c.liveLabel || "LIVE"}</span>}
                </span>
                <span className="mt-card-name">{c.name}</span>
                <i className="fas fa-chevron-right mt-card-arrow"></i>
              </>
            );
            let href = c.href || seriesHref(section.id, c, tab);
            const external = /^https?:\/\//.test(href);
            // Exam page that wasn't pre-built (added in admin after the last build):
            // open the generic viewer instead, which loads it from the API.
            const exam = parseExamHref(href);
            if (exam && !BUILT_PAGES.has(`/mock-test/${exam.section}/${exam.slug}/`)) {
              href = `/mock-test/view/?section=${encodeURIComponent(exam.section)}&slug=${encodeURIComponent(exam.slug)}`;
            }
            return BUILT_PAGES.has(href) && !external ? (
              <Link key={c.slug || c.name} href={href} className="mt-card">
                {inner}
              </Link>
            ) : (
              <a key={c.slug || c.name} href={href} className="mt-card" {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {inner}
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
}
