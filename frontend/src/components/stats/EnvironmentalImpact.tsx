"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function EnvironmentalImpact() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Asumsi setiap botol setara dengan pencegahan x dampak lingkungan
  const totalBottles = user?.total_scans || 127; 
  
  // Konversi kasar untuk tujuan UI
  const co2Saved = (totalBottles * 0.25).toFixed(1); // kg CO2
  const energySaved = (totalBottles * 1.5).toFixed(1); // kWh
  const waterSaved = (totalBottles * 3.0).toFixed(1); // Liter

  return (
    <div className="bg-linear-to-br from-on-primary-container to-primary rounded-2xl p-5 md:p-8 text-on-primary shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
      {/* Background decoration matching the project's primary gradient theme */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-fixed/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-surface-container-lowest/5 rounded-full blur-2xl" />

      <div className="relative z-10">
        <h4 className="font-bold text-on-primary/90 font-headline mb-4 md:mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined pb-1">public</span>
          {t("env_impact") || "Dampak Lingkungan"}
        </h4>

        <div className="space-y-4 md:space-y-6">
          <ImpactRow icon="co2" label={t("co2_prevented") || "CO₂ Dicegah"} value={`${co2Saved} kg`} desc={t("reduce_ghg_emissions") || "Mengurangi emisi gas rumah kaca"} />
          <div className="border-t border-on-primary/10" />
          <ImpactRow icon="bolt" label={t("energy_saved") || "Energi Dihemat"} value={`${energySaved} kWh`} desc={t("tv_40_hours_desc") || "Cukup untuk menyalakan TV hingga 40 jam"} />
          <div className="border-t border-on-primary/10" />
          <ImpactRow icon="water_drop" label={t("water_preserved") || "Air Terjaga"} value={`${waterSaved} Liter`} desc={t("conserve_clean_water") || "Melestarikan cadangan air bersih"} />
        </div>
      </div>
    </div>
  );
}

function ImpactRow({ icon, label, value, desc }: { icon: string; label: string; value: string; desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/15 backdrop-blur-sm flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>{icon}</span>
      </div>
      <div>
        <div className="flex items-baseline gap-2 mb-0.5">
          <p className="font-bold text-xl font-headline tracking-tight">{value}</p>
          <p className="text-on-primary/80 text-sm font-medium">{label}</p>
        </div>
        <p className="text-xs text-on-primary/60">{desc}</p>
      </div>
    </div>
  );
}
