"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/lib/translations";

interface LanguageSheetProps {
  open: boolean;
  onClose: () => void;
}

const LANG_OPTIONS: {
  code: Lang;
  flag: string;
  native: string;
  label: string;
}[] = [
  { code: "id", flag: "🇮🇩", native: "Indonesia", label: "Bahasa Indonesia" },
  { code: "en", flag: "🇬🇧", native: "English", label: "English (UK)" },
];

export default function LanguageSheet({ open, onClose }: LanguageSheetProps) {
  const { lang, setLang, t } = useLanguage();

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSelect = (code: Lang) => {
    setLang(code);
    setTimeout(onClose, 150);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-60 bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-70 bg-surface-container-lowest rounded-t-3xl shadow-[0px_-8px_48px_rgba(17,28,45,0.12)] transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-10 h-1 bg-outline-variant rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container">
          <h3 className="font-bold text-on-surface font-headline text-lg">
            {t("choose_language")}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-tertiary hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2 pb-safe">
          {LANG_OPTIONS.map((opt) => {
            const isActive = lang === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-surface hover:bg-surface-container-low hover:border-outline-variant/30"
                }`}
              >
                {/* Flag */}
                <span className="text-3xl leading-none">{opt.flag}</span>

                {/* Labels */}
                <div className="flex-1">
                  <p
                    className={`font-bold text-sm ${isActive ? "text-primary" : "text-on-surface"}`}
                  >
                    {opt.native}
                  </p>
                  <p className="text-tertiary text-[11px] mt-0.5">
                    {opt.label}
                  </p>
                </div>

                {/* Active indicator */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isActive
                      ? "border-primary bg-primary"
                      : "border-outline-variant"
                  }`}
                >
                  {isActive && (
                    <span
                      className="material-symbols-outlined text-on-primary text-sm"
                      style={{ fontSize: "14px" }}
                    >
                      check
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Safe area bottom padding */}
        <div className="h-6" />
      </div>
    </>
  );
}
