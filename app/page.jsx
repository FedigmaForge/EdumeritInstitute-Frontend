import Link from "next/link";
import Hero from "@/components/Hero";
import Counter from "@/components/Counter";
import CategoryExplorer from "@/components/CategoryExplorer";
import BankExamSpotlight from "@/components/BankExamSpotlight";
import MockTestSpotlight from "@/components/MockTestSpotlight";
import CurrentAffairsSpotlight from "@/components/CurrentAffairsSpotlight";
import BlogSpotlight from "@/components/BlogSpotlight";
import FaqAccordion from "@/components/FaqAccordion";
import { FAQ_CATEGORIES } from "@/components/faqData";
import SuccessStories from "@/components/SuccessStories";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
    cat.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />

      <div className="stats-float-wrap">
        <div className="stats-float-card">
          <Counter target={150} suffix="+" icon="fas fa-user-graduate" label="Students Enrolled" />
          <Counter target={25} suffix="+" icon="fas fa-book-open" label="Courses Available" />
          <Counter target={95} suffix="%" icon="fas fa-trophy" label="Success Rate" />
          <Counter target={12} suffix="+" icon="fas fa-chalkboard-teacher" label="Expert Faculty" />
        </div>
      </div>

      <section className="courses-section" id="courses">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">What We Offer</span>
            <h2>Explore Programs by Category</h2>
            <div className="divider"></div>
          </div>
          <CategoryExplorer />
        </div>
      </section>

      <BankExamSpotlight />

      <MockTestSpotlight />

      <CurrentAffairsSpotlight />

      <BlogSpotlight />

      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Advantages</span>
            <h2>Why Choose EduMerit Institute?</h2>
            <div className="divider"></div>
            <div className="why-choose-stats-inline">
              <span>
                <strong>95%</strong> Success Rate
              </span>
              <span className="why-choose-stats-divider"></span>
              <span>
                <strong>12+</strong> Expert Faculty
              </span>
            </div>
          </div>

          <div className="why-choose-cards">
            {[
              ["fa-video", "Live Classes", "Interactive live sessions with real-time doubt solving and student engagement."],
              ["fa-play-circle", "Recorded Lectures", "Access recorded classes anytime, anywhere for revision and flexible learning."],
              ["fa-clipboard-list", "Mock Tests", "Regular mock tests with detailed analysis to track your progress effectively."],
              ["fa-question-circle", "Doubt Solving", "Dedicated doubt clearing sessions to ensure complete understanding of concepts."],
              ["fa-chalkboard-teacher", "Expert Faculty", "Learn from experienced teachers with proven track records of success."],
              ["fa-certificate", "Study Materials", "Comprehensive study materials, notes and practice papers for thorough preparation."],
            ].map(([icon, title, desc], i) => (
              <div className="why-choose-card" key={title}>
                <div className={`why-choose-card-icon${i % 2 ? " alt" : ""}`}>
                  <i className={`fas ${icon}`}></i>
                </div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="get-in-touch-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Visit Us</span>
            <h2>Get in Touch with EduMerit Institute</h2>
            <div className="divider"></div>
          </div>
          <div className="git-grid">
            <div className="git-info">
              <div className="git-card">
                <div className="git-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4>Our Address</h4>
                  <p>
                    2nd Floor, ICON Nurturing Innocence, opposite to Bank of Maharashtra (Panchsheel Green), Greater
                    Noida, UP
                  </p>
                </div>
              </div>
              <div className="git-card">
                <div className="git-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4>Call Us</h4>
                  <p>
                    <a href="tel:+919211278818" style={{ color: "var(--navy)", textDecoration: "none", fontWeight: 600 }}>
                      +91 9211278818
                    </a>
                  </p>
                </div>
              </div>
              <div className="git-card">
                <div className="git-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4>Email Us</h4>
                  <p>
                    <a href="mailto:info@edumerits.co.in" style={{ color: "var(--navy)", textDecoration: "none", fontWeight: 600 }}>
                      info@edumerits.co.in
                    </a>
                  </p>
                </div>
              </div>
              <div className="git-card">
                <div className="git-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h4>Working Hours</h4>
                  <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
                </div>
              </div>
              <Link href="/contact" className="btn-primary" style={{ marginTop: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <i className="fas fa-directions"></i> Visit Our Institute Today
              </Link>
            </div>
            <div className="git-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.8854877127063!2d77.4454641!3d28.6075499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce951f540279b:0xcbcadfc998850c28!2sICON%20Nurturing%20Innocence%20Ajnara%20Homes!5e0!3m2!1sen!2sin!4v1748000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px", minHeight: "360px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="EduMerit Institute Location - Greater Noida"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <div className="divider"></div>
          </div>
          <div className="faq-wrap">
            <FaqAccordion />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Ready to Start Your Learning Journey?</h2>
          </div>
          <div className="cta-actions">
            <a
              href="https://wa.me/919211278818?text=Hi%20EduMerit%20Institute,%20I%20want%20to%20book%20a%20free%20demo"
              target="_blank"
              rel="noreferrer"
              className="btn-white"
            >
              <i className="fas fa-calendar-check"></i> Book Free Demo
            </a>
            <a
              href="https://wa.me/919211278818?text=Hi%20EduMerit%20Institute,%20I%20want%20to%20enroll%20now"
              target="_blank"
              rel="noreferrer"
              className="btn-outline-white"
            >
              <i className="fas fa-user-plus"></i> Enroll Now
            </a>
          </div>
        </div>
      </section>

      <section className="success-stories-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">
              <i className="fas fa-quote-left"></i> Success Stories
            </span>
            <h2>Hear It From Our Students &amp; Parents</h2>
            <div className="divider"></div>
          </div>

          <SuccessStories />

          <div className="success-stories-footer">
            <a
              href="https://www.youtube.com/channel/UCu2cD8WHMywQ0KlH54UnqwQ"
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              <i className="fab fa-youtube"></i> Watch More on YouTube
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
