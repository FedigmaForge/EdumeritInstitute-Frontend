"use client";

import { useState } from "react";

export default function SyllabusTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].id);

  return (
    <>
      <div className="syllabus-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn${active === tab.id ? " active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} className={`tab-content${active === tab.id ? " active" : ""}`} id={tab.id}>
          <ul className="syllabus-list">
            {tab.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
