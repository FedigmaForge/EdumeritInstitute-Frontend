import Link from "next/link";
import SyllabusTabs from "@/components/SyllabusTabs";
import DownloadButton from "@/components/DownloadButton";

export const metadata = {
  title: "SSC Exams Coaching — CGL, CHSL, MTS & CPO",
  description:
    "SSC CGL, CHSL, MTS, CPO, GD and Stenographer coaching at EduMerit Institute, Greater Noida — live classes, weekly mock tests, previous year papers, and daily current affairs updates.",
  alternates: { canonical: "/ssc-exams" },
  openGraph: { title: "SSC Exams Coaching — CGL, CHSL, MTS & CPO | EduMerit Institute", description: "Live classes, mock tests and previous year papers for all SSC exams.", url: "/ssc-exams" },
};

const EXAMS = [
  "SSC CGL (Combined Graduate Level)",
  "SSC CHSL (Combined Higher Secondary Level)",
  "SSC MTS (Multi-Tasking Staff)",
  "SSC CPO (Central Police Organisation)",
  "SSC GD (General Duty)",
  "SSC Stenographer",
];

const FEATURES = [
  "Live interactive classes with expert faculty",
  "Recorded video lectures for revision",
  "Comprehensive study materials and notes",
  "Daily practice questions and assignments",
  "Weekly mock tests with detailed analysis",
  "Previous year question papers solved",
  "Current affairs updates (daily/weekly/monthly)",
  "Doubt clearing sessions",
  "Interview and personality development guidance",
];

const SYLLABUS_TABS = [
  { id: "reasoning", label: "Reasoning", items: ["Verbal & Non-Verbal Reasoning", "Analogies, Classification, Series", "Coding-Decoding, Blood Relations", "Direction Sense, Seating Arrangement", "Syllogism, Statement & Conclusions"] },
  { id: "quantitative", label: "Quantitative Aptitude", items: ["Number System, HCF & LCM", "Percentage, Profit & Loss", "Time & Work, Time & Distance", "Simple & Compound Interest", "Geometry, Mensuration, Trigonometry"] },
  { id: "english", label: "English", items: ["Grammar (Tenses, Articles, Prepositions)", "Vocabulary (Synonyms, Antonyms, Idioms)", "Reading Comprehension", "Sentence Correction & Improvement", "Fill in the Blanks, Cloze Test"] },
  { id: "gk", label: "General Awareness", items: ["Indian History, Geography, Polity", "Indian Economy & Finance", "General Science (Physics, Chemistry, Biology)", "Current Affairs (National & International)", "Sports, Awards, Books & Authors"] },
];

const RESOURCES = [
  ["SSC CGL Study Material", "Comprehensive study material for all sections of SSC CGL"],
  ["SSC Previous Year Papers", "Last 10 years solved papers with detailed explanations"],
  ["General Awareness Notes", "Complete GK and current affairs notes for SSC exams"],
];

export default function SscExamsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-breadcrumb">
            <a href="/">
              <i className="fas fa-home"></i> Home
            </a>
            <i className="fas fa-chevron-right"></i>
            <span>SSC Exams</span>
          </div>
          <div className="page-hero-body">
            <div className="page-hero-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div>
              <h1>SSC Exams Coaching</h1>
              <p>Comprehensive preparation for SSC CGL, CHSL, MTS &amp; all Staff Selection Commission exams</p>
            </div>
          </div>
          <div className="page-hero-stats">
            <span className="hero-stat-pill">
              <i className="fas fa-users"></i> 150+ Students Enrolled
            </span>
            <span className="hero-stat-pill">
              <i className="fas fa-clipboard-list"></i> 6 Exams Covered
            </span>
            <span className="hero-stat-pill">
              <i className="fas fa-trophy"></i> 95% Success Rate
            </span>
            <span className="hero-stat-pill">
              <i className="fas fa-video"></i> Live + Recorded Classes
            </span>
          </div>
        </div>
      </section>

      <section className="course-detail-section">
        <div className="container course-detail-grid">
          <div className="course-main">
            <div className="course-intro">
              <h2>SSC Exam Preparation Program</h2>
              <p>
                Our SSC coaching program is designed to help you crack SSC CGL, CHSL, MTS, and other competitive
                exams with comprehensive study materials, expert guidance, and regular mock tests.
              </p>
            </div>

            <div className="course-block">
              <h3>
                <i className="fas fa-clipboard-list"></i> Exams Covered
              </h3>
              <div className="exams-grid">
                {EXAMS.map((e) => (
                  <div className="exam-item" key={e}>
                    <i className="fas fa-check-circle"></i> {e}
                  </div>
                ))}
              </div>
            </div>

            <div className="course-block">
              <h3>
                <i className="fas fa-star"></i> Course Features
              </h3>
              <ul className="feature-list">
                {FEATURES.map((f) => (
                  <li key={f}>
                    <i className="fas fa-check"></i> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="course-block">
              <h3>
                <i className="fas fa-book-open"></i> Syllabus Coverage
              </h3>
              <SyllabusTabs tabs={SYLLABUS_TABS} />
            </div>
          </div>

          <div className="course-sidebar">
            <div className="sidebar-card">
              <h3>Course Information</h3>
              <ul className="info-list">
                <li>
                  <i className="fas fa-clock"></i> <strong>Duration:</strong> 6-12 Months
                </li>
                <li>
                  <i className="fas fa-video"></i> <strong>Mode:</strong> Online/Offline
                </li>
                <li>
                  <i className="fas fa-users"></i> <strong>Batch Size:</strong> 30-40 Students
                </li>
                <li>
                  <i className="fas fa-language"></i> <strong>Language:</strong> Hindi/English
                </li>
                <li>
                  <i className="fas fa-certificate"></i> <strong>Certificate:</strong> Yes
                </li>
              </ul>
            </div>

            <div className="sidebar-card cta-card">
              <h3>Enroll Now</h3>
              <p>Start your SSC exam preparation today!</p>
              <Link href="/contact" className="btn-primary btn-block">
                <i className="fas fa-user-plus"></i> Register Now
              </Link>
              <Link href="/contact" className="btn-outline btn-block">
                <i className="fas fa-calendar"></i> Book Free Demo
              </Link>
            </div>

            <div className="sidebar-card">
              <h3>Need Help?</h3>
              <p>Contact our admission team</p>
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
      </section>

      <section className="page-resources-section">
        <div className="container">
          <h2>
            <i className="fas fa-download"></i> Free Resources for SSC Exams
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
