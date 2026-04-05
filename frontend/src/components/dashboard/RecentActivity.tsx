import { RECENT_TRANSACTIONS } from "@/constants/dashboard";
import Link from "next/link";

export default function RecentActivity() {
  return (
    <section className="md:col-span-4 lg:col-span-6 bg-surface-container-lowest rounded-xl p-8 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-xl font-bold font-headline">Recent Activity</h4>
        <Link href="/dashboard/history" className="text-primary text-sm font-bold hover:underline">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {RECENT_TRANSACTIONS.map((tx, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-transparent hover:border-primary/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  tx.type === "credit"
                    ? "bg-secondary-container text-primary"
                    : "bg-surface-container-highest text-tertiary"
                }`}
              >
                <span className="material-symbols-outlined">{tx.icon}</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">{tx.label}</p>
                <p className="text-xs text-tertiary">{tx.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-bold ${
                  tx.type === "credit" ? "text-primary" : "text-error"
                }`}
              >
                {tx.amount}
              </p>
              <p className="text-[10px] text-tertiary">{tx.status}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
