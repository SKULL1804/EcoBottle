import { WALLET_TRANSACTIONS } from "@/constants/wallet";

export default function WalletTransactions() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-on-surface font-headline">
          Transaksi Terakhir
        </h4>
        <a
          href="/dashboard/history"
          className="text-primary text-xs font-bold hover:underline"
        >
          Lihat Semua
        </a>
      </div>

      <div className="space-y-3">
        {WALLET_TRANSACTIONS.map((tx, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-surface rounded-xl border border-transparent hover:border-primary/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === "credit"
                    ? "bg-secondary-container text-primary"
                    : tx.type === "withdraw"
                      ? "bg-tertiary-fixed text-on-tertiary-container"
                      : "bg-surface-container-highest text-tertiary"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {tx.icon}
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">{tx.label}</p>
                <p className="text-tertiary text-[11px]">{tx.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-bold text-sm ${
                  tx.type === "credit" ? "text-primary" : "text-error"
                }`}
              >
                {tx.amount}
              </p>
              <span
                className={`text-[10px] font-medium ${
                  tx.status === "completed"
                    ? "text-primary"
                    : tx.status === "pending"
                      ? "text-tertiary"
                      : "text-error"
                }`}
              >
                {tx.status === "completed"
                  ? "Berhasil"
                  : tx.status === "pending"
                    ? "Pending"
                    : "Gagal"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
