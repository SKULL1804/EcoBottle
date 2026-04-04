import { BOTTLE_TYPES } from "@/constants/stats";

export default function BottleBreakdown() {
  const totalCount = BOTTLE_TYPES.reduce((s, b) => s + b.count, 0);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <h4 className="font-bold text-on-surface font-headline mb-6">
        Jenis Botol
      </h4>

      {/* Stacked bar */}
      <div className="flex h-4 rounded-full overflow-hidden mb-6">
        {BOTTLE_TYPES.map((bt) => (
          <div
            key={bt.label}
            className="h-full transition-all duration-500"
            style={{
              width: `${bt.percentage}%`,
              backgroundColor: bt.color,
            }}
          />
        ))}
      </div>

      {/* Legend items */}
      <div className="space-y-3">
        {BOTTLE_TYPES.map((bt) => (
          <div
            key={bt.label}
            className="flex items-center justify-between p-3 bg-surface rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: bt.color }}
              />
              <span className="text-on-surface text-sm font-medium">
                {bt.label}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-tertiary text-xs">{bt.count} botol</span>
              <span className="text-on-surface font-bold text-sm w-10 text-right">
                {bt.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-surface-container text-center">
        <span className="text-tertiary text-xs">Total</span>
        <p className="text-2xl font-black text-on-surface font-headline">
          {totalCount} Botol
        </p>
      </div>
    </div>
  );
}
