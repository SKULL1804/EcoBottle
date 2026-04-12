"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type TranslationKey, type Lang } from "@/lib/translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    const stored = localStorage.getItem("eco_lang") as Lang | null;
    if (stored === "id" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("eco_lang", newLang);
  };

  const t = (key: TranslationKey): string => {
    return (translations[lang] as Record<string, string>)[key]
      ?? (translations.id as Record<string, string>)[key]
      ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
