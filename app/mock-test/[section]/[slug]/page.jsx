import MockTestSeries from "@/components/MockTestSeries";
import { fetchAllSeriesParams, loadSeriesForBuild } from "@/components/mockTestApi";

// Pages are generated at build time for every exam in the admin panel
// (Main Mock Test) plus the static catalogue. The page then loads live data
// from the API in the browser, so admin changes to series/tests show up
// without a rebuild. Exams added AFTER a build are served by /mock-test/view/
// (see firebase.json rewrite) until the next build.
//
// NOTE: do NOT add `export const dynamicParams = false` here. With
// `output: "export"`, Next 14.2's dev server then throws
// 'Page ... is missing exported function "generateStaticParams()"' on every
// exam page. A static export only ever contains the generated params anyway.

export async function generateStaticParams() {
  return fetchAllSeriesParams();
}

export async function generateMetadata({ params }) {
  const s = await loadSeriesForBuild(params.section, params.slug);
  if (!s) return {};
  const title = `${s.name} — ${s.totalTests} Tests`;
  const description = `${s.name}: ${s.totalTests} tests, ${s.totalQuestions} questions, ${s.freeTests} free tests. Exam-pattern based ${String(s.tab || "").toLowerCase()} exam practice with EduMerit Institute.`;
  return {
    title,
    description,
    alternates: { canonical: `/mock-test/${params.section}/${params.slug}` },
    openGraph: { title: `${title} | EduMerit Institute`, description, url: `/mock-test/${params.section}/${params.slug}` },
  };
}

export default async function MockTestSeriesPage({ params }) {
  const initial = await loadSeriesForBuild(params.section, params.slug);
  return (
    <section className="mt-page">
      <div className="container">
        <MockTestSeries sectionSlug={params.section} examSlug={params.slug} initialSeries={initial} />
      </div>
    </section>
  );
}
