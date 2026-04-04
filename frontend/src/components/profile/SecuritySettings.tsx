"use client";

import { useState } from "react";
import Link from "next/link";

interface SecurityToggle {
  id: string;
  icon: string;
  label: string;
  description: string;
  enabled: boolean;
}

const INITIAL_TOGGLES: SecurityToggle[] = [
  {
    id: "2fa",
    icon: "security",
    label: "Two-Factor Auth (2FA)",
    description: "Tambahkan lapisan keamanan ekstra saat login",
    enabled: true,
  },
  {
    id: "biometric",
    icon: "fingerprint",
    label: "Login Biometrik",
    description: "Gunakan sidik jari atau Face ID untuk login",
    enabled: false,
  },
  {
    id: "login_alert",
    icon: "notifications_active",
    label: "Notifikasi Login",
    description: "Dapatkan notifikasi saat ada login baru di perangkat lain",
    enabled: true,
  },
  {
    id: "activity_log",
    icon: "visibility",
    label: "Log Aktivitas",
    description: "Simpan riwayat semua aktivitas akun Anda",
    enabled: true,
  },
];

const LOGIN_SESSIONS = [
  {
    device: "Chrome — macOS",
    location: "Jakarta, Indonesia",
    time: "Sedang aktif",
    current: true,
  },
  {
    device: "Safari — iPhone",
    location: "Jakarta, Indonesia",
    time: "2 jam lalu",
    current: false,
  },
  {
    device: "Chrome — Windows",
    location: "Bandung, Indonesia",
    time: "3 hari lalu",
    current: false,
  },
];

export default function SecuritySettings() {
  const [toggles, setToggles] = useState(INITIAL_TOGGLES);
  const [saved, setSaved] = useState(false);

  const handleToggle = (id: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <span className="material-symbols-outlined text-primary text-xl">
              lock
            </span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface font-headline">
              Ubah Password
            </h4>
            <p className="text-tertiary text-xs">
              Terakhir diubah 30 hari lalu
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">
              Password Lama
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">
                lock
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-outline"
              />
            </div>
          </div>
          <div>
            <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">
              Password Baru
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">
                key
              </span>
              <input
                type="password"
                placeholder="Minimal 8 karakter"
                className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-outline"
              />
            </div>
          </div>
          <div>
            <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">
                key
              </span>
              <input
                type="password"
                placeholder="Ulangi password baru"
                className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-outline"
              />
            </div>
          </div>
          <button className="py-3 px-6 gradient-primary text-on-primary font-bold rounded-xl text-sm shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
            Update Password
          </button>
        </div>
      </div>

      {/* Security Toggles */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <h4 className="font-bold text-on-surface font-headline mb-6">
          Pengaturan Keamanan
        </h4>

        <div className="space-y-3">
          {toggles.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 bg-surface rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">
                    {t.icon}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">
                    {t.label}
                  </p>
                  <p className="text-tertiary text-[11px]">{t.description}</p>
                </div>
              </div>
              {/* Toggle */}
              <button
                onClick={() => handleToggle(t.id)}
                className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-300 ${
                  t.enabled ? "bg-primary" : "bg-outline-variant"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-surface-container-lowest rounded-full shadow-md transition-transform duration-300 ${
                    t.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-on-surface font-headline">
            Sesi Aktif
          </h4>
          <button className="text-error text-xs font-bold hover:underline">
            Logout Semua
          </button>
        </div>

        <div className="space-y-3">
          {LOGIN_SESSIONS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl ${
                s.current
                  ? "bg-primary/5 border border-primary/15"
                  : "bg-surface"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    s.current
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-outline"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {s.device.includes("iPhone")
                      ? "smartphone"
                      : "computer"}
                  </span>
                </div>
                <div>
                  <p
                    className={`font-bold text-sm ${
                      s.current ? "text-primary" : "text-on-surface"
                    }`}
                  >
                    {s.device}
                    {s.current && (
                      <span className="text-[10px] text-primary font-medium ml-2">
                        (Perangkat ini)
                      </span>
                    )}
                  </p>
                  <p className="text-tertiary text-[11px]">
                    {s.location} • {s.time}
                  </p>
                </div>
              </div>
              {!s.current && (
                <button className="text-error text-xs font-bold bg-error/8 px-3 py-1.5 rounded-full hover:bg-error/15 transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-error/10">
        <h4 className="font-bold text-error font-headline mb-2">
          Zona Berbahaya
        </h4>
        <p className="text-tertiary text-xs mb-4">
          Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.
        </p>
        <div className="flex gap-3">
          <button className="px-5 py-3 bg-error/10 text-error font-bold rounded-xl text-sm hover:bg-error/20 transition-colors">
            Nonaktifkan Akun
          </button>
          <button className="px-5 py-3 bg-error text-on-error font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
            Hapus Akun
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-4 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">
            {saved ? "check_circle" : "save"}
          </span>
          {saved ? "Tersimpan!" : "Simpan Pengaturan"}
        </button>
        <Link
          href="/dashboard/profile"
          className="px-6 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors text-center"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
