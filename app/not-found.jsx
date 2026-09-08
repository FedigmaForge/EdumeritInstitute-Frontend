import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
      <div className="container">
        <span className="section-tag">404</span>
        <h1 style={{ marginTop: "1rem" }}>Page Not Found</h1>
        <p style={{ color: "var(--text-gray)", marginTop: "0.5rem" }}>
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link href="/" className="btn-primary" style={{ display: "inline-flex", marginTop: "1.5rem" }}>
          <i className="fas fa-home"></i> Back to Home
        </Link>
      </div>
    </section>
  );
}
