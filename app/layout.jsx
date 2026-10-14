import "./styles/style.css";
import "./styles/pages.css";
import "./styles/contact.css";
import "./styles/home.css";
import "./styles/mock-test.css";
import "aos/dist/aos.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollTopButton from "@/components/ScrollTopButton";
import AosInit from "@/components/AosInit";

const SITE_URL = "https://edumerits.in";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EduMerit Institute | Best Coaching for Class 2–10 & Banking Exams in Greater Noida",
    template: "%s | EduMerit Institute",
  },
  description:
    "EduMerit Institute, Greater Noida — expert academic coaching for Class 2–10 and banking & SSC exam preparation (IBPS, SBI, RBI, SSC CGL). Small batches, expert faculty, regular mock tests.",
  keywords:
    "best coaching institute Greater Noida, banking exam coaching Greater Noida, IBPS PO coaching, SBI PO coaching, SSC CGL coaching Greater Noida, academic coaching class 2 to 10, tuition classes Greater Noida",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  alternates: { canonical: "/" },
  openGraph: {
    title: "EduMerit Institute | Best Coaching for Class 2–10 & Banking Exams in Greater Noida",
    description:
      "Expert academic coaching for Class 2–10 and banking & SSC exam preparation in Greater Noida. Small batches, expert faculty, regular mock tests.",
    url: SITE_URL,
    siteName: "EduMerit Institute",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/Logo/EdumeritLogo.svg", width: 512, height: 512, alt: "EduMerit Institute" }],
  },
  twitter: {
    card: "summary",
    title: "EduMerit Institute | Best Coaching for Class 2–10 & Banking Exams in Greater Noida",
    description:
      "Expert academic coaching for Class 2–10 and banking & SSC exam preparation in Greater Noida.",
    images: ["/Logo/EdumeritLogo.svg"],
  },
  icons: {
    icon: "/Logo/EdumeritLogo.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1f44",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "EduMerit Institute",
  description: "Coaching institute for Class 2-10 academics and Banking & SSC exam preparation in Greater Noida",
  url: SITE_URL,
  logo: `${SITE_URL}/Logo/EdumeritLogo.svg`,
  telephone: "+919211278818",
  email: "info@edumerits.co.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, ICON Nurturing Innocence, opposite to Bank of Maharashtra, Panchsheel Green",
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  areaServed: "Greater Noida, Uttar Pradesh, India",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61588608520301",
    "https://www.instagram.com/edumeritinstitute/",
    "https://www.youtube.com/channel/UCu2cD8WHMywQ0KlH54UnqwQ",
    "https://www.linkedin.com/in/edumerit-institute/",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Baloo+2:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-16945460526" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16945460526');
          `}
        </Script>
        <AosInit />
        <Navbar />
        {children}
        <Footer />
        <ScrollTopButton />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
