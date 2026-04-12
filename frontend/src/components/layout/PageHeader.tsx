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
}

export default function PageHeader({
  titleKey,
  descKey,
  backHref,
  badgeIcon,
  badgeText,
  rightElement,
}: PageHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        {backHref && (
          <Link
            href={backHref}
            className="p-2.5 bg-surface-container-low rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        )}
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-background font-headline">
            {t(titleKey)}
          </h2>
          <p className="text-tertiary">{t(descKey)}</p>
        </div>
      </div>

      {rightElement}

      {badgeIcon && badgeText && (
        <div className="flex items-center gap-2 bg-secondary-container px-4 py-2 rounded-full">
          <span
            className="material-symbols-outlined text-primary text-lg"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            {badgeIcon}
          </span>
          <span className="text-on-secondary-container text-sm font-bold">
            {badgeText}
          </span>
        </div>
      )}
    </header>
  );
}
