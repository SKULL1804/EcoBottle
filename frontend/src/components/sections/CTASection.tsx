export default function CTASection() {
  return (
    <section id="cta" className="max-w-5xl mx-auto px-8 py-20">
      <div className="gradient-primary rounded-[2.5rem] p-12 md:p-24 text-center text-on-primary shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl" />

        <h2 className="text-4xl md:text-6xl font-extrabold font-headline mb-8 relative z-10">
          Ready to Start the Change?
        </h2>
        <p className="text-emerald-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10">
          Join thousands of people making the world cleaner, one bottle at a
          time. Download the app today.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
          <button
            id="cta-download"
            className="bg-white text-primary px-12 py-5 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Download App
          </button>
          <button
            id="cta-partner"
            className="bg-emerald-900/20 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
          >
            Join as Partner
          </button>
        </div>
      </div>
    </section>
  );
}
