"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = [
  {
    id: "bank",
    label: "Bank Exams",
    icon: "fa-university",
    cards: [
      { icon: "fa-building-columns", title: "IBPS PO & Clerk", tags: "IBPS · PO · Clerk", desc: "Structured prep with live classes, mock tests & doubt clearing.", href: "/bank-exams" },
      { icon: "fa-landmark", title: "SBI PO & Clerk", tags: "SBI · PO · Clerk", desc: "Comprehensive coaching with GD/PI training included.", href: "/bank-exams" },
      { icon: "fa-piggy-bank", title: "RBI Grade B & Assistant", tags: "RBI · Grade B · Assistant", desc: "Complete syllabus coverage for RBI examinations.", href: "/bank-exams" },
      { icon: "fa-money-bill-wave", title: "NABARD & IBPS RRB", tags: "NABARD · RRB", desc: "Dedicated preparation for NABARD and Regional Rural Bank exams.", href: "/bank-exams" },
    ],
  },
  {
    id: "ssc",
    label: "SSC Exams",
    icon: "fa-file-alt",
    cards: [
      { icon: "fa-file-alt", title: "SSC CGL", tags: "Combined Graduate Level", desc: "Full syllabus coverage for SSC CGL aspirants.", href: "/ssc-exams" },
      { icon: "fa-file-signature", title: "SSC CHSL", tags: "Combined Higher Secondary Level", desc: "Structured prep for the SSC CHSL exam.", href: "/ssc-exams" },
      { icon: "fa-user-shield", title: "SSC MTS, CPO & GD", tags: "MTS · CPO · GD", desc: "Coaching for Multi-Tasking Staff, CPO & GD exams.", href: "/ssc-exams" },
      { icon: "fa-keyboard", title: "SSC Stenographer", tags: "Stenographer", desc: "Focused preparation for the SSC Stenographer exam.", href: "/ssc-exams" },
    ],
  },
  {
    id: "current-affairs",
    label: "Current Affairs",
    icon: "fa-newspaper",
    cards: [
      { icon: "fa-calendar-day", title: "Daily Updates", tags: "Banking · SSC · General Awareness", desc: "Fresh current affairs every day for exam prep.", href: "/current-affairs" },
      { icon: "fa-calendar-week", title: "Weekly Digest", tags: "National · International", desc: "Curated weekly roundup of important events.", href: "/current-affairs" },
      { icon: "fa-video", title: "Video Explainers", tags: "Watch & Learn", desc: "Daily current affairs explained on video.", href: "/current-affairs" },
      { icon: "fa-bullhorn", title: "Daily Headlines", tags: "Quick Reads", desc: "Quick daily headline roundups.", href: "/daily-headlines" },
    ],
  },
  {
    id: "quiz",
    label: "Quiz Bank",
    icon: "fa-question-circle",
    cards: [
      { icon: "fa-calculator", title: "Quantitative Aptitude", tags: "Topic-wise Practice", desc: "Practice questions with detailed explanations.", href: "/quiz" },
      { icon: "fa-brain", title: "Reasoning Ability", tags: "Logical & Analytical", desc: "Sharpen reasoning skills with practice sets.", href: "/quiz" },
      { icon: "fa-book-open", title: "English Language", tags: "Grammar · Vocabulary", desc: "Grammar, vocabulary & comprehension practice.", href: "/quiz" },
      { icon: "fa-globe", title: "General Awareness", tags: "Current Affairs · GK", desc: "Stay exam-ready with GK & current affairs quizzes.", href: "/quiz" },
    ],
  },
];

export default function CategoryExplorer() {
  const [active, setActive] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === active);

  return (
    <div className="cat-explorer">
      <div className="cat-tabs-row">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`cat-tab-card${active === tab.id ? " active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            <span className="cat-tab-label">{tab.label}</span>
            <span className="cat-tab-icon">
              <i className={`fas ${tab.icon}`}></i>
            </span>
          </button>
        ))}
      </div>

      <div className="cat-panel">
        <div className="cat-cards-grid">
          {activeTab.cards.map((card) => (
            <Link href={card.href} className="cat-card" key={card.title}>
              <i className={`fas ${card.icon} cat-card-watermark`}></i>
              <div className="cat-card-icon">
                <i className={`fas ${card.icon}`}></i>
              </div>
              <h4>{card.title}</h4>
              <span className="cat-card-tags">{card.tags}</span>
              <p>{card.desc}</p>
              <span className="cat-card-link">
                Explore <i className="fas fa-arrow-right"></i>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
