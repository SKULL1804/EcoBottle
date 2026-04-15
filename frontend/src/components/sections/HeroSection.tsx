import Link from "next/link";
import ParallaxHeroInteract from "./ParallaxHeroInteract";

export default function HeroSection() {
  return (
    <section id="hero" className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24 text-center relative w-full">
      <ParallaxHeroInteract />

      <div className="relative z-20 flex flex-col items-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold mb-8 pointer-events-auto cursor-default">
        <span
          className="material-symbols-outlined text-sm"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          eco
        </span>
        The Future of Circular Economy
      </div>

      <h1 className="text-5xl lg:text-7xl xl:text-8xl font-extrabold font-headline tracking-tight text-on-surface mb-4 md:mb-6 leading-tight select-none">
        Ubah Sampah Botol <br />
        <span className="text-primary italic">Jadi Uang</span>
      </h1>

      <p className="text-lg md:text-xl text-tertiary max-w-2xl mx-auto mb-12 leading-relaxed pointer-events-none">
        Experience the next generation of recycling with AI-powered detection.
        Every bottle you save turns into instant digital rewards in your wallet.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4 pointer-events-auto">
        <Link
          href="/login"
          id="hero-cta-primary"
          className="gradient-primary text-on-primary px-8 py-3.5 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center"
        >
          Mulai Sekarang
        </Link>
        <button
          id="hero-cta-secondary"
          className="bg-surface-container-high text-on-surface px-8 py-3.5 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-surface-container-highest transition-all flex items-center justify-center"
        >
          Lihat Cara Kerja
        </button>
      </div>
      </div>
    </section>
  );
}
