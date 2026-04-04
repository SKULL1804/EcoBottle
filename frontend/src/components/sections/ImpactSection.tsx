import { IMPACT_STATS } from "@/constants/landing";

export default function ImpactSection() {
  return (
    <section id="impact" className="max-w-7xl mx-auto px-8 py-20">
      <div className="bg-surface-container-low rounded-xl p-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {IMPACT_STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-6xl font-extrabold font-headline text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-tertiary font-medium uppercase tracking-widest text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
