import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ToSSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function ToSSheet({ open, onClose }: ToSSheetProps) {
  const { t, lang } = useLanguage();

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-60 bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-70 flex flex-col max-h-[85vh] bg-surface-container-lowest rounded-t-3xl shadow-[0px_-8px_48px_rgba(17,28,45,0.12)] transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2 shrink-0">
          <div className="w-10 h-1 bg-outline-variant rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container shrink-0">
          <h3 className="font-bold text-on-surface font-headline text-lg">
            {t("tos")}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-tertiary hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="prose prose-sm prose-p:text-tertiary prose-h4:text-on-surface prose-h4:font-bold prose-h4:mb-2 prose-h4:mt-6 first:prose-h4:mt-0">
            {lang === "en" ? (
              <>
                <p className="mb-6">Last updated: April 2026</p>
                
                <h4>1. Introduction</h4>
                <p>Welcome to EcoBottle. By using our application, you agree to these Terms and Conditions. Please read them carefully before using our services.</p>
                
                <h4>2. Service Mechanics</h4>
                <p>EcoBottle uses Artificial Intelligence (AI) to detect and manage plastic bottle deposits. We reserve the right to verify every transaction and reject deposits that do not meet our recycling criteria (e.g., non-PET materials, completely crushed bottles, or unreadable barcodes).</p>
                
                <h4>3. Account and Balance</h4>
                <p>Your wallet balance is representative of the recycling value of deposited bottles. Balances can be withdrawn using authorized third-party payment gateways. A minimum withdrawal threshold may apply.</p>
                
                <h4>4. Data Privacy</h4>
                <p>We process your camera data locally using edge AI to detect bottles. Videos and photos from your camera are not sent to or stored on our servers unless explicitly required for error logging, in which case data is anonymized.</p>
                
                <h4>5. Misuse and Fraud</h4>
                <p>Any attempt to manipulate the AI scanner, duplicate barcodes, or commit fraudulent activities will result in immediate account suspension and forfeiture of your accumulated balance without prior notice.</p>
              </>
            ) : (
              <>
                <p className="mb-6">Pembaruan terakhir: April 2026</p>
                
                <h4>1. Pendahuluan</h4>
                <p>Selamat datang di EcoBottle. Dengan menggunakan aplikasi kami, Anda menyetujui Syarat dan Ketentuan ini. Mohon baca dengan saksama sebelum menggunakan layanan kami.</p>
                
                <h4>2. Mekanika Layanan</h4>
                <p>EcoBottle menggunakan Kecerdasan Buatan (AI) untuk mendeteksi dan mengelola setoran botol plastik. Kami berhak memverifikasi setiap transaksi dan menolak setoran yang tidak memenuhi kriteria daur ulang kami (misalnya, bahan non-PET, botol yang hancur lebur, atau barcode yang tidak terbaca).</p>
                
                <h4>3. Akun dan Saldo</h4>
                <p>Saldo dompet Anda mewakili nilai daur ulang dari botol yang disetorkan. Saldo dapat ditarik menggunakan gateway pembayaran pihak ketiga yang sah. Batas minimum penarikan mungkin berlaku.</p>
                
                <h4>4. Privasi Data</h4>
                <p>Kami memproses data kamera Anda secara lokal menggunakan Edge AI untuk mendeteksi botol. Video dan foto dari kamera Anda tidak dikirim atau disimpan di server kami kecuali jika diperlukan secara eksplisit untuk pencatatan error, di mana data tersebut akan dianonimkan.</p>
                
                <h4>5. Penyalahgunaan dan Penipuan</h4>
                <p>Setiap upaya untuk memanipulasi pemindai AI, menggandakan barcode, atau melakukan aktivitas penipuan akan mengakibatkan penangguhan akun segera dan hilangnya saldo yang terkumpul tanpa pemberitahuan sebelumnya.</p>
              </>
            )}
            
            <div className="mt-8 p-4 bg-surface-container rounded-xl flex items-start gap-4">
               <span className="material-symbols-outlined text-tertiary">info</span>
               <p className="text-xs text-tertiary leading-prose">
                 {lang === "en" 
                   ? "By continuing to use EcoBottle, you acknowledge that you have read and understood these Terms & Conditions."
                   : "Dengan terus menggunakan EcoBottle, Anda mengakui bahwa Anda telah membaca dan memahami Syarat & Ketentuan ini."}
               </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
