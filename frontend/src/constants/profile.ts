import type { ProfileInfo, SettingsMenuItem, TierInfo } from "@/types/profile";

/* ─── User Profile ─── */
export const USER_PROFILE: ProfileInfo = {
  name: "Alex Wijaya",
  email: "alex.wijaya@email.com",
  phone: "+62 812-3456-7890",
  joinDate: "Maret 2023",
  level: 12,
  tier: "Premium",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAOqrvEyhuS6aBvcMlPQmjQcOm68CzclfiDSSDGy8ENJ16p0Dl8rRW-qBuudjsfiJ5hQC-zBA11uom2bPxfRmCy7p5wO1soPI4Ff4yxM5wZ2gSPX978UMSiK5GsexZT8xWGmwrrs01DG7Sc_wox5enTydw4new9s6-P2g6cQXEwm0fyTAtH7gXGXy34KbOLt0go048wWAc5FTDfSMpwpkrA8KwTVDk7XHOOfMwbP6X1k84OHQzlaD2GDMIEvuC0vxF25IZrZe1goA",
};

/* ─── Settings Menu ─── */
export const SETTINGS_MENU: SettingsMenuItem[] = [
  {
    icon: "person",
    label: "Edit Profil",
    description: "Ubah nama, email, dan foto profil",
    href: "/dashboard/profile/edit",
  },
  {
    icon: "lock",
    label: "Keamanan",
    description: "Password, 2FA, dan privasi",
    href: "/dashboard/profile/security",
  },
  {
    icon: "language",
    label: "Bahasa",
    description: "Indonesia",
  },
  {
    icon: "help",
    label: "Bantuan & FAQ",
    description: "Pusat bantuan dan pertanyaan",
  },
  {
    icon: "description",
    label: "Syarat & Ketentuan",
    description: "Kebijakan privasi dan ToS",
  },
  {
    icon: "logout",
    label: "Keluar",
    description: "Logout dari akun Anda",
    href: "/",
    danger: true,
  },
];

/* ─── Tier Progression ─── */
export const TIERS: TierInfo[] = [
  {
    name: "Bronze",
    icon: "shield",
    minBottles: 0,
    maxBottles: 25,
    current: false,
  },
  {
    name: "Silver",
    icon: "shield",
    minBottles: 26,
    maxBottles: 50,
    current: false,
  },
  {
    name: "Gold",
    icon: "military_tech",
    minBottles: 51,
    maxBottles: 100,
    current: false,
  },
  {
    name: "Premium",
    icon: "workspace_premium",
    minBottles: 101,
    maxBottles: 200,
    current: true,
  },
  {
    name: "Platinum",
    icon: "diamond",
    minBottles: 201,
    maxBottles: 500,
    current: false,
  },
];
