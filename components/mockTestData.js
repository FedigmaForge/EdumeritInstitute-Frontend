// Mock Test catalogue shown on /mock-test.
// Each section = one item in the left sidebar. Each section has tabs (Banking / Insurance),
// and each tab has a list of exam cards.
// `href` on a card is optional — cards without one show a "launching soon" notice.
// `badge` = short text shown in the round icon; `color` = its background.

export const MOCK_TEST_SECTIONS = [
  {
    id: "full-length",
    label: "Full Length Tests",
    icon: "fas fa-file-signature",
    title: "Full Length Test",
    tabs: {
      Banking: [
        { name: "SBI PO Mains Mock Test", questions: 170, marks: 200, mins: 180, tests: 16, badge: "SBI", color: "#1a56db" },
        { name: "Live Mock Test", questions: 100, marks: 100, mins: 60, tests: 6, icon: "fas fa-tv", color: "#0f766e", live: true },
        { name: "IBPS PO Mains Mock Test", questions: 155, marks: 200, mins: 160, tests: 15, badge: "IBPS", color: "#2563eb" },
        { name: "SBI Clerk Mock Test (Prelims)", questions: 100, marks: 100, mins: 60, tests: 30, badge: "SBI", color: "#1a56db" },
        { name: "IBPS Clerk Mock Test", questions: 100, marks: 100, mins: 60, tests: 30, badge: "IBPS", color: "#2563eb" },
        { name: "IBPS SO Mock Test (Mains)", questions: 60, marks: 60, mins: 45, tests: 15, badge: "IBPS", color: "#2563eb" },
        { name: "RRB PO Pre", questions: 80, marks: 80, mins: 45, tests: 25, badge: "RRB", color: "#7c3aed" },
        { name: "IBPS RRB Clerk Mock Test (Pre)", questions: 80, marks: 80, mins: 45, tests: 25, badge: "RRB", color: "#7c3aed" },
        { name: "IOB LBO Mock Test", questions: 155, marks: 200, mins: 180, tests: 10, badge: "IOB", color: "#1d4ed8" },
        { name: "IBPS PO Mock Test (Prelims)", questions: 100, marks: 100, mins: 60, tests: 30, badge: "IBPS", color: "#2563eb" },
        { name: "Bank of Baroda Mock Test", questions: 150, marks: 200, mins: 150, tests: 10, badge: "BOB", color: "#ea580c" },
        { name: "SBI PO Mock Test (Prelims)", questions: 100, marks: 100, mins: 60, tests: 30, badge: "SBI", color: "#1a56db" },
        { name: "RBI Assistant Mock Test", questions: 100, marks: 100, mins: 60, tests: 20, badge: "RBI", color: "#0a1f44" },
        { name: "RBI Grade B Mock Test", questions: 200, marks: 200, mins: 120, tests: 20, badge: "RBI", color: "#0a1f44" },
        { name: "NABARD Grade A Mock Test", questions: 200, marks: 200, mins: 120, tests: 15, badge: "NB", color: "#15803d" },
      ],
      Insurance: [
        { name: "NICL Assistant Mock Test", questions: 100, marks: 100, mins: 60, tests: 20, badge: "NICL", color: "#0f766e" },
        { name: "NIACL Assistant Mock Test", questions: 100, marks: 100, mins: 60, tests: 20, badge: "NIA", color: "#b91c1c" },
        { name: "NIACL AO Mock Test", questions: 100, marks: 100, mins: 60, tests: 20, badge: "NIA", color: "#b91c1c" },
        { name: "LIC AAO Mock Test", questions: 100, marks: 70, mins: 60, tests: 20, badge: "LIC", color: "#1e40af" },
        { name: "LIC Assistant Mock Test", questions: 100, marks: 70, mins: 60, tests: 20, badge: "LIC", color: "#1e40af" },
        { name: "UIIC Assistant Mock Test", questions: 100, marks: 100, mins: 60, tests: 15, badge: "UIIC", color: "#c2410c" },
      ],
    },
  },
  {
    id: "bank-topic",
    label: "Bank Topic Test",
    icon: "fas fa-file-circle-check",
    title: "Bank Topic Test",
    tabs: {
      Banking: [
        { name: "Quantitative Aptitude", icon: "fas fa-calculator", color: "#2563eb" },
        { name: "Reasoning Ability", icon: "fas fa-brain", color: "#7c3aed" },
        { name: "English Language", icon: "fas fa-language", color: "#0f766e" },
        { name: "Banking Awareness", icon: "fas fa-building-columns", color: "#0a1f44" },
        { name: "Computer Knowledge", icon: "fas fa-laptop", color: "#ea580c" },
        { name: "Data Interpretation", icon: "fas fa-chart-pie", color: "#15803d" },
        { name: "Puzzles & Seating Arrangement", icon: "fas fa-puzzle-piece", color: "#b91c1c" },
        { name: "Reading Comprehension", icon: "fas fa-book-open", color: "#1d4ed8" },
        { name: "Current Affairs", icon: "fas fa-newspaper", color: "#c2410c" },
      ],
      Insurance: [
        { name: "Insurance Awareness", icon: "fas fa-shield-halved", color: "#0f766e" },
        { name: "Financial Awareness", icon: "fas fa-indian-rupee-sign", color: "#1e40af" },
        { name: "Quantitative Aptitude", icon: "fas fa-calculator", color: "#2563eb" },
        { name: "Reasoning Ability", icon: "fas fa-brain", color: "#7c3aed" },
        { name: "English Language", icon: "fas fa-language", color: "#0f766e" },
      ],
    },
  },
  {
    id: "sectional",
    label: "Sectional Test 2.0",
    icon: "fas fa-list-check",
    title: "Sectional Test 2.0",
    tabs: {
      Banking: [
        { name: "Quant — Prelims Level", icon: "fas fa-calculator", color: "#2563eb" },
        { name: "Quant — Mains Level", icon: "fas fa-calculator", color: "#1d4ed8" },
        { name: "Reasoning — Prelims Level", icon: "fas fa-brain", color: "#7c3aed" },
        { name: "Reasoning — Mains Level", icon: "fas fa-brain", color: "#6d28d9" },
        { name: "English — Prelims Level", icon: "fas fa-language", color: "#0f766e" },
        { name: "English — Mains Level", icon: "fas fa-language", color: "#115e59" },
        { name: "General / Banking Awareness", icon: "fas fa-globe", color: "#0a1f44" },
      ],
      Insurance: [
        { name: "Insurance & Financial Awareness", icon: "fas fa-shield-halved", color: "#0f766e" },
        { name: "Quant — Insurance Exams", icon: "fas fa-calculator", color: "#2563eb" },
        { name: "Reasoning — Insurance Exams", icon: "fas fa-brain", color: "#7c3aed" },
      ],
    },
  },
  {
    id: "descriptive",
    label: "Descriptive Test",
    icon: "fas fa-file-pen",
    title: "Descriptive Test",
    tabs: {
      Banking: [
        { name: "SBI PO Descriptive (Essay & Letter)", badge: "SBI", color: "#1a56db" },
        { name: "IBPS PO Descriptive", badge: "IBPS", color: "#2563eb" },
        { name: "RBI Grade B Descriptive", badge: "RBI", color: "#0a1f44" },
        { name: "NABARD Descriptive", badge: "NB", color: "#15803d" },
      ],
      Insurance: [
        { name: "NIACL AO Descriptive", badge: "NIA", color: "#b91c1c" },
        { name: "LIC AAO Descriptive", badge: "LIC", color: "#1e40af" },
      ],
    },
  },
  {
    id: "live",
    label: "Live Mock Test",
    icon: "fas fa-tower-broadcast",
    title: "Live Mock Test",
    tabs: {
      Banking: [
        { name: "All India Live Mock — IBPS PO", icon: "fas fa-tv", color: "#0f766e", live: true },
        { name: "All India Live Mock — SBI Clerk", icon: "fas fa-tv", color: "#0f766e", live: true },
        { name: "All India Live Mock — RRB PO", icon: "fas fa-tv", color: "#0f766e", live: true },
      ],
      Insurance: [
        { name: "All India Live Mock — NICL Assistant", icon: "fas fa-tv", color: "#0f766e", live: true },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Series (internal page) generation
// ---------------------------------------------------------------------------
// Default test pattern per section, used when a card doesn't set its own
// questions / marks / mins / tests.
const SECTION_DEFAULTS = {
  "full-length": { questions: 100, marks: 100, mins: 60, tests: 20, unit: "Mock Test" },
  "bank-topic": { questions: 20, marks: 20, mins: 15, tests: 12, unit: "Topic Test" },
  sectional: { questions: 35, marks: 35, mins: 20, tests: 12, unit: "Sectional Test" },
  descriptive: { questions: 2, marks: 50, mins: 30, tests: 8, unit: "Descriptive Test" },
  live: { questions: 100, marks: 100, mins: 60, tests: 6, unit: "Live Mock" },
};

// How many tests (from the start of the newest series) are free.
const FREE_TESTS = 2;

// Difficulty cycle for generated tests. Test #1 of each series is always
// "Exam Pattern Based".
export const LEVELS = ["Exam Pattern Based", "Easy", "Moderate", "Difficult"];
const LEVEL_CYCLE = ["Moderate", "Moderate", "Easy", "Difficult"];

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[—–]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Strips trailing "Mock Test" etc. so series titles read naturally:
// "SBI PO Mains Mock Test" -> "SBI PO Mains"
function baseName(name) {
  return name.replace(/\s*mock test\s*/i, " ").replace(/\s+/g, " ").trim();
}

// Builds one flat list of every card with a unique URL slug and full series data.
function buildCatalog() {
  const list = [];
  MOCK_TEST_SECTIONS.forEach((section) => {
    const seen = new Set();
    Object.entries(section.tabs).forEach(([tab, cards]) => {
      cards.forEach((card) => {
        let slug = slugify(card.name);
        if (seen.has(slug)) slug = `${slug}-${slugify(tab)}`;
        seen.add(slug);

        const d = SECTION_DEFAULTS[section.id] || SECTION_DEFAULTS["full-length"];
        const questions = card.questions ?? d.questions;
        const marks = card.marks ?? d.marks;
        const mins = card.mins ?? d.mins;
        const total = card.tests ?? d.tests;

        // Split into "2026 Series" (newest, numbered higher) and "2024-2025 Series".
        const newCount = Math.ceil(total / 2);
        const oldCount = total - newCount;
        // Only add the unit ("Topic Test", "Descriptive Test"…) when the name doesn't already say it.
        const unitWord = d.unit.split(" ")[0].toLowerCase();
        const hasUnit = card.name.toLowerCase().includes(unitWord) || /mock/i.test(card.name);
        const testName = hasUnit ? card.name : `${card.name} — ${d.unit}`;
        const seriesBase = hasUnit ? baseName(card.name) : `${card.name} ${d.unit}`;
        const seriesBaseFixed = /mock/i.test(seriesBase) || section.id !== "full-length" ? seriesBase : `${seriesBase} Mock Test`;

        const makeTests = (from, count, freeCount) =>
          Array.from({ length: count }, (_, i) => ({
            no: from + i,
            name: testName,
            level: i === 0 ? LEVELS[0] : LEVEL_CYCLE[(from + i) % LEVEL_CYCLE.length],
            questions,
            marks,
            mins,
            free: i < freeCount,
            live: !!card.live,
          }));

        const series = [
          { title: `${seriesBaseFixed} 2026 Series`, tests: makeTests(oldCount + 1, newCount, FREE_TESTS) },
        ];
        if (oldCount > 0) {
          series.push({ title: `${seriesBaseFixed} 2024-2025 Series`, tests: makeTests(1, oldCount, 0) });
        }

        list.push({
          ...card,
          slug,
          tab,
          sectionId: section.id,
          sectionLabel: section.label,
          questions,
          marks,
          mins,
          totalTests: total,
          totalQuestions: total * questions,
          totalHours: Math.round((total * mins) / 60),
          freeTests: Math.min(FREE_TESTS, newCount),
          series,
        });
      });
    });
  });
  return list;
}

export const MOCK_TEST_CATALOG = buildCatalog();

export function findSeries(sectionId, slug) {
  return MOCK_TEST_CATALOG.find((c) => c.sectionId === sectionId && c.slug === slug);
}

export function seriesHref(sectionId, card, tab) {
  const hit = MOCK_TEST_CATALOG.find((c) => c.sectionId === sectionId && c.name === card.name && c.tab === tab);
  return hit ? `/mock-test/${sectionId}/${hit.slug}/` : "/mock-test/";
}
