import { ACHIEVEMENTS } from "@/constants/stats";

export default function AchievementGrid() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-on-surface font-headline">
          Achievements
        </h4>
        <span className="text-tertiary text-xs font-medium">
          {ACHIEVEMENTS.filter((a) => a.unlocked).length}/{ACHIEVEMENTS.length}{" "}
          Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((ach) => (
          <div
            key={ach.title}
            className={`p-4 rounded-xl text-center transition-all ${
              ach.unlocked
                ? "bg-secondary-container/50 border border-primary/10"
                : "bg-surface-container opacity-50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                ach.unlocked
                  ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                  : "bg-surface-container-high text-outline"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{
                  fontVariationSettings: ach.unlocked
                    ? '"FILL" 1'
                    : '"FILL" 0',
                }}
              >
                {ach.unlocked ? ach.icon : "lock"}
              </span>
            </div>
            <p
              className={`text-xs font-bold ${
                ach.unlocked ? "text-on-surface" : "text-tertiary"
              }`}
            >
              {ach.title}
            </p>
            <p className="text-tertiary text-[10px] mt-1">{ach.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
