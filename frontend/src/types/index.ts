/** Represents a single step in the recycling process. */
export interface ProcessStep {
  icon: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  accent: boolean;
}

/** Represents a single impact statistic. */
export interface ImpactStat {
  value: string;
  label: string;
}

/** Navigation link item. */
export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

/** Sidebar navigation item for dashboard. */
export interface SideNavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

/** Bottom navigation item for mobile dashboard. */
export interface BottomNavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

/** Transaction history item. */
export interface Transaction {
  icon: string;
  label: string;
  date: string;
  amount: string;
  status: string;
  type: "credit" | "debit";
}
