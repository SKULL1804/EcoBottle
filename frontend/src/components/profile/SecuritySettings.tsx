"use client";

import { useState } from "react";

const PASSWORD_RULES = [
  { icon: "check_circle", label: "Minimal 8 karakter", met: true },
  { icon: "check_circle", label: "Huruf besar & kecil", met: true },
  { icon: "check_circle", label: "Mengandung angka", met: false },
  { icon: "check_circle", label: "Karakter spesial (!@#$)", met: false },
];

const SECURITY_TIPS = [
  {
    icon: "shield",
    title: "Gunakan password unik",
    description: "Jangan gunakan password yang sama untuk akun lain.",
  },
  {
    icon: "sync_lock",
    title: "Ganti secara berkala",
    description: "Ubah password setiap 3-6 bulan untuk keamanan optimal.",
  },
  {
    icon: "password",
    title: "Hindari info pribadi",
    description: "Jangan masukkan nama, tanggal lahir, atau nomor telepon.",
  },
];

export default function SecuritySettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left — Password Form */}
      <div className="lg:col-span-3 space-y-6">
        {/* Change Password Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 rounded-xl flex items-center justify-center">
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

            {/* Password Requirements */}
            <div className="p-4 bg-surface rounded-xl">
              <p className="text-tertiary text-[11px] font-semibold uppercase tracking-wider mb-3">
                Persyaratan Password
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PASSWORD_RULES.map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-sm ${
                        rule.met ? "text-primary" : "text-outline"
                      }`}
                      style={{
                        fontVariationSettings: rule.met
                          ? '"FILL" 1'
                          : '"FILL" 0',
                      }}
                    >
                      {rule.met ? "check_circle" : "circle"}
                    </span>
                    <span
                      className={`text-xs ${
                        rule.met
                          ? "text-on-surface font-medium"
                          : "text-tertiary"
                      }`}
                    >
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
          {/* <Link
            href="/dashboard/profile"
            className="px-6 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors text-center"
          >
            Kembali
          </Link> */}
        </div>
      </div>

      {/* Right — Security Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Security Status */}
        <div className="bg-linear-to-br from-on-primary-container to-primary rounded-2xl p-6 text-on-primary shadow-xl relative overflow-hidden">
          <div className="absolute -top-14 -right-14 w-40 h-40 bg-primary-fixed/8 rounded-full blur-3xl" />
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto bg-surface-container-lowest/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                verified_user
              </span>
            </div>
            <h4 className="text-xl font-black font-headline mb-1">
              Akun Terlindungi
            </h4>
            <p className="text-primary-fixed/70 text-sm">
              Password terakhir diubah 30 hari lalu
            </p>
            <div className="mt-4 flex items-center justify-center gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full ${
                    i <= 3
                      ? "w-8 bg-primary-fixed/60"
                      : "w-8 bg-surface-container-lowest/20"
                  }`}
                />
              ))}
              <span className="text-primary-fixed text-[11px] font-bold ml-2">
                Kuat
              </span>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <h4 className="font-bold text-on-surface font-headline mb-4">
            Tips Keamanan
          </h4>
          <div className="space-y-4">
            {SECURITY_TIPS.map((tip) => (
              <div key={tip.title} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">
                    {tip.icon}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">
                    {tip.title}
                  </p>
                  <p className="text-tertiary text-[11px] leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Activity */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <h4 className="font-bold text-on-surface font-headline mb-4">
            Aktivitas Terakhir
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">
                  login
                </span>
                <div>
                  <p className="text-on-surface text-xs font-bold">Login</p>
                  <p className="text-tertiary text-[10px]">Chrome — macOS</p>
                </div>
              </div>
              <span className="text-tertiary text-[10px]">Hari ini</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">
                  key
                </span>
                <div>
                  <p className="text-on-surface text-xs font-bold">
                    Password diubah
                  </p>
                  <p className="text-tertiary text-[10px]">Via browser</p>
                </div>
              </div>
              <span className="text-tertiary text-[10px]">30 hari lalu</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">
                  person_add
                </span>
                <div>
                  <p className="text-on-surface text-xs font-bold">
                    Akun dibuat
                  </p>
                  <p className="text-tertiary text-[10px]">Pendaftaran awal</p>
                </div>
              </div>
              <span className="text-tertiary text-[10px]">Maret 2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
