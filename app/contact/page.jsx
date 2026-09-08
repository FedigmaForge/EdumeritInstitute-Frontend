import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact EduMerit Institute for academic coaching (Class 2–10) and banking exam preparation in Greater Noida. Call +91 9211278818 or visit us today.",
  keywords: "contact EduMerit, coaching institute Greater Noida, academic tuition contact, banking coaching enquiry",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact EduMerit Institute", description: "Reach EduMerit Institute in Greater Noida for admissions, course details, or any queries.", url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="contact-hero">
        <div className="contact-hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container contact-hero-inner">
          <div className="contact-hero-text" data-aos="fade-right" data-aos-duration="700">
            <div className="contact-hero-badge">
              <i className="fas fa-headset"></i>
              <span>We're Here to Help</span>
            </div>
            <h1>
              Get in Touch with
              <br />
              <span className="highlight">EduMerit Institute</span>
            </h1>
            <p>
              We are here to guide you towards academic excellence. Reach out to us for admissions, course details,
              or any queries.
            </p>
            <div className="trust-line">
              <i className="fas fa-shield-alt"></i>
              <span>Trusted by Hundreds of Students &amp; Parents</span>
            </div>
            <div className="hero-quick-links">
              <a href="tel:09211278818" className="hero-quick-btn">
                <i className="fas fa-phone"></i> Call Now
              </a>
              <a href="https://wa.me/919211278818" target="_blank" rel="noreferrer" className="hero-quick-btn whatsapp">
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
            </div>
          </div>
          <div className="contact-hero-visual" data-aos="fade-left" data-aos-duration="700">
            <div className="hero-card-stack">
              {[
                ["fa-graduation-cap", "150+", "Students Enrolled"],
                ["fa-star", "4.9/5", "Student Rating"],
                ["fa-trophy", "95%", "Success Rate"],
                ["fa-clock", "24hrs", "Response Time"],
              ].map(([icon, value, label]) => (
                <div className="hero-info-card" key={label}>
                  <i className={`fas ${icon}`}></i>
                  <div>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="container">
          <div className="contact-cards-grid">
            {[
              ["fa-map-marker-alt", "Our Address", "2nd Floor, ICON Nurturing Innocence, opposite to Bank of Maharashtra (Panchsheel Green), Greater Noida, UP", "https://maps.google.com/?q=ICON+Nurturing+Innocence+Ajnara+Homes", "Get Directions"],
              ["fa-phone-alt", "Phone Number", "09211278818", "tel:09211278818", "Call Now"],
              ["fa-envelope", "Email Address", "info@edumerits.co.in", "mailto:info@edumerits.co.in", "Send Email"],
              ["fa-globe", "Website", "edumerits.in", "https://edumerits.in", "Visit Site"],
            ].map(([icon, title, text, href, cta], i) => (
              <div className="contact-card" data-aos="fade-up" data-aos-delay={i * 100} key={title}>
                <div className="contact-card-icon">
                  <i className={`fas ${icon}`}></i>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card-link">
                  {cta} <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-main-section">
        <div className="container">
          <div className="contact-main-grid">
            <div className="contact-side-info" data-aos="fade-right" data-aos-duration="700">
              <div className="side-info-header">
                <span className="section-tag">Contact Us</span>
                <h2>Let's Start a Conversation</h2>
                <p>
                  Have questions about our courses or admissions? Fill in the form and our team will get back to
                  you within 24 hours.
                </p>
              </div>

              <ul className="side-contact-list">
                <li>
                  <div className="side-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <strong>Address</strong>
                    <span>
                      2nd Floor, ICON Nurturing Innocence, opposite to Bank of Maharashtra (Panchsheel Green),
                      Greater Noida, UP
                    </span>
                  </div>
                </li>
                <li>
                  <div className="side-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <a href="tel:09211278818">09211278818</a>
                  </div>
                </li>
                <li>
                  <div className="side-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:info@edumerits.co.in">info@edumerits.co.in</a>
                  </div>
                </li>
                <li>
                  <div className="side-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <strong>Working Hours</strong>
                    <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
                  </div>
                </li>
              </ul>

              <div className="side-social">
                <p>Follow us on social media</p>
                <div className="social-row">
                  <a href="https://www.facebook.com/profile.php?id=61588608520301" target="_blank" rel="noreferrer" className="soc-btn fb" aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://www.instagram.com/edumeritinstitute/" target="_blank" rel="noreferrer" className="soc-btn ig" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://www.youtube.com/channel/UCu2cD8WHMywQ0KlH54UnqwQ" target="_blank" rel="noreferrer" className="soc-btn yt" aria-label="YouTube">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/edumerit-institute/" target="_blank" rel="noreferrer" className="soc-btn li" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form-box" data-aos="fade-left" data-aos-duration="700">
              <div className="form-box-header">
                <h3>Send Us a Message</h3>
                <p>We'll respond within 24 hours</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="map-section-new">
        <div className="container">
          <div className="map-header" data-aos="fade-up">
            <span className="section-tag">Our Location</span>
            <h2>Find Us Here</h2>
            <p>Visit us at our institute in Greater Noida, UP</p>
          </div>
          <div className="map-embed-wrapper" data-aos="fade-up" data-aos-delay="100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.8854877127063!2d77.4454641!3d28.6075499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce951f540279b:0xcbcadfc998850c28!2sICON%20Nurturing%20Innocence%20Ajnara%20Homes!5e0!3m2!1sen!2sin!4v1748000000000!5m2!1sen!2sin"
              width="100%"
              height="460"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="EduMerit Institute Location"
            ></iframe>
            <div className="map-overlay-badge">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <strong>EduMerit Institute</strong>
                <span>Greater Noida, UP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-cta-section">
        <div className="contact-cta-shapes">
          <div className="cta-shape-1"></div>
          <div className="cta-shape-2"></div>
        </div>
        <div className="container contact-cta-inner" data-aos="fade-up">
          <div className="cta-icon-wrap">
            <i className="fas fa-rocket"></i>
          </div>
          <h2>Ready to Start Your Journey?</h2>
          <p>Join EduMerit and achieve your academic goals with expert guidance.</p>
          <div className="cta-btn-row">
            <a href="tel:09211278818" className="cta-btn-primary">
              <i className="fas fa-phone"></i> Enroll Now
            </a>
            <a href="https://wa.me/919211278818" target="_blank" rel="noreferrer" className="cta-btn-outline">
              <i className="fab fa-whatsapp"></i> Chat on WhatsApp
            </a>
          </div>
          <div className="cta-trust">
            <i className="fas fa-users"></i>
            <span>Trusted by Hundreds of Students &amp; Parents</span>
          </div>
        </div>
      </section>
    </>
  );
}
