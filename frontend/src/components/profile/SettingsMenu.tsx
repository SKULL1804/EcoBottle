"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSheet from "./LanguageSheet";
import FAQSheet from "./FAQSheet";
import ToSSheet from "./ToSSheet";

export default function SettingsMenu() {
  const { logout } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [faqSheetOpen, setFaqSheetOpen] = useState(false);
  const [tosSheetOpen, setTosSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const MENU_ITEMS = [
    {
      icon: "lock",
      label: t("security"),
      description: t("security_desc"),
      href: "/dashboard/profile/security",
    },
    {
      icon: "language",
      label: t("language"),
      description: lang === "id" ? t("lang_id") : t("lang_en"),
      onClick: () => setLangSheetOpen(true),
    },
    {
      icon: "help",
      label: t("faq"),
      description: t("faq_desc"),
      onClick: () => setFaqSheetOpen(true),
    },
    {
      icon: "description",
      label: t("tos"),
      description: t("tos_desc"),
      onClick: () => setTosSheetOpen(true),
    },
  ];

  return (
    <>
      <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <h4 className="font-bold text-on-surface font-headline mb-6">{t("settings")}</h4>

        <div className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const inner = (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-on-surface text-sm">{item.label}</p>
                    <p className="text-tertiary text-[11px]">{item.description}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-lg group-hover:text-primary transition-colors">chevron_right</span>
              </>
            );

            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className="w-full flex items-center justify-between p-4 rounded-xl transition-all group hover:bg-surface-container-low">
                  {inner}
                </Link>
              );
            }

            return (
              <button key={item.label} onClick={item.onClick} className="w-full flex items-center justify-between p-4 rounded-xl transition-all group hover:bg-surface-container-low">
                {inner}
              </button>
            );
          })}

          <div className="lg:hidden border-t border-surface-container my-3" />
          <button onClick={handleLogout} className="lg:hidden w-full flex items-center justify-between p-4 rounded-xl transition-all group hover:bg-error-container/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-xl">logout</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-error text-sm">{t("logout")}</p>
                <p className="text-tertiary text-[11px]">{t("logout_desc")}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <LanguageSheet open={langSheetOpen} onClose={() => setLangSheetOpen(false)} />
      <FAQSheet open={faqSheetOpen} onClose={() => setFaqSheetOpen(false)} />
      <ToSSheet open={tosSheetOpen} onClose={() => setTosSheetOpen(false)} />
    </>
  );
}
