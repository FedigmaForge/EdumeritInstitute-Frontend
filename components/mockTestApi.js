// Live Mock Test data from the admin panel ("Main Mock Test" in edumerit-admin).
// Backend: /api/admin/main-mock-test/public/* (see MainMockTestController.js /
// MainMockSeriesController.js). Everything here converts the API response into
// the same shape the static catalogue in mockTestData.js uses, so the pages
// work with either — the static data is only a fallback when the API is down.

import { MOCK_TEST_SECTIONS, MOCK_TEST_CATALOG, findSeries } from "./mockTestData";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.edumerits.in";
// ^ NEXT_PUBLIC_API_BASE is only set in .env.development.local for local testing
const BASE = `${API_BASE}/api/admin/main-mock-test/public`;

const faClass = (ic) => (!ic ? "" : /^fa[srb]?\s/.test(ic) ? ic : `fas ${ic}`);

const getJson = async (url, { timeoutMs = 8000, ...opts } = {}) => {
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    const res = await fetch(url, { ...opts, signal: ctrl?.signal });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      const err = new Error(data.message || `HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  } finally {
    if (t) clearTimeout(t);
  }
};

// Exam card href: admin-set link, else its own page.
export const cardHref = (sectionSlug, exam) =>
  exam.linkUrl || `/mock-test/${sectionSlug}/${exam.slug}/`;

// API tree -> MOCK_TEST_SECTIONS shape ({ id, label, icon, title, tabs: { Banking: [cards] } })
export function sectionsFromApi(apiSections) {
  return (apiSections || []).map((s) => {
    const card = (e) => ({
      name: e.title,
      slug: e.slug,
      badge: e.badgeType === "text" ? e.badgeText : undefined,
      icon: e.badgeType === "icon" ? faClass(e.badgeIcon) : undefined,
      color: e.badgeColor,
      live: !!e.isLive,
      liveLabel: e.liveLabel || "LIVE",
      href: cardHref(s.slug, e),
    });
    const tabs = {};
    const untabbed = s.exams.filter((e) => e.tabId === null || !s.tabs.some((t) => t.id === e.tabId));
    s.tabs.forEach((t) => {
      tabs[t.name] = [...s.exams.filter((e) => e.tabId === t.id), ...untabbed].map(card);
    });
    if (s.tabs.length === 0) tabs.All = s.exams.map(card);
    return { id: s.slug, label: s.name, icon: faClass(s.icon), title: s.pageTitle || s.name, tabs };
  });
}

export async function fetchMockSections(opts) {
  const data = await getJson(BASE, opts);
  return sectionsFromApi(data.sections);
}

// API exam page -> the "series" object MockTestSeries renders
export function seriesFromApi(d) {
  const e = d.exam;
  return {
    name: e.title,
    slug: e.slug,
    sectionId: e.sectionSlug,
    sectionLabel: e.sectionName,
    tab: e.tabName || e.sectionName,
    badge: e.badgeType === "text" ? e.badgeText : undefined,
    icon: e.badgeType === "icon" ? faClass(e.badgeIcon) : undefined,
    color: e.badgeColor,
    live: !!e.isLive,
    description: e.description || "",
    languages: e.languages || "English, Hindi",
    totalTests: d.stats.totalTests,
    totalQuestions: d.stats.totalQuestions,
    totalHours: d.stats.totalHours,
    freeTests: d.stats.freeTests,
    levels: d.levels,
    series: d.series.map((s) => ({
      title: s.title,
      tests: s.tests.map((t) => ({
        id: t.id,
        no: t.testNo,
        name: t.name,
        level: t.level,
        questions: t.questions,
        marks: t.marks,
        mins: t.durationMins,
        free: !!t.isFree,
        live: !!t.isLive,
        price: t.isFree ? null : t.price ?? null,
        mrp: t.isFree ? null : t.mrp ?? null,
        href: t.href || "",
        questionCount: Number(t.questionCount) || 0, // real questions added in admin
      })),
    })),
  };
}

export async function fetchSeriesPage(sectionSlug, examSlug, opts) {
  const d = await getJson(`${BASE}/series/${encodeURIComponent(sectionSlug)}/${encodeURIComponent(examSlug)}`, opts);
  return seriesFromApi(d);
}

// Build-time list of exam pages: the admin panel's list when the API is
// reachable, otherwise the static catalogue.
export async function fetchAllSeriesParams() {
  try {
    const d = await getJson(`${BASE}/catalog`, { timeoutMs: 15000 });
    const pages = (d.pages || []).map((p) => ({ section: p.section, slug: p.slug }));
    if (pages.length) return pages;
  } catch (err) {
    console.warn("[mock-test] catalog API unavailable at build time, using static list:", err.message);
  }
  return MOCK_TEST_CATALOG.map((c) => ({ section: c.sectionId, slug: c.slug }));
}

// Build-time data for one exam page: API first; static catalogue only if the API is unreachable.
export async function loadSeriesForBuild(sectionSlug, examSlug) {
  try {
    return await fetchSeriesPage(sectionSlug, examSlug, { timeoutMs: 15000 });
  } catch (err) {
    if (err.status === 404) return null;
    const s = findSeries(sectionSlug, examSlug);
    return s ? { ...s, languages: "English, Hindi" } : null;
  }
}

export { MOCK_TEST_SECTIONS };
