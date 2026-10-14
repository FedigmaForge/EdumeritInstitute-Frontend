"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MockTestSeries from "./MockTestSeries";

// Reads section + exam slug from ?section=&slug= or from the real URL
// (/mock-test/<section>/<exam>/ rewritten to this page by Firebase Hosting).
export default function MockTestSeriesView() {
  const params = useSearchParams();
  const [target, setTarget] = useState(null);

  useEffect(() => {
    let section = params.get("section");
    let slug = params.get("slug");
    if (!section || !slug) {
      const parts = window.location.pathname.split("/").filter(Boolean); // ["mock-test", section, slug]
      if (parts[0] === "mock-test" && parts.length >= 3 && parts[1] !== "view") {
        section = parts[1];
        slug = parts[2];
      }
    }
    setTarget(section && slug ? { section, slug } : { missing: true });
  }, [params]);

  if (!target) return <div className="mt-loading"><i className="fas fa-spinner fa-spin"></i> Loading…</div>;
  if (target.missing) {
    return <div className="mts-empty"><i className="fas fa-circle-exclamation"></i> Mock test not found. <a href="/mock-test/">Browse all mock tests</a></div>;
  }
  return <MockTestSeries key={`${target.section}/${target.slug}`} sectionSlug={target.section} examSlug={target.slug} initialSeries={null} />;
}
