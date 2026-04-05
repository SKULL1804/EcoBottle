import { PAYMENT_METHODS } from "@/constants/wallet";

export default function PaymentMethods() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-on-surface font-headline">
          E-Wallet Terhubung
        </h4>
        <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
          Tambah
        </button>
      </div>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((pm) => (
          <div
            key={pm.name}
            className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
              pm.connected
                ? "bg-surface border border-transparent hover:border-primary/10"
                : "bg-surface-container border border-dashed border-outline-variant/30"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  pm.connected
                    ? "bg-secondary-container text-primary"
                    : "bg-surface-container-high text-outline"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {pm.icon}
                </span>
              </div>
              <div>
                <p
                  className={`font-bold text-sm ${
                    pm.connected ? "text-on-surface" : "text-tertiary"
                  }`}
                >
                  {pm.name}
                </p>
                <p className="text-[11px] text-tertiary">
                  {pm.connected ? pm.balance : "Belum terhubung"}
                </p>
              </div>
            </div>
            {pm.connected ? (
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full">
                Connected
              </span>
            ) : (
              <button className="text-primary text-xs font-bold bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/15 transition-colors">
                Hubungkan
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
