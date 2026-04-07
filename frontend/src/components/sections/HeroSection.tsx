import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="hero" className="max-w-7xl mx-auto px-8 py-20 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold mb-8">
        <span
          className="material-symbols-outlined text-sm"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          eco
        </span>
        The Future of Circular Economy
      </div>

      <h1 className="text-6xl md:text-8xl font-extrabold font-headline tracking-tight text-on-surface mb-6 leading-tight">
        Ubah Sampah Botol <br />
        <span className="text-primary italic">Jadi Uang</span>
      </h1>

      <p className="text-lg md:text-xl text-tertiary max-w-2xl mx-auto mb-12 leading-relaxed">
        Experience the next generation of recycling with AI-powered detection.
        Every bottle you save turns into instant digital rewards in your wallet.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link
          href="/login"
          id="hero-cta-primary"
          className="gradient-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-primary/20 transition-all"
        >
          Mulai Sekarang
        </Link>
        <button
          id="hero-cta-secondary"
          className="bg-surface-container-high text-on-surface px-10 py-4 rounded-full font-bold text-lg hover:bg-surface-container-highest transition-all"
        >
          Lihat Cara Kerja
        </button>
      </div>
    </section>
  );
}
