/** Profile info section. */
export interface ProfileInfo {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  level: number;
  tier: string;
  avatar: string;
}

/** Settings menu item. */
export interface SettingsMenuItem {
  icon: string;
  label: string;
  description: string;
  href?: string;
  danger?: boolean;
}

/** Badge / tier info. */
export interface TierInfo {
  name: string;
  icon: string;
  minBottles: number;
  maxBottles: number;
  current: boolean;
}
