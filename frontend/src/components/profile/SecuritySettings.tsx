"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const PASSWORD_RULES = [
  { label: "Minimal 8 karakter", check: (p: string) => p.length >= 8 },
  { label: "Huruf besar & kecil", check: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: "Mengandung angka", check: (p: string) => /\d/.test(p) },
  { label: "Karakter spesial (!@#$)", check: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const SECURITY_TIPS = [
  { icon: "shield", title: "Gunakan password unik", description: "Jangan gunakan password yang sama untuk akun lain." },
  { icon: "sync_lock", title: "Ganti secara berkala", description: "Ubah password setiap 3-6 bulan untuk keamanan optimal." },
  { icon: "password", title: "Hindari info pribadi", description: "Jangan masukkan nama, tanggal lahir, atau nomor telepon." },
];

export default function SecuritySettings() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = PASSWORD_RULES.map(r => ({ ...r, met: r.check(newPassword) }));
  const allMet = passwordChecks.every(r => r.met);
  const isValid = oldPassword.length > 0 && allMet && newPassword === confirmPassword;

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true); setError("");
    try {
      const { status, data } = await api("POST", "/auth/reset-password", {
        email: user?.email, code: oldPassword, new_password: newPassword,
      });
      if (status === 200) {
        setSaved(true);
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError((data as { detail?: string }).detail || "Gagal mengubah password");
      }
    } catch { setError("Koneksi gagal"); }
    setSaving(false);
  };

  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString("id", { month: "long", year: "numeric" }) : "-";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 rounded-xl flex items-center justify-center"><span className="material-symbols-outlined text-primary text-xl">lock</span></div>
            <div><h4 className="font-bold text-on-surface font-headline">Ubah Password</h4><p className="text-tertiary text-xs">Pastikan password baru aman</p></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">Password Lama</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">lock</span>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-outline" />
              </div>
            </div>
            <div>
              <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">Password Baru</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">key</span>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimal 8 karakter" className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-outline" />
              </div>
            </div>
            <div>
              <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">Konfirmasi Password Baru</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">key</span>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru" className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-outline" />
              </div>
              {confirmPassword && newPassword !== confirmPassword && <p className="text-error text-xs mt-2">Password tidak cocok</p>}
            </div>

            <div className="p-4 bg-surface rounded-xl">
              <p className="text-tertiary text-[11px] font-semibold uppercase tracking-wider mb-3">Persyaratan Password</p>
              <div className="grid grid-cols-2 gap-2">
                {passwordChecks.map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-sm ${rule.met ? "text-primary" : "text-outline"}`} style={{ fontVariationSettings: rule.met ? '"FILL" 1' : '"FILL" 0' }}>{rule.met ? "check_circle" : "circle"}</span>
                    <span className={`text-xs ${rule.met ? "text-on-surface font-medium" : "text-tertiary"}`}>{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}

        <button onClick={handleSave} disabled={!isValid || saving} className={`w-full py-4 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform ${isValid && !saving ? "gradient-primary text-on-primary shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]" : "bg-surface-container-high text-outline cursor-not-allowed shadow-none"}`}>
          <span className="material-symbols-outlined">{saved ? "check_circle" : saving ? "hourglass_top" : "save"}</span>
          {saved ? "Tersimpan!" : saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-linear-to-br from-on-primary-container to-primary rounded-2xl p-5 md:p-6 text-on-primary shadow-xl relative overflow-hidden">
          <div className="absolute -top-14 -right-14 w-40 h-40 bg-primary-fixed/8 rounded-full blur-3xl" />
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto bg-surface-container-lowest/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>verified_user</span>
            </div>
            <h4 className="text-xl font-black font-headline mb-1">Akun Terlindungi</h4>
            <p className="text-primary-fixed/70 text-sm">Login via {user?.auth_provider || "email"}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <h4 className="font-bold text-on-surface font-headline mb-4">Tips Keamanan</h4>
          <div className="space-y-4">
            {SECURITY_TIPS.map((tip) => (
              <div key={tip.title} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-primary text-lg">{tip.icon}</span></div>
                <div><p className="font-bold text-on-surface text-sm">{tip.title}</p><p className="text-tertiary text-[11px] leading-relaxed">{tip.description}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <h4 className="font-bold text-on-surface font-headline mb-4">Info Akun</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface rounded-xl">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">person</span><p className="text-on-surface text-xs font-bold">{user?.name}</p></div>
              <span className="text-tertiary text-[10px]">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface rounded-xl">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">person_add</span><p className="text-on-surface text-xs font-bold">Bergabung</p></div>
              <span className="text-tertiary text-[10px]">{joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
