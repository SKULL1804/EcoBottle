import { STAT_CARDS } from "@/constants/stats";

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS.map((card) => (
        <div
          key={card.label}
          className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-transparent hover:border-primary/10 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <span className="material-symbols-outlined text-primary text-xl">
                {card.icon}
              </span>
            </div>
            {card.trend && (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  card.trendUp
                    ? "bg-primary/10 text-primary"
                    : "bg-error/10 text-error"
                }`}
              >
                {card.trendUp ? "↑" : "↓"} {card.trend}
              </span>
            )}
          </div>
          <p className="text-tertiary text-xs font-semibold uppercase tracking-wider">
            {card.label}
          </p>
          <p className="text-3xl font-black text-on-surface font-headline tracking-tight mt-1">
            {card.value}
          </p>
          <p className="text-tertiary text-[11px] mt-1">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
