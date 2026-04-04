"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDE_NAV_ITEMS } from "@/constants/dashboard";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col p-4 space-y-2 h-screen w-64 bg-surface-container-low font-headline font-medium sticky top-0">
      {/* Brand */}
      <div className="px-4 py-6 mb-4">
        <h1 className="text-xl font-bold text-primary">EcoCollector</h1>
        <p className="text-xs text-tertiary">Premium Tier</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {SIDE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 px-4 py-3 bg-primary-fixed/15 text-primary rounded-xl transition-all duration-300 ease-in-out"
                  : "flex items-center gap-3 px-4 py-3 text-tertiary hover:bg-primary-fixed/8 transition-all duration-300 ease-in-out"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* CTA Card */}
      <div className="mt-auto p-4 bg-primary rounded-2xl text-on-primary">
        <p className="text-xs opacity-80 mb-2">Ready to contribute?</p>
        <button className="w-full py-2 bg-surface-container-lowest text-primary font-bold rounded-xl text-sm">
          Recycle Now
        </button>
      </div>
    </aside>
  );
}
