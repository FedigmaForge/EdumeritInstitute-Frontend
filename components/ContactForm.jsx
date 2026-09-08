"use client";

import { useRef, useState } from "react";

export default function ContactForm() {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    const fields = form.querySelectorAll("[required]");
    const nextErrors = {};

    fields.forEach((field) => {
      if (!field.value.trim()) nextErrors[field.name || field.id] = true;
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setSuccess(true);
      form.reset();
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const clearError = (key) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const groupClass = (key) => `field-group${errors[key] ? " error" : ""}`;

  return (
    <form id="contactForm" className="inquiry-form" noValidate ref={formRef} onSubmit={handleSubmit}>
      <div className="form-row-2">
        <div className={groupClass("fullName")}>
          <label htmlFor="fullName">
            <i className="fas fa-user"></i> Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            required
            onInput={() => clearError("fullName")}
          />
          <span className="field-error">Please enter your name</span>
        </div>
        <div className={groupClass("phone")}>
          <label htmlFor="phone">
            <i className="fas fa-phone"></i> Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            required
            onInput={() => clearError("phone")}
          />
          <span className="field-error">Please enter a valid phone number</span>
        </div>
      </div>
      <div className={groupClass("email")}>
        <label htmlFor="email">
          <i className="fas fa-envelope"></i> Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          required
          onInput={() => clearError("email")}
        />
        <span className="field-error">Please enter a valid email</span>
      </div>
      <div className={groupClass("course")}>
        <label htmlFor="course">
          <i className="fas fa-book"></i> Course Interested In
        </label>
        <select id="course" name="course" required defaultValue="" onInput={() => clearError("course")}>
          <option value="" disabled>
            Select a course
          </option>
          <option value="academic">Academic (Class 2-10)</option>
          <option value="competitive">Competitive</option>
          <option value="ssc">SSC Exams</option>
          <option value="other">Other</option>
        </select>
        <span className="field-error">Please select a course</span>
      </div>
      <div className={groupClass("message")}>
        <label htmlFor="message">
          <i className="fas fa-comment-alt"></i> Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Write your message or query here..."
          required
          onInput={() => clearError("message")}
        ></textarea>
        <span className="field-error">Please enter your message</span>
      </div>
      <button type="submit" className="submit-inquiry-btn">
        <span>Submit Inquiry</span>
        <i className="fas fa-paper-plane"></i>
      </button>
      <div className="form-success-msg" id="formSuccess" style={{ display: success ? "flex" : "none" }}>
        <i className="fas fa-check-circle"></i>
        <span>Thank you! We'll get back to you within 24 hours.</span>
      </div>
    </form>
  );
}
