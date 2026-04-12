import type { Metadata } from "next";
import WalletBalance from "@/components/wallet/WalletBalance";
import PageHeader from "@/components/layout/PageHeader";
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
      <PageHeader
        titleKey="wallet_page_title"
        descKey="wallet_page_desc"
        badgeIcon="verified"
        badgeText="Verified"
      />

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
