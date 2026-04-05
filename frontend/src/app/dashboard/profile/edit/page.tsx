import type { Metadata } from "next";
import Link from "next/link";
import EditProfileForm from "@/components/profile/EditProfileForm";

export const metadata: Metadata = {
  title: "Edit Profil — EcoBottle",
  description: "Ubah informasi profil, foto, dan data pribadi Anda.",
};

export default function EditProfilePage() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/profile"
            className="p-2.5 bg-surface-container-low rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center  "
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-background font-headline">
              Edit Profil
            </h2>
            <p className="text-tertiary">Ubah informasi pribadi Anda</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl">
        <EditProfileForm />
      </div>
    </>
  );
}
