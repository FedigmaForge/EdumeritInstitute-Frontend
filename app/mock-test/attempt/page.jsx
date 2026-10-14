import { Suspense } from "react";
import MockTestAttempt from "@/components/MockTestAttempt";

// Test player for Main Mock Test tests: /mock-test/attempt/?test=<testId>.
// Login is required; questions are loaded from the API in the browser.
export const metadata = {
  title: "Mock Test",
  robots: { index: false },
};

export default function MockTestAttemptPage() {
  return (
    <section className="mt-page">
      <div className="container">
        <Suspense fallback={<div className="mt-loading"><i className="fas fa-spinner fa-spin"></i> Loading…</div>}>
          <MockTestAttempt />
        </Suspense>
      </div>
    </section>
  );
}
