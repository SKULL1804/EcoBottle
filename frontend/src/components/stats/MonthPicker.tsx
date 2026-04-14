"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function MonthPicker() {
  const { t, lang } = useLanguage();
  
  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", { month: "long" }), [lang]);
  const shortMonthFormatter = useMemo(() => new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", { month: "short" }), [lang]);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    // Don't go beyond current month
    const isCurrentMonth =
      year === now.getFullYear() && month === now.getMonth();
    if (isCurrentMonth) return;

    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const selectMonth = (m: number) => {
    // Don't allow future months in current year
    if (year === now.getFullYear() && m > now.getMonth()) return;
    setMonth(m);
    setOpen(false);
  };

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();

  return (
    <div className="flex items-center gap-1.5" ref={dropdownRef}>
      {/* Prev Button (always visible) */}
      <button
        onClick={goToPrevMonth}
        className="p-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-center shrink-0"
        aria-label="Previous month"
      >
        <span className="material-symbols-outlined text-on-surface text-base">
          chevron_left
        </span>
      </button>

      {/* Trigger Button + Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 bg-secondary-container px-3 py-2 md:px-4 md:py-2.5 rounded-full hover:bg-secondary-container/80 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-primary text-base md:text-lg">
            calendar_month
          </span>
          <span className="text-on-secondary-container text-xs md:text-sm font-bold">
            {shortMonthFormatter.format(new Date(year, month, 1))} {year}
          </span>
          <span
            className={`material-symbols-outlined text-on-secondary-container/60 text-base transition-transform ${open ? "rotate-180" : ""}`}
          >
            expand_more
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 bg-surface-container-lowest rounded-2xl shadow-[0px_24px_48px_rgba(17,28,45,0.15)] border border-outline-variant/10 overflow-hidden z-100 w-[280px]">
            {/* Year Navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10">
              <button
                onClick={() => setYear((y) => y - 1)}
                className="p-1.5 rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-on-surface text-lg">
                  chevron_left
                </span>
              </button>
              <span className="text-on-surface font-bold font-headline">
                {year}
              </span>
              <button
                onClick={() => {
                  if (year < now.getFullYear()) setYear((y) => y + 1);
                }}
                className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                  year >= now.getFullYear()
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-surface-container"
                }`}
                disabled={year >= now.getFullYear()}
              >
                <span className="material-symbols-outlined text-on-surface text-lg">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-1.5 p-3">
              {Array.from({ length: 12 }).map((_, i) => {
                const name = shortMonthFormatter.format(new Date(year, i, 1));
                const isFuture =
                  year === now.getFullYear() && i > now.getMonth();
                const isSelected = i === month && year === year;
                const isToday =
                  i === now.getMonth() && year === now.getFullYear();

                return (
                  <button
                    key={name}
                    onClick={() => !isFuture && selectMonth(i)}
                    disabled={isFuture}
                    className={`relative py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isSelected
                        ? "gradient-primary text-on-primary shadow-md shadow-primary/20 scale-[1.02]"
                        : isFuture
                          ? "text-outline/40 cursor-not-allowed"
                          : "text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {name}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="px-3 pb-3 flex gap-2">
              <button
                onClick={() => {
                  setMonth(now.getMonth());
                  setYear(now.getFullYear());
                  setOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/15 transition-colors"
              >
                {t("this_month") || "Bulan Ini"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={goToNextMonth}
        className={`p-1.5 rounded-full transition-colors flex items-center justify-center shrink-0 ${
          isCurrentMonth
            ? "bg-surface-container-low/50 text-outline/40 cursor-not-allowed"
            : "bg-surface-container-low hover:bg-surface-container"
        }`}
        disabled={isCurrentMonth}
        aria-label="Next month"
      >
        <span className="material-symbols-outlined text-on-surface text-base">
          chevron_right
        </span>
      </button>
    </div>
  );
}
