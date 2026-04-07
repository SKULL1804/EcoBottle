"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const MENU_ITEMS = [
  // { icon: "person", label: "Edit Profil", description: "Ubah nama, email, dan foto profil", href: "/dashboard/profile/edit" },
  { icon: "lock", label: "Keamanan", description: "Password, 2FA, dan privasi", href: "/dashboard/profile/security" },
  { icon: "language", label: "Bahasa", description: "Indonesia" },
  { icon: "help", label: "Bantuan & FAQ", description: "Pusat bantuan dan pertanyaan" },
  { icon: "description", label: "Syarat & Ketentuan", description: "Kebijakan privasi dan ToS" },
];

export default function SettingsMenu() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <h4 className="font-bold text-on-surface font-headline mb-6">Pengaturan</h4>

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

          return item.href ? (
            <Link key={item.label} href={item.href} className="w-full flex items-center justify-between p-4 rounded-xl transition-all group hover:bg-surface-container-low">{inner}</Link>
          ) : (
            <button key={item.label} className="w-full flex items-center justify-between p-4 rounded-xl transition-all group hover:bg-surface-container-low">{inner}</button>
          );
        })}

        <div className="lg:hidden border-t border-surface-container my-3" />
        <button onClick={handleLogout} className="lg:hidden w-full flex items-center justify-between p-4 rounded-xl transition-all group hover:bg-error-container/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-xl">logout</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-error text-sm">Keluar</p>
              <p className="text-tertiary text-[11px]">Logout dari akun Anda</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
