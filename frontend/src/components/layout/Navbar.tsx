import { NAV_LINKS } from "@/constants/landing";

export default function Navbar() {
  return (
    <nav
      id="main-nav"
      className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0px_24px_48px_rgba(17,28,45,0.06)]"
    >
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tight text-emerald-900 font-headline">
          EcoBottle
        </div>

        <div className="hidden md:flex items-center space-x-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              className={
                link.active
                  ? "text-emerald-700 font-semibold border-b-2 border-emerald-500 transition-colors duration-300"
                  : "text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-300"
              }
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          id="nav-cta"
          className="gradient-primary text-on-primary px-6 py-2.5 rounded-full font-semibold scale-95 duration-200 transition-transform hover:scale-100 active:scale-90"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
