"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LEVELS } from "./mockTestData";
import { fetchSeriesPage } from "./mockTestApi";
import { authFetch, getStudent, getToken } from "./studentAuth";
import { openRazorpay } from "./razorpayCheckout";
import StudentAuthModal from "./StudentAuthModal";

// A test must be bought when it is not FREE and has a price (set in admin → Main Mock Test).
const isPaid = (t) => !t.free && Number(t.price) >= 1 && !!t.id;
// A test can be taken only once its questions are added in admin (or it has its own Start Test link).
const isReady = (t) => Number(t.questionCount) > 0 || !!t.href;
const rupees = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const LEVEL_CLASS = {
  "Exam Pattern Based": "pattern",
  Easy: "easy",
  Moderate: "moderate",
  Difficult: "difficult",
};

// initialSeries = data baked in at build time (may be null for exams added later);
// the live version is always fetched from the admin API on load.
export default function MockTestSeries({ sectionSlug, examSlug, initialSeries = null }) {
  const [series, setSeries] = useState(initialSeries);
  const [status, setStatus] = useState(initialSeries ? "ready" : "loading"); // loading | ready | notfound
  const [view, setView] = useState("tests");
  const [level, setLevel] = useState("All");
  const [toast, setToast] = useState("");
  const [owned, setOwned] = useState(() => new Set()); // test ids this student has bought
  const [authFor, setAuthFor] = useState(null); // { test, action: "buy" | "start" } waiting for login
  const [buying, setBuying] = useState(null); // test id being paid for

  // Which paid tests the logged-in student owns
  useEffect(() => {
    const refresh = () => {
      if (!getToken()) { setOwned(new Set()); return; }
      authFetch("/api/main-mock-test/my-tests")
        .then((d) => setOwned(new Set(d.testIds || [])))
        .catch(() => {});
    };
    refresh();
    window.addEventListener("edumerit-auth", refresh);
    return () => window.removeEventListener("edumerit-auth", refresh);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let alive = true;
    fetchSeriesPage(sectionSlug, examSlug)
      .then((live) => {
        if (!alive) return;
        setSeries(live);
        setStatus("ready");
      })
      .catch((err) => {
        if (!alive) return;
        // 404 = removed/hidden in the admin panel. Other errors: keep the build-time copy if any.
        if (err.status === 404) {
          setSeries(null);
          setStatus("notfound");
        } else if (!initialSeries) {
          setStatus("error");
        }
      });
    return () => { alive = false; };
  }, [sectionSlug, examSlug, initialSeries]);

  const filtered = useMemo(
    () =>
      (series?.series || [])
        .map((s) => ({ ...s, tests: level === "All" ? s.tests : s.tests.filter((t) => t.level === level) }))
        .filter((s) => s.tests.length > 0),
    [series, level]
  );

  if (!series) {
    return (
      <div className="mts">
        {status === "loading" ? (
          <div className="mt-loading"><i className="fas fa-spinner fa-spin"></i> Loading…</div>
        ) : (
          <div className="mts-empty">
            <i className="fas fa-circle-exclamation"></i>{" "}
            {status === "notfound" ? "This mock test is not available." : "Could not load this mock test. Please try again."}{" "}
            <Link href="/mock-test/">Browse all mock tests</Link>
          </div>
        )}
      </div>
    );
  }

  const levels = series.levels || LEVELS;

  const purchase = async (t) => {
    setBuying(t.id);
    try {
      const d = await authFetch("/api/main-mock-test/create-order", { method: "POST", body: { testId: t.id } });
      if (!d.alreadyPurchased) {
        const st = getStudent() || {};
        const paid = await openRazorpay({
          keyId: d.keyId,
          order: d.order,
          description: `${series.name} — Test ${t.no}`,
          prefill: { name: st.name || "", email: st.email || "", contact: st.phone || "" },
        });
        await authFetch("/api/main-mock-test/verify", { method: "POST", body: paid });
      }
      setOwned((prev) => new Set([...prev, t.id]));
      setToast(`Test ${t.no} unlocked — you can start it now!`);
    } catch (err) {
      if (err?.cancelled) setToast("Payment cancelled.");
      else if (err?.status === 401) setAuthFor({ test: t, action: "buy" });
      else setToast(err?.message || "Payment failed. Please try again.");
    } finally {
      setBuying(null);
    }
  };

  const buyTest = (t) => {
    if (!getToken()) {
      setAuthFor({ test: t, action: "buy" });
      return;
    }
    purchase(t);
  };

  const openTest = (t) => {
    window.location.href = `/mock-test/attempt/?test=${t.id}`;
  };

  // Tests with their own link go there; the rest open the in-site test player (login required).
  const startTest = (t) => {
    if (t.href) {
      window.location.href = t.href;
      return;
    }
    if (!t.id) {
      setToast(`Test ${t.no} of ${series.name} is launching soon!`);
      return;
    }
    if (!getToken()) {
      setAuthFor({ test: t, action: "start" });
      return;
    }
    openTest(t);
  };

  return (
    <div className="mts">
      <div className="mts-breadcrumb">
        <Link href="/"><i className="fas fa-home"></i> Home</Link>
        <i className="fas fa-chevron-right"></i>
        <Link href={`/mock-test/?section=${series.sectionId}`}>{series.sectionLabel}</Link>
        <i className="fas fa-chevron-right"></i>
        <span>{series.name}</span>
      </div>

      {/* Header card */}
      <div className="mts-header">
        <div className="mts-header-main">
          <span className="mt-card-icon mts-header-icon" style={{ background: series.color }}>
            {series.icon ? <i className={series.icon}></i> : <span className="mt-card-badge">{series.badge}</span>}
          </span>
          <div>
            <span className="mts-chip">{series.tab}</span>
            <h1 className="mts-title">{series.name}</h1>
            <div className="mts-meta">
              <span><i className="fas fa-file-lines"></i> {series.totalTests} tests</span>
              <span><i className="fas fa-circle-question"></i> {series.totalQuestions} ques.</span>
              <span><i className="fas fa-clock"></i> {series.totalHours} hrs</span>
              <span><i className="fas fa-language"></i> {series.languages || "English, Hindi"}</span>
            </div>
          </div>
        </div>
        <div className="mts-header-side">
          <div className="mts-free"><i className="fas fa-gift"></i> {series.freeTests} Free Tests</div>
          <a
            className="mts-enquire"
            href={`https://wa.me/919211278818?text=${encodeURIComponent(`Hi EduMerit Institute, I want to know about the ${series.name} series`)}`}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-whatsapp"></i> Enquire Now
          </a>
        </div>
      </div>

      {/* My Tests / Performance Graph */}
      <div className="mts-toolbar">
        <div className="mts-views">
          <button type="button" className={`mts-view${view === "tests" ? " active" : ""}`} onClick={() => setView("tests")}>
            <i className="fas fa-copy"></i> My Tests
          </button>
          <button type="button" className={`mts-view${view === "graph" ? " active" : ""}`} onClick={() => setView("graph")}>
            <i className="fas fa-chart-line"></i> Performance Graph
          </button>
        </div>
        {view === "tests" && (
          <label className="mts-filter">
            <i className="fas fa-bars-staggered"></i>
            <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Select level">
              <option value="All">All Levels</option>
              {levels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {view === "tests" ? (
        filtered.length === 0 ? (
          <div className="mts-empty"><i className="fas fa-filter"></i> No tests at this level yet.</div>
        ) : (
          filtered.map((s) => (
            <div className="mts-series" key={s.title}>
              <div className="mt-title-row">
                <h2 className="mt-title mts-series-title">{s.title}</h2>
                <span className="mt-title-line"></span>
              </div>
              <div className="mts-rows">
                {s.tests.map((t) => (
                  <div className="mts-row" key={t.id ?? t.no}>
                    <span className="mts-no">{t.no}</span>
                    <div className="mts-name-wrap">
                      <span className="mts-name">{t.name}</span>
                      <span className={`mts-level ${LEVEL_CLASS[t.level] || ""}`}>
                        <i className="fas fa-circle"></i> {t.level}
                      </span>
                      {t.free && <span className="mts-free-tag">FREE</span>}
                      {isPaid(t) && owned.has(t.id) && <span className="mts-owned-tag"><i className="fas fa-check"></i> PURCHASED</span>}
                      {isReady(t) && isPaid(t) && !owned.has(t.id) && (
                        <span className="mts-price-tag">
                          {rupees(t.price)}
                          {Number(t.mrp) > Number(t.price) && <s>{rupees(t.mrp)}</s>}
                        </span>
                      )}
                      {t.live && <span className="mts-live-tag">LIVE</span>}
                    </div>
                    <div className="mts-stats">
                      <div><strong>{t.questions}</strong><span>Questions</span></div>
                      <div><strong>{t.marks}</strong><span>Marks</span></div>
                      <div><strong>{t.mins}</strong><span>Mins</span></div>
                    </div>
                    {!isReady(t) ? (
                      <button type="button" className="mts-start mts-soon" disabled title="Questions for this test are being added">
                        <i className="fas fa-clock"></i> Coming Soon
                      </button>
                    ) : isPaid(t) && !owned.has(t.id) ? (
                      <button type="button" className="mts-start mts-buy" disabled={buying === t.id} onClick={() => buyTest(t)}>
                        {buying === t.id ? <><i className="fas fa-spinner fa-spin"></i> Processing…</> : <><i className="fas fa-lock"></i> Buy {rupees(t.price)}</>}
                      </button>
                    ) : (
                      <button type="button" className="mts-start" onClick={() => startTest(t)}>
                        Start Test
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )
      ) : (
        <div className="mts-graph">
          <div className="mts-graph-axes">
            {[80, 60, 40, 20].map((v) => (
              <div className="mts-graph-line" key={v}><span>{v}%</span></div>
            ))}
          </div>
          <div className="mts-graph-msg">
            <i className="fas fa-chart-line"></i>
            <h3>No attempts yet</h3>
            <p>Attempt a test from this series and your score trend, accuracy and rank will appear here.</p>
            <button type="button" className="mts-start" onClick={() => setView("tests")}>Go to My Tests</button>
          </div>
        </div>
      )}

      {authFor && (
        <StudentAuthModal
          reason={
            authFor.action === "start"
              ? `Log in or sign up to start "${authFor.test.name}" (Test ${authFor.test.no}).`
              : `Log in or sign up to buy Test ${authFor.test.no} of ${series.name} for ${rupees(authFor.test.price)}.`
          }
          onClose={() => setAuthFor(null)}
          onDone={() => {
            const { test: t, action } = authFor;
            setAuthFor(null);
            if (action === "start") openTest(t);
            else purchase(t);
          }}
        />
      )}

      {toast && (
        <div className="mt-toast">
          <i className="fas fa-clock"></i> {toast}
        </div>
      )}
    </div>
  );
}
