import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface FAQSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function FAQSheet({ open, onClose }: FAQSheetProps) {
  const { t, lang } = useLanguage();

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const faqsId = [
    { q: "Apa itu EcoBottle?", a: "EcoBottle adalah platform daur ulang cerdas berbasis AI yang memberikan reward uang untuk setiap botol plastik yang Anda setorkan." },
    { q: "Bagaimana cara menarik saldo?", a: "Pilih menu Wallet, klik 'Withdraw', lalu pilih metode yang tersedia seperti GoPay, OVO, atau transfer bank, lalu cairkan." },
    { q: "Botol jenis apa yang diterima?", a: "Kami menerima berbagai bentuk dan ukuran botol plastik berbahan PET. Pastikan barcode dapat terbaca dan botol tidak hancur lebur." },
  ];

  const faqsEn = [
    { q: "What is EcoBottle?", a: "EcoBottle is a smart AI-based recycling platform that rewards you with cash for every plastic bottle you deposit." },
    { q: "How do I withdraw my balance?", a: "Go to the Wallet menu, click 'Withdraw', select an available method like GoPay or bank transfer, and cash out." },
    { q: "What types of bottles are accepted?", a: "We accept various shapes and sizes of PET plastic bottles. Ensure the barcode is readable and the bottle isn't completely crushed." },
  ];

  const faqs = lang === "en" ? faqsEn : faqsId;

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
            {t("faq")}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-tertiary hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-surface rounded-2xl p-5 border border-outline-variant/20 hover:border-primary/20 transition-colors">
               <h4 className="font-bold text-on-surface text-sm mb-2">{faq.q}</h4>
               <p className="text-tertiary text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
          
          <div className="mt-8 text-center p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <span className="material-symbols-outlined text-primary text-3xl mb-2">support_agent</span>
            <p className="font-bold text-on-surface text-sm mb-1">{lang === "en" ? "Still need help?" : "Masih butuh bantuan?"}</p>
            <p className="text-tertiary text-xs mb-4">{lang === "en" ? "Contact our support team 24/7" : "Hubungi tim support kami 24/7"}</p>
            <button className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform">
              {lang === "en" ? "Contact Support" : "Hubungi Support"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
