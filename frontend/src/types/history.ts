/** History filter tab. */
export interface HistoryFilter {
  label: string;
  value: string;
  icon: string;
}

/** Detailed history entry. */
export interface HistoryEntry {
  id: string;
  icon: string;
  label: string;
  description: string;
  date: string;
  time: string;
  amount: string;
  type: "credit" | "debit" | "withdraw";
  status: "completed" | "pending" | "failed";
  category: "recycle" | "reward" | "withdraw" | "voucher";
}
