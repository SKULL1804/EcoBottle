import { LEADERBOARD } from "@/constants/stats";

export default function Leaderboard() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-on-surface font-headline">
          Leaderboard Regional
        </h4>
        <span className="text-tertiary text-xs font-medium">
          Jakarta Selatan
        </span>
      </div>

      <div className="space-y-2">
        {LEADERBOARD.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 p-3.5 rounded-xl transition-colors ${
              entry.isUser
                ? "bg-primary/10 border border-primary/20"
                : "bg-surface hover:bg-surface-container-low"
            }`}
          >
            {/* Rank */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black ${
                entry.rank === 1
                  ? "bg-primary text-on-primary"
                  : entry.rank === 2
                    ? "bg-primary-container/60 text-on-primary-container"
                    : entry.rank === 3
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-surface-container text-tertiary"
              }`}
            >
              {entry.rank <= 3 ? (
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  {entry.rank === 1
                    ? "emoji_events"
                    : entry.rank === 2
                      ? "workspace_premium"
                      : "military_tech"}
                </span>
              ) : (
                entry.rank
              )}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-bold truncate ${
                  entry.isUser ? "text-primary" : "text-on-surface"
                }`}
              >
                {entry.name}
                {entry.isUser && (
                  <span className="text-[10px] text-primary font-medium ml-2">
                    (Kamu)
                  </span>
                )}
              </p>
            </div>

            {/* Bottles Count */}
            <div className="text-right shrink-0">
              <span className="text-sm font-black text-on-surface font-headline">
                {entry.bottles}
              </span>
              <span className="text-tertiary text-[10px] ml-1">botol</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
