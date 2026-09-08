import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <div className="footer-logo">
            <img src="/Logo/1.jpg" alt="EduMerit" />
            <span>EduMerit Institute</span>
          </div>
          <p>
            Empowering minds and shaping futures through quality education. Join thousands of successful students
            who achieved their dreams with EduMerit.
          </p>
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=61588608520301" target="_blank" rel="noreferrer" className="fb" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/edumeritinstitute/" target="_blank" rel="noreferrer" className="ig" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/channel/UCu2cD8WHMywQ0KlH54UnqwQ" target="_blank" rel="noreferrer" className="yt" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.linkedin.com/in/edumerit-institute/" target="_blank" rel="noreferrer" className="li" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link href="/about-us">
                <i className="fas fa-chevron-right"></i> About Us
              </Link>
            </li>
            <li>
              <a href="https://www.youtube.com/channel/UCu2cD8WHMywQ0KlH54UnqwQ" target="_blank" rel="noreferrer">
                <i className="fab fa-youtube"></i> YouTube Channel
              </a>
            </li>
            <li>
              <Link href="/contact">
                <i className="fas fa-chevron-right"></i> Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy">
                <i className="fas fa-shield-alt"></i> Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Our Courses</h4>
          <ul>
            <li>
              <Link href="/bank-exams">
                <i className="fas fa-trophy"></i> Bank Exams
              </Link>
            </li>
            <li>
              <Link href="/ssc-exams">
                <i className="fas fa-file-alt"></i> SSC Exams
              </Link>
            </li>
            <li>
              <Link href="/current-affairs">
                <i className="fas fa-newspaper"></i> Current Affairs
              </Link>
            </li>
            <li>
              <Link href="/quiz">
                <i className="fas fa-question-circle"></i> Quiz Bank
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Info</h4>
          <ul className="footer-contact">
            <li>
              <i className="fas fa-phone"></i> <span>09211278818</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i> <span>info@edumerits.co.in</span>
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i>{" "}
              <span>
                2nd Floor, ICON Nurturing Innocence, opposite to Bank of Maharashtra (Panchsheel Green), Greater
                Noida, UP
              </span>
            </li>
            <li>
              <i className="fab fa-youtube"></i>{" "}
              <a
                href="https://www.youtube.com/channel/UCu2cD8WHMywQ0KlH54UnqwQ"
                target="_blank"
                rel="noreferrer"
                style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}
              >
                YouTube Channel
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; 2026 EduMerit Institute. All rights reserved.</p>
        <p>
          Developed by{" "}
          <a href="https://fedigmaforge.com" target="_blank" rel="noreferrer" style={{ color: "#e74c3c", textDecoration: "none" }}>
            Fedigma Forge
          </a>
        </p>
      </div>
    </footer>
  );
}
