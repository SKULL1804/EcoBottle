import type { SideNavItem, BottomNavItem, Transaction } from "@/types";

/* ─── Sidebar Navigation ─── */
export const SIDE_NAV_ITEMS: SideNavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "qr_code_scanner", label: "Scan", href: "/dashboard/scan" },
  { icon: "bar_chart", label: "Stats", href: "/dashboard/stats" },
  { icon: "account_balance_wallet", label: "Wallet", href: "/dashboard/wallet" },
  { icon: "history", label: "History", href: "/dashboard/history" },
];

/* ─── Bottom Navigation (Mobile) ─── */
export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { icon: "home", label: "Home", href: "/dashboard" },
  { icon: "center_focus_weak", label: "Scan", href: "/dashboard/scan" },
  { icon: "payments", label: "Wallet", href: "/dashboard/wallet" },
  { icon: "person", label: "Profile", href: "/dashboard/profile" },
];

/* ─── Recent Transactions ─── */
export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    icon: "recycling",
    label: "Botol Plastik",
    date: "12 Oct 2023 • 14:20",
    amount: "+Rp 500",
    status: "Completed",
    type: "credit",
  },
  {
    icon: "recycling",
    label: "Botol Kaca",
    date: "11 Oct 2023 • 09:15",
    amount: "+Rp 1.200",
    status: "Completed",
    type: "credit",
  },
  {
    icon: "shopping_bag",
    label: "Voucher Indomaret",
    date: "10 Oct 2023 • 18:45",
    amount: "-Rp 10.000",
    status: "Redeemed",
    type: "debit",
  },
];

/* ─── Monthly Progress Chart Data ─── */
export const MONTHLY_PROGRESS = [
  { month: "JAN", height: 40 },
  { month: "FEB", height: 60 },
  { month: "MAR", height: 50 },
  { month: "APR", height: 80 },
  { month: "MAY", height: 100 },
] as const;
