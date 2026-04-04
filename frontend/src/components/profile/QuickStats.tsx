export default function QuickStats() {
  const stats = [
    { icon: "recycling", label: "Total Botol", value: "127" },
    { icon: "savings", label: "Total Earned", value: "Rp 63.500" },
    { icon: "local_fire_department", label: "Streak", value: "7 Hari" },
    { icon: "emoji_events", label: "Badges", value: "3/6" },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <h4 className="font-bold text-on-surface font-headline mb-4">
        Ringkasan
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-4 bg-surface rounded-xl text-center"
          >
            <span
              className="material-symbols-outlined text-primary text-2xl mb-2 block"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              {s.icon}
            </span>
            <p className="text-xl font-black text-on-surface font-headline">
              {s.value}
            </p>
            <p className="text-tertiary text-[11px] font-medium mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
