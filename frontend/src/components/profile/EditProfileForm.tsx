"use client";

import { useState } from "react";
import Image from "next/image";
import { USER_PROFILE } from "@/constants/profile";

export default function EditProfileForm() {
  const [form, setForm] = useState({
    name: USER_PROFILE.name,
    email: USER_PROFILE.email,
    phone: USER_PROFILE.phone,
    bio: "Eco-warrior yang peduli lingkungan. Mengubah sampah botol menjadi kebiasaan sehari-hari.",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <h4 className="font-bold text-on-surface font-headline mb-6">
          Foto Profil
        </h4>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden relative border-4 border-primary/20 shadow-lg">
            <Image
              src={USER_PROFILE.avatar}
              alt="Profile"
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="space-y-2">
            <button className="px-5 py-2.5 gradient-primary text-on-primary font-bold rounded-xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md shadow-primary/20">
              Ganti Foto
            </button>
            <p className="text-tertiary text-[11px]">
              JPG, PNG, atau GIF. Maks 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <h4 className="font-bold text-on-surface font-headline mb-6">
          Informasi Pribadi
        </h4>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">
              Nama Lengkap
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">
                person
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">
                mail
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-tertiary text-xs font-semibold mb-2 uppercase tracking-wider">
              Nomor Telepon
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">
                phone
              </span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-xl border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Info (Read-only) */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <h4 className="font-bold text-on-surface font-headline mb-6">
          Info Akun
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-surface rounded-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-lg">
                calendar_month
              </span>
              <span className="text-tertiary text-sm">Bergabung</span>
            </div>
            <span className="font-bold text-on-surface text-sm">
              {USER_PROFILE.joinDate}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-surface rounded-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-lg">
                workspace_premium
              </span>
              <span className="text-tertiary text-sm">Tier</span>
            </div>
            <span className="font-bold text-primary text-sm">
              {USER_PROFILE.tier}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-surface rounded-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-lg">
                trending_up
              </span>
              <span className="text-tertiary text-sm">Level</span>
            </div>
            <span className="font-bold text-on-surface text-sm">
              Level {USER_PROFILE.level}
            </span>
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
          {saved ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
        {/* <Link
          href="/dashboard/profile"
          className="px-6 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors text-center"
        >
          Batal
        </Link> */}
      </div>
    </div>
  );
}
