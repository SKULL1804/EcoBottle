import type { Metadata } from "next";
import WalletBalance from "@/components/wallet/WalletBalance";
import PaymentMethods from "@/components/wallet/PaymentMethods";
import WithdrawCard from "@/components/wallet/WithdrawCard";
import WalletTransactions from "@/components/wallet/WalletTransactions";

export const metadata: Metadata = {
  title: "Wallet — EcoBottle",
  description:
    "Kelola saldo EcoBottle Anda, tarik ke e-wallet, dan pantau transaksi.",
};

export default function WalletPage() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-background font-headline">
            Wallet
          </h2>
          <p className="text-tertiary">
            Kelola saldo & e-wallet terhubung
          </p>
        </div>
        <div className="flex items-center gap-2 bg-secondary-container px-4 py-2 rounded-full">
          <span
            className="material-symbols-outlined text-primary text-lg"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            verified
          </span>
          <span className="text-on-secondary-container text-sm font-bold">
            Verified
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Balance + Transactions */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <WalletBalance />
          <WalletTransactions />
        </div>

        {/* Right — Methods + Withdraw */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PaymentMethods />
          <WithdrawCard />
        </div>
      </div>
    </>
  );
}
