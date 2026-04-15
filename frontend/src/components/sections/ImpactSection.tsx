import { IMPACT_STATS } from "@/constants/landing";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function ImpactSection() {
  return (
    <section id="impact" className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20 relative z-10">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-4xl md:rounded-[3rem] py-12 px-6 md:p-16 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] relative overflow-hidden group">
        {/* Subtle decorative glow mimicking the overarching aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-primary-fixed/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary-fixed/20 transition-colors duration-700" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0 text-center relative z-10 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
          {IMPACT_STATS.map((stat) => (
            <div key={stat.label}>
              <div key={stat.label} className="py-6 md:py-0 md:px-6 transition-transform duration-500 hover:scale-110">
                <div className="text-6xl md:text-7xl font-extrabold font-headline mb-4 bg-linear-to-br from-primary to-on-primary-container bg-clip-text text-transparent drop-shadow-sm pb-2">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-tertiary font-bold uppercase tracking-[0.2em] text-sm group-hover:text-primary transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}