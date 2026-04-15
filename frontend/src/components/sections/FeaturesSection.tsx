import Image from "next/image";
import TiltCard from "@/components/ui/TiltCard";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan-laser {
          0% { top: 10%; opacity: 0; }
          15% { opacity: 1; }
          85% { top: 90%; opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan-laser {
          animation: scan-laser 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `,
        }}
      />

      <h2 className="text-4xl md:text-5xl font-extrabold font-headline mb-12 md:mb-16 text-center">
        Smart Tech for a Greener Planet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-200">
        {/* AI Detection (Large) */}
        <TiltCard className="md:col-span-2 md:row-span-1 bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/20 hover:shadow-xl transition-all duration-300 rounded-3xl relative overflow-hidden group">
          <Image
            className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
            src="/images/AI_Detection.png"
            alt="Abstract AI data processing with emerald green light trails"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10 pointer-events-none">
            <div className="pointer-events-auto">
              <span className="material-symbols-outlined text-primary !text-4xl mb-4">
                visibility
              </span>
              <h4 className="text-3xl font-bold font-headline mb-2">
                AI Detection
              </h4>
              <p className="text-tertiary max-w-sm">
                99.9% accuracy in identifying plastic types and cleanliness for
                maximum recycling value.
              </p>
            </div>
          </div>
        </TiltCard>

        {/* Smart Wallet */}
        <TiltCard className="md:col-span-1 md:row-span-1 bg-primary text-on-primary p-6 md:p-10 rounded-xl flex flex-col justify-center">
          <span
            className="material-symbols-outlined !text-4xl mb-4"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            payments
          </span>
          <h4 className="text-2xl font-bold font-headline mb-2">
            Smart Wallet
          </h4>
          <p className="text-primary-fixed-dim text-sm">
            Instant payouts to GoPay, OVO, and ShopeePay.
          </p>
        </TiltCard>

        {/* Gamification */}
        <TiltCard className="md:col-span-1 md:row-span-1 bg-surface-container-high p-6 md:p-10 rounded-xl flex flex-col justify-between gap-6 md:gap-0">
          <h4 className="text-xl font-bold font-headline">Gamification</h4>
          <span className="material-symbols-outlined text-primary !text-6xl">
            military_tech
          </span>
          <p className="text-tertiary text-sm">
            Earn badges and compete on regional leaderboards.
          </p>
        </TiltCard>

        {/* Eco Dashboard */}
        <TiltCard className="md:col-span-1 md:row-span-1 bg-surface-container-lowest p-6 md:p-10 rounded-xl flex flex-col justify-between border border-outline-variant/10">
          <div className="w-full h-32 bg-surface-container rounded-lg mb-4 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary-container !text-5xl">
              bar_chart
            </span>
          </div>
          <div>
            <h4 className="text-xl font-bold font-headline mb-1">
              Eco Dashboard
            </h4>
            <p className="text-tertiary text-sm">
              Track your personal CO2 reduction stats.
            </p>
          </div>
        </TiltCard>

        {/* Anti-Fraud Validation */}
        <TiltCard className="md:col-span-2 md:row-span-1 bg-linear-to-br from-on-primary-container to-primary text-on-primary rounded-xl relative overflow-hidden group">
          {/* Decorative blurs matching exactly the app's new visual identity */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-surface-container-lowest/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-center h-full p-6 md:p-10 pointer-events-none">
            <div className="flex items-center gap-8 pointer-events-auto">
              <div className="flex-1">
                <h4 className="!text-3xl font-bold font-headline mb-4 tracking-tight">
                  Anti-Fraud Barcode Scanner
                </h4>
                <p className="text-on-primary/90 mb-6 font-medium leading-relaxed">
                  Pencegahan kecurangan secara cerdas. Sistem kami memvalidasi
                  standar barcode EAN untuk memastikan botol plastik belum
                  pernah diklaim sebelumnya.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-surface-container-lowest/15 backdrop-blur-sm px-4 py-2 rounded-full border border-on-primary/10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      verified_user
                    </span>
                    <span className="text-sm font-bold">100% Valid</span>
                  </div>
                  <div className="bg-surface-container-lowest/15 backdrop-blur-sm px-4 py-2 rounded-full border border-on-primary/10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      qr_code_scanner
                    </span>
                    <span className="text-sm font-bold">Live EAN Support</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex w-40 h-40 bg-surface-container-lowest/15 backdrop-blur-md rounded-3xl shrink-0 shadow-2xl border border-on-primary/15 items-center justify-center transition-transform duration-500 group-hover:scale-105 relative overflow-hidden">
                {/* Static Background Barcode */}
                <span
                  className="material-symbols-outlined !text-[80px] drop-shadow-md text-on-primary/80 transition-all duration-300 group-hover:text-surface"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  barcode_scanner
                </span>

                {/* Laser Light Bar (Animated) */}
                <div className="absolute left-0 w-full h-[3px] bg-primary-fixed shadow-[0_0_20px_4px_rgba(200,255,200,0.8)] opacity-0 group-hover:animate-scan-laser z-20 pointer-events-none" />

                {/* Scanning Overlay (Subtle gradient box below the laser) */}
                <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-transparent to-primary-fixed/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay z-10" />

                {/* Simulated "Valid" Pop-up */}
                <div className="absolute top-3 right-3 bg-primary-fixed text-primary px-2 py-1 rounded-lg text-xs font-black shadow-lg opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-500 flex items-center gap-1 z-30">
                  <span className="material-symbols-outlined !text-[12px] font-black">
                    check
                  </span>
                  <span>Valid</span>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Analytics */}
        <TiltCard className="md:col-span-1 md:row-span-1 bg-surface-container-highest p-6 md:p-10 rounded-xl flex flex-col justify-end mt-4 md:mt-0">
          <span className="material-symbols-outlined text-primary !text-4xl mb-4">
            insights
          </span>
          <h4 className="text-xl font-bold font-headline mb-1">Analytics</h4>
          <p className="text-tertiary text-sm">
            Deep insights for corporate sustainability partners.
          </p>
        </TiltCard>
      </div>
    </section>
  );
}
