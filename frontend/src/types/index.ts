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
