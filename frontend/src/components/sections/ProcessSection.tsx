import Image from "next/image";
import { PROCESS_STEPS } from "@/constants/landing";

export default function ProcessSection() {
  return (
    <section id="process" className="max-w-7xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROCESS_STEPS.map((step) => (
          <div
            key={step.title}
            className={`bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between min-h-[400px] shadow-sm hover:shadow-md transition-shadow ${
              step.accent ? "border-2 border-primary-container/20" : ""
            }`}
          >
            <div>
              <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-primary-container">
                  {step.icon}
                </span>
              </div>
              <h3 className="text-2xl font-bold font-headline mb-4">
                {step.title}
              </h3>
              <p className="text-tertiary">{step.description}</p>
            </div>
            <div className="mt-8 overflow-hidden rounded-lg h-48 bg-surface-container relative">
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
