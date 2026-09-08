import Link from "next/link";
import DownloadButton from "@/components/DownloadButton";

export const metadata = {
  title: "Bank Exams Coaching — IBPS, SBI, RBI & NABARD",
  description:
    "Comprehensive coaching for IBPS PO & Clerk, SBI PO & Clerk, RBI Grade B & Assistant, NABARD and IBPS RRB — live classes, study materials, and regular mock tests at EduMerit Institute, Greater Noida.",
  alternates: { canonical: "/bank-exams" },
  openGraph: { title: "Bank Exams Coaching — IBPS, SBI, RBI & NABARD | EduMerit Institute", description: "Live classes, study materials and mock tests for all major banking exams.", url: "/bank-exams" },
};

const EXAMS_COVERED = [
  "IBPS PO (Probationary Officer)",
  "IBPS Clerk",
  "SBI PO (Probationary Officer)",
  "SBI Clerk",
  "RBI Grade B",
  "RBI Assistant",
  "NABARD",
  "IBPS RRB",
];

const FEATURES = [
  ["fa-video", "Live & Recorded Classes", "Interactive live sessions with recorded backup for revision"],
  ["fa-book", "Study Materials", "Comprehensive notes, PDFs and practice questions"],
  ["fa-clipboard-list", "Mock Tests", "Regular mock tests with detailed performance analysis"],
  ["fa-question-circle", "Doubt Clearing", "Dedicated doubt solving sessions and one-on-one support"],
];

const SYLLABUS = [
  ["Quantitative Aptitude", "Number System, Simplification, Data Interpretation, Arithmetic"],
  ["Reasoning Ability", "Logical Reasoning, Puzzles, Seating Arrangement, Coding-Decoding"],
  ["English Language", "Grammar, Vocabulary, Reading Comprehension, Error Detection"],
  ["Banking Awareness", "Banking Terms, Current Affairs, Financial Awareness, Economy"],
];

const RESOURCES = [
  ["Banking Awareness Notes", "Complete banking awareness notes covering all important topics"],
  ["IBPS PO Previous Papers", "Last 10 years solved papers with detailed solutions"],
  ["Quantitative Aptitude Practice", "Topic-wise practice questions for quantitative aptitude"],
];

export default function BankExamsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Bank Exams Preparation</h1>
          <p>Comprehensive coaching for IBPS, SBI, RBI and all banking examinations</p>
        </div>
      </section>

      <section className="course-details-section">
        <div className="container">
          <div className="course-details-grid">
            <div className="course-main">
              <h2>About Bank Exams Course</h2>
              <p>
                Our Bank Exams preparation program is designed to help you crack IBPS PO, SBI PO, RBI Grade B, and
                other banking examinations with comprehensive study materials, expert faculty, and regular mock
                tests.
              </p>

              <h3>Exams Covered</h3>
              <ul className="exam-list">
                {EXAMS_COVERED.map((e) => (
                  <li key={e}>
                    <i className="fas fa-check-circle"></i> {e}
                  </li>
                ))}
              </ul>

              <h3>Course Features</h3>
              <div className="features-list">
                {FEATURES.map(([icon, title, desc]) => (
                  <div className="feature-item" key={title}>
                    <i className={`fas ${icon}`}></i>
                    <div>
                      <h4>{title}</h4>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3>Syllabus Coverage</h3>
              <div className="syllabus-grid">
                {SYLLABUS.map(([title, desc]) => (
                  <div className="syllabus-card" key={title}>
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="course-sidebar">
              <div className="sidebar-card">
                <h3>Course Details</h3>
                <ul className="course-info">
                  <li>
                    <i className="fas fa-clock"></i> <strong>Duration:</strong> 6 Months
                  </li>
                  <li>
                    <i className="fas fa-calendar"></i> <strong>Start Date:</strong> Flexible
                  </li>
                  <li>
                    <i className="fas fa-users"></i> <strong>Batch Size:</strong> 30 Students
                  </li>
                  <li>
                    <i className="fas fa-certificate"></i> <strong>Certificate:</strong> Yes
                  </li>
                </ul>
                <Link href="/contact" className="btn-primary full-width">
                  Enroll Now
                </Link>
                <Link href="/contact" className="btn-outline full-width">
                  Book Free Demo
                </Link>
              </div>

              <div className="sidebar-card">
                <h3>Need Help?</h3>
                <p>Contact our admission team for more information</p>
                <ul className="contact-list">
                  <li>
                    <i className="fas fa-phone"></i> +91 9211278818
                  </li>
                  <li>
                    <i className="fas fa-envelope"></i> info@edumerits.co.in
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-resources-section">
        <div className="container">
          <h2>
            <i className="fas fa-download"></i> Free Resources for Bank Exams
          </h2>
          <div className="resources-grid">
            {RESOURCES.map(([title, desc]) => (
              <div className="resource-card" key={title}>
                <div className="resource-icon pdf">
                  <i className="fas fa-file-pdf"></i>
                </div>
                <div className="resource-info">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                  <span className="resource-meta">
                    <i className="fas fa-file"></i> PDF &nbsp;|&nbsp; <i className="fas fa-download"></i> Free
                  </span>
                </div>
                <DownloadButton />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
