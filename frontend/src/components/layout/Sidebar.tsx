"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SIDE_NAV_ITEMS } from "@/constants/dashboard";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col p-4 space-y-2 h-screen w-64 bg-surface-container-low font-headline font-medium sticky top-0">
      {/* Brand */}
      <div className="px-4 py-6 mb-4">
        <h1 className="text-xl font-bold text-primary">EcoBottle</h1>
        {user && <p className="text-xs text-tertiary mt-1">{user.level_title}</p>}
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3 mb-2 flex items-center gap-3">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-on-surface text-sm truncate">{user.name}</p>
            <p className="text-tertiary text-[10px] truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {SIDE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.label} href={item.href} className={
              isActive
                ? "flex items-center gap-3 px-4 py-3 bg-primary-fixed/15 text-primary rounded-xl transition-all duration-300 ease-in-out"
                : "flex items-center gap-3 px-4 py-3 text-tertiary hover:bg-primary-fixed/8 transition-all duration-300 ease-in-out"
            }>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-tertiary hover:bg-error/10 hover:text-error rounded-xl transition-all">
        <span className="material-symbols-outlined">logout</span>
        <span>Keluar</span>
      </button>
    </aside>
  );
}
