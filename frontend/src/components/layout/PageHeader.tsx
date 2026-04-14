"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { TranslationKey } from "@/lib/translations";

interface PageHeaderProps {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  backHref?: string;
  badgeIcon?: string;
  badgeText?: string | React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  titleKey,
  descKey,
  backHref,
  badgeIcon,
  badgeText,
  rightElement,
  className,
}: PageHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className={`flex flex-wrap justify-between items-start gap-3 mb-6 md:mb-8 ${className ?? ""}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {backHref && (
          <Link
            href={backHref}
            className="hidden lg:flex p-2.5 bg-surface-container-low rounded-full text-on-surface hover:bg-surface-container transition-colors items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        )}
        <div className="min-w-0">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-background font-headline">
            {t(titleKey)}
          </h2>
          <p className="text-tertiary text-sm md:text-base">{t(descKey)}</p>
        </div>
      </div>

      {rightElement && <div className="shrink-0">{rightElement}</div>}

      {badgeIcon && badgeText && (
        <div className="flex items-center gap-2 bg-secondary-container px-3 py-1.5 md:px-4 md:py-2 rounded-full shrink-0">
          <span
            className="material-symbols-outlined text-primary text-base md:text-lg"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            {badgeIcon}
          </span>
          <span className="text-on-secondary-container text-xs md:text-sm font-bold">
            {badgeText}
          </span>
        </div>
      )}
    </header>
  );
}
