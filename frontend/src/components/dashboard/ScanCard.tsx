"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ScanCard() {
  const { t } = useLanguage();

  return (
    <section className="md:col-span-4 lg:col-span-3 bg-linear-to-br from-on-primary-container to-primary text-on-primary rounded-xl p-5 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDNKg0PZTjpdEbLxPMKfxtwJBhzKSqz7cgotSs49PqlsRNn_s4p5iiAjI9nFjTKtY6dSOb7ImayGHYbyG1uOt5krY3-6b3SHDzrLFrR70wjHy3KZFAdjrDeHarCfSdh8bEWtVMkk2B-C1b3-Rd1pzIO43MRQV2395HVvjMBgzsKzhlKQrT5uzHQiIZKbSYlKNrtTWZe99Ny0HBJUWgZX41gsi5aJbPcBs-5BHHha8aAZadZIXD7k3-zPyobIWwRXPb6ftB5P52zw"
          alt="Recycling background"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-black mb-2 leading-tight font-headline">
          {t("scan_title")}
        </h3>
        <p className="text-primary-fixed opacity-90 max-w-[240px] text-sm md:text-base">
          {t("scan_desc")}
        </p>
      </div>

      <div className="relative z-10 mt-5 md:mt-8">
        <Link
          href="/dashboard/scan"
          className="group flex items-center justify-between w-full p-3 md:p-4 bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl hover:bg-surface-container-lowest/20 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-surface-container-lowest flex items-center justify-center p-2.5 md:p-3 rounded-xl text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                qr_code_scanner
              </span>
            </div>
            <span className="font-bold text-base md:text-lg">{t("scan_start")}</span>
          </div>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </div>
    </section>
  );
}
