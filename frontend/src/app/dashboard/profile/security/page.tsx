import type { Metadata } from "next";
import Link from "next/link";
import SecuritySettings from "@/components/profile/SecuritySettings";

export const metadata: Metadata = {
  title: "Keamanan — EcoBottle",
  description:
    "Kelola password, 2FA, sesi login, dan pengaturan keamanan akun.",
};

export default function SecurityPage() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/profile"
            className="p-2.5 bg-surface-container-low rounded-full text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-background font-headline">
              Keamanan
            </h2>
            <p className="text-tertiary">
              Password, 2FA, dan sesi aktif
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl">
        <SecuritySettings />
      </div>
    </>
  );
}
