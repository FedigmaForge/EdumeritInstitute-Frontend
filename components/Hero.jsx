import Link from "next/link";
import HeroBannerCarousel from "./HeroBannerCarousel";

export default function Hero() {
  return (
    <section className="hero-light" id="heroBanner">
      <div className="container hero-adda-grid">
        <div className="hero-intro-text">
          <span className="hero-badge-light">
            <i className="fas fa-graduation-cap"></i>
            <span>India's Trusted Coaching Institute</span>
          </span>
          <h1>
            Empowering Students to Achieve <span className="accent-text">Academic &amp; Career Excellence</span>
          </h1>

          <div className="hero-trending-row">
            <span className="hero-trending-label">Popular:</span>
            <Link href="/bank-exams" className="hero-trending-pill">
              IBPS PO 2026
            </Link>
            <Link href="/bank-exams" className="hero-trending-pill">
              IBPS/SBI Clerk
            </Link>
            <Link href="/ssc-exams" className="hero-trending-pill">
              SSC CGL
            </Link>
            <Link href="/quiz" className="hero-trending-pill">
              Free Mock Test
            </Link>
          </div>

          <div className="hero-cta-row">
            <a
              href="https://wa.me/919211278818?text=Hi%20EduMerit%20Institute,%20I%20want%20to%20book%20a%20free%20demo"
              target="_blank"
              rel="noreferrer"
              className="btn-accent"
            >
              <i className="fas fa-calendar-check"></i> Book Free Demo
            </a>
            <Link href="#courses" className="btn-outline">
              Explore Courses <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="hero-adda-visual">
          <HeroBannerCarousel />
        </div>
      </div>
    </section>
  );
}
