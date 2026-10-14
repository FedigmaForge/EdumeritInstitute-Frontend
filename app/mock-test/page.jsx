import { Suspense } from "react";
import MockTestDashboard from "@/components/MockTestDashboard";
import { fetchAllSeriesParams } from "@/components/mockTestApi";

export const metadata = {
  title: "Mock Tests — Bank & Insurance Exams",
  description:
    "Full length mock tests, topic tests, sectional tests, descriptive tests and live all-India mocks for IBPS, SBI, RRB, RBI, LIC, NIACL and NICL exams.",
  alternates: { canonical: "/mock-test" },
  openGraph: {
    title: "Mock Tests | EduMerit Institute",
    description: "Bank & Insurance exam mock tests — full length, topic-wise, sectional, descriptive and live.",
    url: "/mock-test",
  },
};

export default async function MockTestPage() {
  // Same list generateStaticParams() uses for /mock-test/[section]/[slug]/ —
  // cards for exams not in it (added after the build) open /mock-test/view/.
  const builtPages = (await fetchAllSeriesParams()).map((p) => `/mock-test/${p.section}/${p.slug}/`);
  return (
    <section className="mt-page">
      <div className="container">
        <Suspense fallback={<div className="mt-loading"><i className="fas fa-spinner fa-spin"></i> Loading…</div>}>
          <MockTestDashboard builtPages={builtPages} />
        </Suspense>
      </div>
    </section>
  );
}
