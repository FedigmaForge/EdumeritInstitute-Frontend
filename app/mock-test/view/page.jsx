import { Suspense } from "react";
import MockTestSeriesView from "@/components/MockTestSeriesView";

// Fallback page for exam cards added in the admin panel after the last build.
// firebase.json rewrites /mock-test/<section>/<exam>/ here when no pre-built
// page exists; the component reads the section/exam from the URL and loads
// everything from the API. Also works as /mock-test/view/?section=..&slug=..
export const metadata = {
  title: "Mock Test Series",
  robots: { index: false },
};

export default function MockTestViewPage() {
  return (
    <section className="mt-page">
      <div className="container">
        <Suspense fallback={<div className="mt-loading"><i className="fas fa-spinner fa-spin"></i> Loading…</div>}>
          <MockTestSeriesView />
        </Suspense>
      </div>
    </section>
  );
}
