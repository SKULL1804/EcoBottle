"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";

export default function EditProfileForm() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false); setError("");
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const { status, data } = await authApi.updateProfile(form.name, form.phone);
      if (status === 200) {
        setSaved(true);
        await refreshUser();
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError((data as { detail?: string }).detail || "Gagal menyimpan");
      }
    } catch {
      setError("Koneksi gagal");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <h4 className="font-bold text-on-surface font-headline mb-6">Foto Profil</h4>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden relative border-4 border-primary/20 shadow-lg flex items-center justify-center bg-primary-container">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-on-primary font-bold text-2xl">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-tertiary text-[11px]">Foto profil diambil dari akun Google</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <h4 className="font-bold text-on-surface font-headline mb-6">Informasi Pribadi</h4>
        <div className="space-y-5">
          <div>
            <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">Nama Lengkap</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">person</span>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">mail</span>
              <input type="email" name="email" value={form.email} disabled className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-tertiary text-sm font-medium cursor-not-allowed" />
            </div>
            <p className="text-tertiary text-[10px] mt-1">Email tidak dapat diubah</p>
          </div>
          <div>
            <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">Nomor Telepon</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">phone</span>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <h4 className="font-bold text-on-surface font-headline mb-6">Info Akun</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-surface rounded-xl">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">calendar_month</span><span className="text-tertiary text-sm">Bergabung</span></div>
            <span className="font-bold text-on-surface text-sm">{user?.created_at ? new Date(user.created_at).toLocaleDateString("id", { month: "long", year: "numeric" }) : "-"}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-surface rounded-xl">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">workspace_premium</span><span className="text-tertiary text-sm">Level</span></div>
            <span className="font-bold text-primary text-sm">{user?.level_title || "Pemula"} (Lv.{user?.level || 1})</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-surface rounded-xl">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">shield</span><span className="text-tertiary text-sm">Auth</span></div>
            <span className="font-bold text-on-surface text-sm capitalize">{user?.auth_provider || "email"}</span>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}

      <button onClick={handleSave} disabled={saving} className="w-full py-4 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50">
        <span className="material-symbols-outlined">{saved ? "check_circle" : saving ? "hourglass_top" : "save"}</span>
        {saved ? "Tersimpan!" : saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}
