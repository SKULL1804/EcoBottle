import { MONTHLY_PROGRESS } from "@/constants/dashboard";

export default function MonthlyChart() {
  const opacitySteps = [10, 20, 40, 60, 100];

  return (
    <section className="md:col-span-4 lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-on-surface font-headline">
          Monthly Progress
        </h4>
        <span className="text-primary text-xs font-bold">+24%</span>
      </div>

      <div className="flex-1 flex items-end gap-2 pb-2">
        {MONTHLY_PROGRESS.map((bar, i) => {
          const opacity = opacitySteps[i] ?? 100;
          return (
            <div
              key={bar.month}
              className="w-full rounded-t-lg"
              style={{
                height: `${bar.height}%`,
                backgroundColor: `color-mix(in srgb, var(--color-primary) ${opacity}%, transparent)`,
              }}
            />
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-tertiary pt-2 border-t border-surface-container">
        {MONTHLY_PROGRESS.map((bar) => (
          <span key={bar.month}>{bar.month}</span>
        ))}
      </div>
    </section>
  );
}
