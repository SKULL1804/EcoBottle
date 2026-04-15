import type {
  PaymentMethod,
  WithdrawOption,
  WalletTransaction,
} from "@/types/wallet";

/* ─── Payment Methods ─── */
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    icon: "account_balance",
    name: "GoPay",
    connected: true,
    phone: "0812-3456-7890",
  },
  { icon: "payments", name: "OVO", connected: true, phone: "0812-3456-7891" },
  { icon: "shopping_bag", name: "ShopeePay", connected: false },
  { icon: "credit_card", name: "DANA", connected: false },
];

/* ─── Withdraw Options ─── */
export const WITHDRAW_OPTIONS: WithdrawOption[] = [
  {
    icon: "send",
    label: "Payout",
    fee: "Gratis",
    duration: "1-3 hari kerja",
  },
];

/* ─── Wallet Transactions ─── */
export const WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    icon: "recycling",
    label: "Botol PET 600ml",
    date: "Hari ini, 14:20",
    amount: "+Rp 500",
    status: "completed",
    type: "credit",
  },
  {
    icon: "recycling",
    label: "Botol Kaca 330ml",
    date: "Hari ini, 10:45",
    amount: "+Rp 1.200",
    status: "completed",
    type: "credit",
  },
  {
    icon: "send",
    label: "Withdraw ke GoPay",
    date: "Kemarin, 18:00",
    amount: "-Rp 15.000",
    status: "completed",
    type: "withdraw",
  },
  {
    icon: "recycling",
    label: "Botol PET 1.5L",
    date: "Kemarin, 09:30",
    amount: "+Rp 750",
    status: "completed",
    type: "credit",
  },
  {
    icon: "shopping_bag",
    label: "Voucher Alfamart",
    date: "2 Apr 2026",
    amount: "-Rp 10.000",
    status: "completed",
    type: "debit",
  },
  {
    icon: "send",
    label: "Withdraw ke OVO",
    date: "1 Apr 2026",
    amount: "-Rp 20.000",
    status: "pending",
    type: "withdraw",
  },
];
