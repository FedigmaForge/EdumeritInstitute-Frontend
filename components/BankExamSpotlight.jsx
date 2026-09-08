import Link from "next/link";
import ExamCardScroller from "./ExamCardScroller";

const EXAMS_API = "https://api.edumerits.in/api/admin/exams";
const IMAGE_BASE = "https://api.edumerits.in";

const EXAM_ORDER = ["IBPS PO", "SBI PO", "IBPS and SBI Clerk", "NICL"];
const TYPE_ORDER = ["Preliminary Examination", "Main Examination", "Preliminary & Main"];

async function getExams() {
  try {
    const res = await fetch(`${EXAMS_API}?t=${Date.now()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.success || !Array.isArray(data.exams)) return null;

    return [...data.exams]
      .sort((a, b) => {
        const examDiff = EXAM_ORDER.indexOf(a.examName) - EXAM_ORDER.indexOf(b.examName);
        if (examDiff !== 0) return examDiff;
        return TYPE_ORDER.indexOf(a.examType) - TYPE_ORDER.indexOf(b.examType);
      })
      .map((exam) => ({
        ...exam,
        imageUrl: exam.coverPhoto ? `${IMAGE_BASE}${exam.coverPhoto}` : null,
      }));
  } catch {
    return null;
  }
}

export default async function BankExamSpotlight() {
  const exams = await getExams();

  return (
    <section className="bank-spotlight">
      <div className="container">
        <div className="bank-spotlight-header">
          <span className="eyebrow eyebrow-on-dark">Banking Exams</span>
          <h2>Your Path to a Government Banking Career</h2>
          <div className="divider divider-light"></div>
        </div>
      </div>

      {exams && exams.length > 0 ? (
        <ExamCardScroller exams={exams} />
      ) : (
        <div className="container">
          <div className="bank-spotlight-fallback">
            <p>Live batch pricing is temporarily unavailable — message us on WhatsApp for the latest details.</p>
            <a
              href="https://wa.me/919211278818?text=Hi%20EduMerit%20Institute,%20I%20want%20to%20know%20about%20banking%20exam%20batches"
              target="_blank"
              rel="noreferrer"
              className="btn-accent"
            >
              <i className="fab fa-whatsapp"></i> Ask on WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="container">
        <div className="bank-spotlight-footer">
          <div className="bank-spotlight-features">
            <span>
              <i className="fas fa-check-circle"></i> Mock Tests
            </span>
            <span>
              <i className="fas fa-check-circle"></i> Previous Year Papers
            </span>
            <span>
              <i className="fas fa-check-circle"></i> Daily Current Affairs
            </span>
            <span>
              <i className="fas fa-check-circle"></i> Expert Faculty
            </span>
          </div>
          <p className="bank-spotlight-note">
            Also preparing for RBI Grade B/Assistant or RRB PO/Clerk?{" "}
            <Link href="/bank-exams">View program details</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
