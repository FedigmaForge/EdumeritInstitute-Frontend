"use client";

import { useState } from "react";
import CurrentAffairsList from "./CurrentAffairsList";
import CaQuizPanel, { CA_QUIZ_TYPE_LABELS } from "./CaQuizPanel";

export default function CurrentAffairsSection() {
  const [activeType, setActiveType] = useState(null); // null | 'daily' | 'weekly' | 'monthly'

  return (
    <>
      <section className="ca-quiz-cta-section">
        <div className="container">
          <div className="ca-quiz-cta-row">
            {Object.keys(CA_QUIZ_TYPE_LABELS).map((t) => (
              <button
                key={t}
                type="button"
                className={`hero-stat-pill hero-quiz-cta${activeType === t ? " active" : ""}`}
                onClick={() => setActiveType(t)}
              >
                <i className="fas fa-pen-to-square"></i> {CA_QUIZ_TYPE_LABELS[t]} Quiz
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeType && <CaQuizPanel type={activeType} onClose={() => setActiveType(null)} />}

      <section className="affairs-page-section" style={activeType ? { display: "none" } : undefined}>
        <div className="container">
          <CurrentAffairsList />
        </div>
      </section>
    </>
  );
}
