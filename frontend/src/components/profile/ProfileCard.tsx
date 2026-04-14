"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfileCard() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  if (!user) return null;

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(
        lang === "id" ? "id" : "en-GB",
        { month: "long", year: "numeric" },
      )
    : t("new_member");

  return (
    <div className="bg-linear-to-br from-on-primary-container to-primary rounded-2xl p-6 md:p-8 text-on-primary shadow-xl relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary-fixed/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-surface-container-lowest/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-surface-container-lowest/20 shadow-2xl mb-4 relative flex items-center justify-center bg-primary-container">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-on-primary font-bold text-2xl md:text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <h3 className="text-xl md:text-2xl font-black font-headline tracking-tight">
          {user.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-surface-container-lowest/15 backdrop-blur-sm text-primary-fixed px-3 py-1 rounded-full text-[10px] md:text-[11px] font-bold tracking-wider">
            {(user.level_title || "PEMULA").toUpperCase()}
          </span>
          <span className="bg-surface-container-lowest/15 backdrop-blur-sm text-primary-fixed px-3 py-1 rounded-full text-[10px] md:text-[11px] font-bold tracking-wider">
            LEVEL {user.level || 1}
          </span>
        </div>

        <div className="mt-4 md:mt-6 space-y-2 w-full">
          <div className="flex items-center justify-center gap-2 text-primary-fixed/70 text-xs md:text-sm">
            <span className="material-symbols-outlined text-base">mail</span>
            {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center justify-center gap-2 text-primary-fixed/70 text-xs md:text-sm">
              <span className="material-symbols-outlined text-base">phone</span>
              {user.phone}
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-primary-fixed/70 text-xs md:text-sm">
            <span className="material-symbols-outlined text-base">
              calendar_month
            </span>
            {t("joined_since")} {joinDate}
          </div>
        </div>

        <Link
          href="/dashboard/profile/edit"
          className="mt-5 md:mt-6 px-6 py-2.5 md:py-3 bg-surface-container-lowest text-primary font-bold rounded-xl text-sm hover:scale-[1.03] active:scale-[0.97] transition-transform shadow-lg"
        >
          {t("edit_profile")}
        </Link>
      </div>
    </div>
  );
}
