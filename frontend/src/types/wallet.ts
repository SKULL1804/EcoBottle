/** E-wallet payment method. */
export interface PaymentMethod {
  icon: string;
  name: string;
  connected: boolean;
  phone?: string;
}

/** Withdrawal option. */
export interface WithdrawOption {
  icon: string;
  label: string;
  fee: string;
  duration: string;
}

/** Wallet transaction record (extended). */
export interface WalletTransaction {
  icon: string;
  label: string;
  date: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  type: "credit" | "debit" | "withdraw";
}
