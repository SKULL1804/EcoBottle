import Image from "next/image";
import { PROCESS_STEPS } from "@/constants/landing";

export default function ProcessSection() {
  return (
    <section id="process" className="max-w-7xl mx-auto px-8 py-20 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROCESS_STEPS.map((step) => (
          <div
            key={step.title}
            className={`p-8 rounded-3xl flex flex-col justify-between min-h-100 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] transition-all duration-300 relative overflow-hidden group ${
              step.accent 
                ? "bg-linear-to-br from-on-primary-container to-primary text-on-primary border border-transparent scale-[1.01] md:scale-105 z-20 shadow-primary/30 shadow-2xl" 
                : "bg-surface-container-lowest text-on-surface border border-outline-variant/30 hover:border-primary/20 hover:shadow-lg"
            }`}
          >
            {/* Decorative background blurs, identical to other primary theme cards */}
            {step.accent && (
              <>
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-surface-container-lowest/15 rounded-full blur-2xl pointer-events-none" />
              </>
            )}

            <div className="relative z-10">
              {/* Themed Icon Wrapper */}
              <div 
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${
                  step.accent 
                    ? "bg-surface-container-lowest/15 backdrop-blur-md text-on-primary border border-on-primary/10" 
                    : "bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"
                }`}
              >
                <span className="material-symbols-outlined !text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                  {step.icon}
                </span>
              </div>
              <h3 className={`text-2xl font-extrabold font-headline mb-4 tracking-tight ${step.accent ? "text-on-primary" : "text-on-surface"}`}>
                {step.title}
              </h3>
              <p className={`font-medium leading-relaxed text-sm ${step.accent ? "text-on-primary/90" : "text-tertiary"}`}>
                {step.description}
              </p>
            </div>
            
            <div className={`mt-10 overflow-hidden rounded-2xl h-56 relative z-10 transition-transform duration-500 group-hover:scale-[1.02] ${
              step.accent ? "shadow-2xl ring-1 ring-on-primary/20" : "bg-surface-container"
            }`}>
              <Image
                className="object-cover"
                src={step.image}
                alt={step.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
