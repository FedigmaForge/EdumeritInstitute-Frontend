export const BLOG_POSTS = [
  {
    slug: "ibps-po-2026-notification-guide",
    title: "IBPS PO 2026: Eligibility, Application Process & Exam Pattern",
    category: "Exam Notifications",
    bannerText: "IBPS PO 2026",
    bannerIcon: "fa-building-columns",
    date: "2026-08-31",
    excerpt:
      "A complete walkthrough of the IBPS PO recruitment cycle — eligibility criteria, how to apply, the three-stage exam pattern, and how to structure your preparation.",
    content: [
      {
        type: "paragraph",
        text: "IBPS PO (Probationary Officer) is one of the most sought-after banking exams in India, conducted by the Institute of Banking Personnel Selection to recruit officers for public sector banks. Here's what every aspirant should know before the notification drops.",
      },
      { type: "heading", text: "Eligibility Criteria" },
      {
        type: "list",
        items: [
          "Nationality: Indian citizen",
          "Age: Generally 20–30 years (relaxation applies for SC/ST/OBC/PwBD/Ex-servicemen as per government norms)",
          "Education: A graduate degree in any discipline from a recognised university",
        ],
      },
      {
        type: "paragraph",
        text: "Exact age limits and vacancy numbers are announced fresh with every year's official notification — always cross-check with the latest IBPS notification before applying.",
      },
      { type: "heading", text: "Exam Pattern — Three Stages" },
      {
        type: "list",
        items: [
          "Preliminary Exam: English Language, Quantitative Aptitude, Reasoning Ability (objective, 1 hour)",
          "Main Exam: Reasoning & Computer Aptitude, General/Economy/Banking Awareness, English Language, Data Analysis & Interpretation, plus a descriptive paper (Letter & Essay)",
          "Interview: Conducted by the participating bank after the Main exam result",
        ],
      },
      { type: "heading", text: "How to Prepare" },
      {
        type: "paragraph",
        text: "A structured plan beats last-minute cramming every time. Focus on building speed and accuracy in Quant and Reasoning through daily practice, stay consistent with Banking & General Awareness through daily current affairs, and take regular sectional and full-length mock tests to track your progress under exam-like conditions.",
      },
      {
        type: "paragraph",
        text: "EduMerit Institute's IBPS PO batch covers all three stages with live classes, structured study material, and regular mock tests. Message us on WhatsApp for the latest batch details and official notification updates.",
      },
    ],
  },
];

export function getBlogPost(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}
