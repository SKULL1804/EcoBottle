import { FOOTER_LINKS } from "@/constants/landing";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="w-full mt-24 rounded-t-[3rem] bg-linear-to-br from-on-primary-container to-primary text-on-primary relative overflow-hidden shadow-[0_-20px_40px_rgba(3,101,46,0.15)]"
    >
      {/* Decorative theme background blobs matching the general aesthetic */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-surface-container-lowest/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-center px-10 py-16 max-w-7xl mx-auto relative z-10">
        <div className="mb-10 md:mb-0 text-center md:text-left flex flex-col items-center md:items-start">
          <Link href="/" className="flex items-center gap-3 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-on-primary/10 backdrop-blur-sm text-on-primary flex items-center justify-center border border-on-primary/10 shadow-inner transition-transform group-hover:scale-105">
               <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>recycling</span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-on-primary font-headline">
              EcoBottle
            </div>
          </Link>
          <p className="text-on-primary/80 max-w-xs text-sm font-medium leading-relaxed">
            Memberdayakan masyarakat untuk daur ulang lebih cerdas dengan perlindungan anti-fraud terpercaya, serta ciptakan hadiah finansial langsung.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 md:mb-0 px-4">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              className="text-on-primary/70 hover:text-white transition-all text-sm font-semibold tracking-wide hover:-translate-y-0.5"
              href="#"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="text-on-primary/60 text-xs font-medium tracking-wider bg-on-primary/5 px-4 py-2 rounded-full border border-on-primary/5">
          © {currentYear} EcoBottle. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
