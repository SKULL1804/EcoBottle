import type { Metadata } from "next";
import Link from "next/link";
import WithdrawForm from "@/components/wallet/WithdrawForm";

export const metadata: Metadata = {
  title: "Withdraw — EcoBottle",
  description: "Tarik saldo EcoBottle ke e-wallet Anda.",
};

export default function WithdrawPage() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/wallet"
            className="p-2.5 bg-surface-container-low rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-background font-headline">
              Withdraw
            </h2>
            <p className="text-tertiary">
              Tarik saldo ke e-wallet terhubung
            </p>
          </div>
        </div>
      </header>

      <WithdrawForm />
    </>
  );
}
