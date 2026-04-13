"use client";

import { NAV_LINKS } from "@/constants/landing";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    // Dynamic scroll tracking observer for active links
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      id="main-nav"
      className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant/30 transition-all"
    >
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        {/* Themed Logo matching Login/Register styling */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-on-primary-container to-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              recycling
            </span>
          </div>
          <div className="text-2xl font-extrabold tracking-tight text-primary font-headline">
            EcoBottle
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === `#${activeSection}`;
            return (
              <Link
                key={link.label}
                className={
                  isActive
                    ? "text-primary font-extrabold transition-colors duration-300 pointer-events-none"
                    : "text-tertiary font-medium hover:text-primary transition-colors duration-300"
                }
                href={link.href}
                onClick={() => setActiveSection(link.href.replace("#", ""))}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Themed CTA Button */}
        <Link
          href="/login"
          id="nav-cta"
          className="bg-linear-to-br from-on-primary-container to-primary text-on-primary px-7 py-2.5 rounded-full font-bold shadow-md shadow-primary/20 scale-95 duration-200 transition-transform hover:scale-100 active:scale-95 flex items-center gap-2"
        >
          <span>Masuk</span>
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </Link>
      </div>
    </nav>
  );
}
