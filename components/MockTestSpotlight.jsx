import Link from "next/link";

const FEATURES = [
  {
    icon: "fa-bullseye",
    title: "Full-Length & Sectional Tests",
    desc: "Practice complete mock tests or focus on one section at a time.",
  },
  {
    icon: "fa-chart-line",
    title: "Detailed Performance Analysis",
    desc: "See your score, accuracy and section-wise breakdown after every test.",
  },
  {
    icon: "fa-layer-group",
    title: "Quant, Reasoning, English ,Current Affairs & GA",
    desc: "Covers every section banking and SSC exams actually test.",
  },
];

export default function MockTestSpotlight() {
  return (
    <section className="mock-test-section">
      <div className="container mock-test-grid">
        <div className="mock-test-text">
          <span className="eyebrow">Practice. Analyze. Improve.</span>
          <h2>
            Mock Tests Built Into <span className="accent-text">Every Batch</span>
          </h2>
          <div className="divider"></div>

          <div className="mock-test-features">
            {FEATURES.map((f) => (
              <div className="mock-test-feature" key={f.title}>
                <div className="mock-test-feature-icon">
                  <i className={`fas ${f.icon}`}></i>
                </div>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/quiz" className="btn-accent">
            <i className="fas fa-play"></i> Try a Free Mock Test
          </Link>
        </div>

        <div className="mock-test-visual">
          <img
            src="/banners/mock-test-student.png"
            alt="Student taking a mock test — exam-like experience, performance analysis, sectional tests"
          />
        </div>
      </div>
    </section>
  );
}
