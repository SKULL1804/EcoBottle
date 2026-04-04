import { FOOTER_LINKS } from "@/constants/landing";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="w-full rounded-t-[2.5rem] mt-20 bg-slate-50"
    >
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <div className="text-lg font-bold text-emerald-900 font-headline mb-2">
            EcoBottle
          </div>
          <p className="text-slate-500 max-w-xs text-sm">
            Empowering communities to recycle smarter and earn digital rewards.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              className="text-slate-500 hover:text-emerald-600 transition-all text-sm font-medium"
              href="#"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="text-slate-500 text-sm tracking-wide">
          © 2024 EcoBottle Collective. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
