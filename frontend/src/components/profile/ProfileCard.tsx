"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProfileCard() {
  const { user } = useAuth();
  if (!user) return null;

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("id", { month: "long", year: "numeric" })
    : "Baru bergabung";

  return (
    <div className="bg-linear-to-br from-on-primary-container to-primary rounded-2xl p-8 text-on-primary shadow-xl relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary-fixed/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-surface-container-lowest/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-lowest/20 shadow-2xl mb-4 relative flex items-center justify-center bg-primary-container">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-on-primary font-bold text-3xl">{user.name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <h3 className="text-2xl font-black font-headline tracking-tight">{user.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-surface-container-lowest/15 backdrop-blur-sm text-primary-fixed px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
            {(user.level_title || "PEMULA").toUpperCase()}
          </span>
          <span className="bg-surface-container-lowest/15 backdrop-blur-sm text-primary-fixed px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
            LEVEL {user.level || 1}
          </span>
        </div>

        <div className="mt-6 space-y-2 w-full">
          <div className="flex items-center justify-center gap-2 text-primary-fixed/70 text-sm">
            <span className="material-symbols-outlined text-base">mail</span>{user.email}
          </div>
          {user.phone && (
            <div className="flex items-center justify-center gap-2 text-primary-fixed/70 text-sm">
              <span className="material-symbols-outlined text-base">phone</span>{user.phone}
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-primary-fixed/70 text-sm">
            <span className="material-symbols-outlined text-base">calendar_month</span>Bergabung sejak {joinDate}
          </div>
        </div>

        <Link href="/dashboard/profile/edit" className="mt-6 px-6 py-3 bg-surface-container-lowest text-primary font-bold rounded-xl text-sm hover:scale-[1.03] active:scale-[0.97] transition-transform shadow-lg">
          Edit Profil
        </Link>
      </div>
    </div>
  );
}
