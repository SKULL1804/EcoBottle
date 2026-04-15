"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_ITEMS } from "@/constants/dashboard";
import { useLanguage } from "@/context/LanguageContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-end pt-2 pb-4 px-2 bg-surface-container-lowest/70 backdrop-blur-xl z-50 rounded-t-3xl shadow-[0px_-4px_24px_rgba(0,0,0,0.04)]">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const navKey = `${item.label.toLowerCase()}` as Parameters<typeof t>[0];
        return (
          <Link
            key={item.label}
            href={item.href}
            className={
              isActive
                ? "flex flex-col items-center justify-center gradient-primary text-on-primary rounded-full p-3 mb-3 scale-110 shadow-lg w-[52px] h-[52px] transition-transform active:scale-90 duration-150"
                : "flex flex-col items-center justify-center text-outline p-2 hover:text-primary transition-transform active:scale-90 duration-150 min-w-[44px]"
            }
          >
            <span className="material-symbols-outlined flex items-center justify-center text-[22px]">{item.icon}</span>
            <span className={`font-headline font-semibold transition-all ${isActive ? "text-[9px] mt-0.5" : "text-[9px] mt-0.5 opacity-60"}`}>
              {t(navKey) || item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
