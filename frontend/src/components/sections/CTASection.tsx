import Link from "next/link";

export default function CTASection() {
  return (
    <section id="cta" className="max-w-5xl mx-auto px-8 py-20 relative z-10">
      <div className="bg-linear-to-br from-on-primary-container to-primary rounded-[3rem] p-12 md:p-24 text-center text-on-primary shadow-2xl relative overflow-hidden">
        {/* Decorative Theme Blurs mimicking the overall visual aesthetic */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-surface-container-lowest/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-primary-fixed/20 rounded-full blur-[100px] pointer-events-none" />

        <h2 className="text-4xl md:text-6xl font-extrabold font-headline mb-8 relative z-10 tracking-tight">
          Siap Memulai Perubahan?
        </h2>
        <p className="text-on-primary/90 text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
          Bergabunglah dengan ribuan pahlawan lingkungan lainnya yang membuat bumi lebih hijau, dimulai dari satu botol plastik. Mulai daur ulang dan dapatkan hadiahnya hari ini.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
          <Link
            href="/register"
            id="cta-register"
            className="bg-surface-container-lowest flex items-center justify-center gap-2 text-primary px-12 py-5 rounded-full font-extrabold text-lg transition-transform hover:scale-105 shadow-xl hover:shadow-primary/20"
          >
            <span>Daftar Sekarang</span>
            <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
          </Link>
          <button
            id="cta-partner"
            className="bg-on-primary-container/20 flex items-center justify-center gap-2 backdrop-blur-md border border-surface-container-lowest/20 text-on-primary px-12 py-5 rounded-full font-bold text-lg hover:bg-surface-container-lowest/15 hover:scale-105 transition-all shadow-lg"
          >
            <span>Gabung Sebagai Mitra</span>
          </button>
        </div>
      </div>
    </section>
  );
}
