"use client";

import { useState } from "react";
import { FAQ_CATEGORIES } from "./faqData";

export default function FaqAccordion() {
  const [activeCat, setActiveCat] = useState(FAQ_CATEGORIES[0].id);
  const [openIndex, setOpenIndex] = useState(0);

  const category = FAQ_CATEGORIES.find((c) => c.id === activeCat);

  const selectCategory = (id) => {
    setActiveCat(id);
    setOpenIndex(0);
  };

  return (
    <div>
      <div className="faq-tabs-row">
        {FAQ_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`faq-tab-pill${activeCat === cat.id ? " active" : ""}`}
            onClick={() => selectCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {category.faqs.map((item, index) => {
          const isOpen = index === openIndex;
          return (
            <div className={`faq-item${isOpen ? " open" : ""}`} key={item.q}>
              <button className="faq-question" onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                <span>{item.q}</span>
                <i className={`fas ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </button>
              {isOpen && <div className="faq-answer">{item.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
