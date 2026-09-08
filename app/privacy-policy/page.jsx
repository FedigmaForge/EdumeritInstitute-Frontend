export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for EduMerit Institute — how we collect, use, and protect your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1 data-aos="fade-up">Privacy Policy</h1>
          <p data-aos="fade-up" data-aos-delay="100">
            Your privacy and data protection are important to us
          </p>
        </div>
      </section>

      <section className="about-content-section">
        <div className="container">
          <div className="privacy-content" data-aos="fade-up">
            <div className="privacy-header">
              <h2>Privacy Policy</h2>
              <p className="domain">edumerits.co.in</p>
              <p className="last-updated">Last Updated: 15 March 2026</p>
            </div>

            <div className="privacy-intro">
              <p>
                Welcome to EduMerits (edumerits.co.in). Your privacy is important to us. This Privacy Policy
                explains how we collect, use, and protect your information when you visit our website.
              </p>
            </div>

            <div className="privacy-section">
              <h3>1. Information We Collect</h3>

              <h4>Personal Information</h4>
              <ul>
                <li>Name and phone number</li>
                <li>Email address</li>
                <li>Educational details</li>
                <li>Any information provided through forms or enquiries</li>
              </ul>

              <h4>Non-Personal Information</h4>
              <ul>
                <li>Browser type and device information</li>
                <li>IP address</li>
                <li>Pages visited on the website</li>
                <li>Time spent on the website</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3>2. How We Use Your Information</h3>
              <ul>
                <li>To provide educational services</li>
                <li>To respond to enquiries</li>
                <li>To contact you regarding courses or updates</li>
                <li>To improve our website and services</li>
                <li>To maintain internal records and analytics</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3>3. Sharing of Information</h3>
              <p>
                We do not sell, trade, or rent your personal information to third parties. Information may only be
                shared in the following circumstances:
              </p>
              <ul>
                <li>When required by law</li>
                <li>With trusted service providers who help operate the website</li>
                <li>To protect the rights and safety of our organization</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3>4. Cookies</h3>
              <p>
                Our website may use cookies to improve your browsing experience and understand website traffic and
                user behaviour. You may disable cookies through your browser settings.
              </p>
            </div>

            <div className="privacy-section">
              <h3>5. Data Security</h3>
              <p>
                We take reasonable measures to protect your personal information from unauthorized access, loss,
                misuse, or alteration. However, no method of internet transmission is completely secure.
              </p>
            </div>

            <div className="privacy-section">
              <h3>6. Third-Party Links</h3>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy
                practices of those websites and encourage you to review their individual privacy policies.
              </p>
            </div>

            <div className="privacy-section">
              <h3>7. Children's Information</h3>
              <p>
                Our website is intended for students and professionals seeking educational guidance. We do not
                knowingly collect personal information from children under the age of 13 without parental consent.
              </p>
            </div>

            <div className="privacy-section">
              <h3>8. Changes to This Privacy Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with
                the updated date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div className="privacy-section">
              <h3>9. Contact Us</h3>
              <div className="contact-table">
                <div className="contact-row">
                  <span className="contact-label">Website:</span>
                  <span>https://edumerits.co.in</span>
                </div>
                <div className="contact-row">
                  <span className="contact-label">Email:</span>
                  <span>info@edumerits.co.in</span>
                </div>
                <div className="contact-row">
                  <span className="contact-label">Phone:</span>
                  <span>+91 9211278818</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
