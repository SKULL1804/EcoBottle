export default function WalletCard() {
  return (
    <section className="md:col-span-4 lg:col-span-3 bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between shadow-[0px_24px_48px_rgba(17,28,45,0.06)] overflow-hidden relative group">
      {/* Decorative blur */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-all group-hover:bg-primary/10" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="p-3 bg-secondary-container rounded-2xl">
            <span className="material-symbols-outlined text-primary text-3xl">
              account_balance_wallet
            </span>
          </div>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-headline tracking-wide">
            ACTIVE WALLET
          </span>
        </div>
        <p className="text-tertiary text-sm font-medium mb-1">
          Available Balance
        </p>
        <h3 className="text-5xl font-black text-on-surface mb-8 tracking-tighter font-headline">
          Rp 25.000
        </h3>
      </div>

      <div className="flex gap-3 relative z-10">
        <button className="flex-1 py-4 gradient-primary text-on-primary font-bold rounded-full text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-200">
          Withdraw
        </button>
        <button className="px-6 py-4 bg-surface-container-high text-on-surface font-bold rounded-full text-sm hover:bg-surface-container-highest transition-colors">
          History
        </button>
      </div>
    </section>
  );
}
