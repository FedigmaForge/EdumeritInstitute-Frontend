export const metadata = {
  title: "About Us",
  description:
    "Learn about EduMerit Institute, Greater Noida — our mission, teaching approach, and commitment to Class 2–10 academics and banking & SSC exam coaching.",
  alternates: { canonical: "/about-us" },
  openGraph: { title: "About EduMerit Institute", description: "Our mission, teaching approach, and commitment to student success in Greater Noida.", url: "/about-us" },
};

export default function AboutUsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-breadcrumb">
            <a href="/">
              <i className="fas fa-home"></i> Home
            </a>
            <i className="fas fa-chevron-right"></i>
            <span>About Us</span>
          </div>
          <div className="page-hero-body">
            <div className="page-hero-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <div>
              <h1>About Us – Edumerit</h1>
              <p>Empowering minds, shaping futures through excellence in education</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-content-section">
        <div className="container">
          <div className="about-main" data-aos="fade-up">
            <div>
              <p>
                At Edumerit, we believe that true education goes beyond textbooks — it builds confidence, sharpens
                thinking, and prepares students for real-world challenges.
              </p>
              <p>
                We are a dedicated academic institute committed to nurturing young minds from Class 2 to Class 10,
                providing a strong foundation in core subjects while ensuring conceptual clarity and academic
                excellence.
              </p>
              <p>
                What makes Edumerit unique is our integrated approach to learning. Along with school academics, we
                actively prepare students for competitive examinations such as Olympiads and NTSE, helping them
                develop analytical thinking, problem-solving skills, and exam confidence from an early stage.
              </p>
              <p>
                In addition to school education, Edumerit also offers specialized coaching for Banking Exams, in
                collaboration with the reputed Institute of Banking Studies, Trivandrum. This ensures that students
                and aspirants receive expert guidance aligned with industry standards.
              </p>
            </div>
          </div>

          <div className="mission-vision-grid" data-aos="fade-up" data-aos-delay="200">
            <div className="mv-card">
              <div className="mv-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Our Mission</h3>
              <p>
                To empower students with knowledge, skills, and confidence so they can excel academically and
                succeed in competitive environments.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3>Our Vision</h3>
              <p>
                To become a trusted educational hub that transforms students into achievers through innovative
                teaching methods and holistic development.
              </p>
            </div>
          </div>

          <div className="why-choose-section" data-aos="fade-up" data-aos-delay="300">
            <h2>Why Choose Edumerit?</h2>
            <div className="divider"></div>
            <ul className="check-list-large">
              <li>
                <i className="fas fa-check-circle"></i> Strong academic foundation (Class 2–10)
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Early preparation for Olympiads &amp; NTSE
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Expert-designed curriculum and teaching methods
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Banking exam coaching with trusted institutional
                collaboration
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Focus on conceptual clarity and performance improvement
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Supportive learning environment for every student
              </li>
            </ul>
          </div>

          <div className="approach-section" data-aos="fade-up" data-aos-delay="400">
            <h2>Our Approach</h2>
            <div className="divider"></div>
            <p>At Edumerit, we don't just teach — we mentor, guide and inspire. Our teaching methodology focuses on:</p>
            <div className="approach-grid">
              <div className="approach-item">
                <i className="fas fa-lightbulb"></i>
                <span>Concept-based learning</span>
              </div>
              <div className="approach-item">
                <i className="fas fa-chart-line"></i>
                <span>Regular assessments &amp; performance tracking</span>
              </div>
              <div className="approach-item">
                <i className="fas fa-user-graduate"></i>
                <span>Personalized attention</span>
              </div>
              <div className="approach-item">
                <i className="fas fa-trophy"></i>
                <span>Competitive exam readiness from an early stage</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
