import type { ProcessStep, ImpactStat, NavLink } from "@/types";

/* ─── Navigation Links ─── */
export const NAV_LINKS = [
  { label: "Beranda", href: "#hero" },
  { label: "Dampak", href: "#impact" },
  { label: "Cara Kerja", href: "#process" },
  { label: "Fitur Utama", href: "#features" },
];

/* ─── Footer Links ─── */
export const FOOTER_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Sustainability Report",
  "Contact",
] as const;

/* ─── Process Steps ─── */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: "barcode_scanner",
    title: "Validasi Barcode",
    description:
      "Arahkan kamera ponsel Anda ke barcode kemasan (EAN-13) untuk memastikan botol tersebut belum pernah diklaim.",
    image:
      "/images/barcode_validation.png",
    alt: "Futuristic digital scanner interface capturing a product barcode",
    accent: false,
  },
  {
    icon: "center_focus_strong",
    title: "Scan AI",
    description:
      "Teknologi visi komputer kami akan mendeteksi jenis dan kualitas botol secara instan.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3NaYrMULD7IST_RWCClqrjNxW1xrsWhzjDR1rSudGQO8H9kBjVmRfmoez8f18gOfe0E2g_qQxQoZPN_FoU3bLnN6GTEEFBf_7I8kfIXvFVo1TXzSUyTgfUhwIkZaxjFTq9hCOovaTs6_xB6hTzqNwnxjF1KXojvYwEsx3Z3dqjZTzcPn_rGPZ6T_1l5JJgrCjL7fuNhh_dodSqZVZbysC5wpoNBQauiMECyOfXfPHivS_cO7sVwnk6RRSzqAFCH4MLE4mM4ghxw",
    alt: "AI bottle detection scanning a plastic bottle with glowing green neural network",
    accent: true,
  },
  {
    icon: "account_balance_wallet",
    title: "Dapat Saldo",
    description:
      "Saldo langsung masuk ke aplikasi Anda. Tarik ke e-wallet favorit kapan saja.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlSPXdQHJUYXdNsbGnmqx5Ld0SxB_NMUlxYJKSlA40LnhFoVBB4sdTTacCXpzptX7pMpgdrEm8V6pfcyGQiw9amaxGEi4LqZTy34Uh4Z7c6rHATwxJi86FDtpY0nYwHRLOVESnNYGmc4OlzBWj57MXhST-2TzlSrvWF5qF9u-zs2-Y81CEqva_aLtGBDzkxKarQgp9ZHW0ZYXe9GH5z1-yKzaZGcCPjfVAGf417M-OWxzvpDm9N6BvwJlBcFu4PdPQgjirtV3ZrQ",
    alt: "Smartphone displaying a digital wallet app with a green success message",
    accent: false,
  },
];

/* ─── Impact Statistics ─── */
export const IMPACT_STATS: ImpactStat[] = [
  { value: "10K+", label: "Botol Didaur Ulang" },
  { value: "500kg", label: "Plastik Terselamatkan" },
  { value: "2K+", label: "Pengguna Aktif" },
];
