import { TIERS } from "@/constants/profile";

export default function TierProgress() {
  const currentIdx = TIERS.findIndex((t) => t.current);
  const currentTier = TIERS[currentIdx];
  const nextTier = TIERS[currentIdx + 1];

  // Simulate progress within current tier
  const currentBottles = 127;
  const progress = currentTier
    ? Math.min(
        100,
        ((currentBottles - currentTier.minBottles) /
          (currentTier.maxBottles - currentTier.minBottles)) *
          100
      )
    : 0;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <h4 className="font-bold text-on-surface font-headline mb-2">
        Tier Progression
      </h4>
      <p className="text-tertiary text-xs mb-6">
        {nextTier
          ? `${nextTier.minBottles - currentBottles} botol lagi untuk ${nextTier.name}`
          : "Tier tertinggi tercapai!"}
      </p>

      {/* Progress bar */}
      <div className="relative mb-6">
        <div className="h-3 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(to right, var(--color-primary), var(--color-primary-container))",
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-tertiary font-medium">
            {currentBottles} botol
          </span>
          <span className="text-[11px] text-tertiary font-medium">
            {currentTier?.maxBottles} botol
          </span>
        </div>
      </div>

      {/* Tier badges */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TIERS.map((tier, i) => (
          <div
            key={tier.name}
            className={`flex-1 min-w-[80px] p-3 rounded-xl text-center transition-all ${
              tier.current
                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                : i < currentIdx
                  ? "bg-secondary-container/50 text-on-secondary-container"
                  : "bg-surface-container text-outline opacity-60"
            }`}
          >
            <span
              className="material-symbols-outlined text-xl mb-1 block"
              style={{
                fontVariationSettings: tier.current || i < currentIdx
                  ? '"FILL" 1'
                  : '"FILL" 0',
              }}
            >
              {tier.icon}
            </span>
            <p className="text-[10px] font-bold">{tier.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
