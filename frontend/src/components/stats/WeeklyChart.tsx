import { WEEKLY_DATA } from "@/constants/stats";

export default function WeeklyChart() {
  const maxBottles = Math.max(...WEEKLY_DATA.map((d) => d.bottles));

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-bold text-on-surface font-headline">
            Aktivitas Mingguan
          </h4>
          <p className="text-tertiary text-xs mt-0.5">
            Jumlah botol yang di-scan per hari
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-tertiary text-xs font-medium">Minggu Ini</span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-48">
        {WEEKLY_DATA.map((d) => {
          const heightPct = (d.bottles / maxBottles) * 100;
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <span className="text-xs font-bold text-primary">
                {d.bottles}
              </span>
              <div className="w-full relative rounded-t-lg overflow-hidden bg-surface-container-high">
                <div
                  className="w-full rounded-t-lg transition-all duration-500 ease-out"
                  style={{
                    height: `${(heightPct / 100) * 140}px`,
                    background:
                      heightPct === 100
                        ? "linear-gradient(to top, var(--color-primary), var(--color-primary-container))"
                        : `color-mix(in srgb, var(--color-primary) ${Math.max(30, heightPct)}%, transparent)`,
                  }}
                />
              </div>
              <span className="text-[11px] text-tertiary font-medium">
                {d.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-surface-container">
        <div>
          <span className="text-tertiary text-xs">Total minggu ini</span>
          <p className="text-xl font-black text-on-surface font-headline">
            {WEEKLY_DATA.reduce((s, d) => s + d.bottles, 0)} Botol
          </p>
        </div>
        <div className="text-right">
          <span className="text-tertiary text-xs">Rata-rata / hari</span>
          <p className="text-xl font-black text-primary font-headline">
            {(WEEKLY_DATA.reduce((s, d) => s + d.bottles, 0) / 7).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
