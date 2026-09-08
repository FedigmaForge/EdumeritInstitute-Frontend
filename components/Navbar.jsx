"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "https://courses.edumerits.in/", label: "Courses", external: true },
  {
    label: "Current Affairs",
    dropdown: [
      { href: "/current-affairs", label: "Current Affairs" },
      { href: "/daily-headlines", label: "Daily Headlines" },
    ],
  },
  { href: "/blog", label: "Blog" },
  {
    label: "Quiz",
    dropdown: [
      { href: "/quiz", label: "All Sets", icon: "fas fa-layer-group" },
      { href: "/quiz?category=Quantitative%20Aptitude", label: "Quantitative Aptitude", icon: "fas fa-calculator" },
      { href: "/quiz?category=Reasoning", label: "Reasoning", icon: "fas fa-brain" },
      { href: "/quiz?category=English", label: "English", icon: "fas fa-language" },
      { href: "/quiz?category=General%20Awareness", label: "Banking and General Awareness", icon: "fas fa-globe" },
      { href: "/quiz?category=Current%20Affairs", label: "Daily Current Affairs Quiz", icon: "fas fa-newspaper" },
      { href: "/current-affairs", label: "Weekly Current Affairs Quiz", icon: "fas fa-calendar-week" },
      { href: "/current-affairs", label: "Monthly Current Affairs Quiz", icon: "fas fa-calendar-alt" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

const SEARCH_INDEX = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/bank-exams", label: "Bank Exams — IBPS, SBI, RBI, RRB" },
  { href: "/ssc-exams", label: "SSC Exams — CGL, CHSL, MTS" },
  { href: "/current-affairs", label: "Current Affairs" },
  { href: "/daily-headlines", label: "Daily Headlines" },
  { href: "/blog", label: "Blog — Exam Notifications & Updates" },
  { href: "/quiz", label: "Quiz Bank" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setSearchOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    const onEscape = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [searchOpen]);

  const results =
    query.trim().length > 0
      ? SEARCH_INDEX.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()))
      : [];

  const isActive = (item) => {
    if (item.href) return pathname === item.href;
    return item.dropdown?.some((d) => d.href === pathname);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
        <div className="container nav-inner">
          <Link href="/" className="logo">
            <img src="/Logo/1.jpg" alt="EduMerit" />
            <span>EduMerit Institute</span>
          </Link>

          <ul className={`nav-links${menuOpen ? " active" : ""}`} id="navLinks">
            {NAV_ITEMS.map((item) => {
              if (item.dropdown) {
                const open = openDropdown === item.label;
                return (
                  <li key={item.label} className={`nav-dropdown${open ? " open" : ""}`}>
                    <button
                      type="button"
                      className={isActive(item) ? "active" : ""}
                      onClick={() => setOpenDropdown(open ? null : item.label)}
                    >
                      {item.label} <i className="fas fa-chevron-down"></i>
                    </button>
                    <ul className="nav-dropdown-menu">
                      {item.dropdown.map((sub) => (
                        <li key={sub.href}>
                          <Link href={sub.href} className={pathname === sub.href ? "active" : ""}>
                            {sub.icon && <i className={sub.icon} style={{ width: "16px", textAlign: "center", marginRight: "8px", color: "#4a90e2", fontSize: "12px" }}></i>}
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              if (item.external) {
                return (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link href={item.href} className={pathname === item.href ? "active" : ""}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-actions">
            <div className="nav-search nav-search-inline" ref={searchRef}>
              <i className="fas fa-search nav-search-icon"></i>
              <input
                type="text"
                placeholder="Search pages, exams, resources..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
              />
              {searchOpen && query.trim().length > 0 && (
                <ul className="nav-search-results">
                  {results.length === 0 && <li className="nav-search-empty">No matches found.</li>}
                  {results.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href}>{r.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <a
              href="https://wa.me/919211278818?text=Hi%20EduMerit%20Institute,%20I%20want%20to%20book%20a%20free%20demo"
              target="_blank"
              rel="noreferrer"
              className="nav-cta-btn"
            >
              Book Free Demo
            </a>
          </div>

          <button className="menu-toggle" id="menuToggle" onClick={() => setMenuOpen((v) => !v)}>
            <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </nav>
    </>
  );
}
