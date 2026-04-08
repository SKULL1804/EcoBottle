import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-8 py-20">
      <h2 className="text-4xl font-extrabold font-headline mb-16 text-center">
        Smart Tech for a Greener Planet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-200">
        {/* AI Detection (Large) */}
        <div className="md:col-span-2 md:row-span-1 bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/20 hover:shadow-xl transition-all duration-300 p-10 rounded-3xl relative overflow-hidden flex flex-col justify-end group">
          <Image
            className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa6Nhk5YKiAbraIRDicAgURthCuziSY45oIexeu3bfwgWb6EZQ6kvQ2hAP5nhkTdVx7fHbpriyFFfIVsAcMeg_WlKj9_p_A6uePftGAsVbXfLN6ybHqtiDpW_HdEYG6gHUwsyk0ZOaKTDbdFWXytVyctP_PPcWL6CiWEVMMryCZ7McbNRitIAvYxKZnDJqeYcf-r60Oc8b0g2fwemnrUhET72lcuw3rgZ_T_dTXkKjFvmMAJapGHY4FahLy-O6-6A4euAsvprg7A"
            alt="Abstract AI data processing with emerald green light trails"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="relative z-10">
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

        {/* Smart Wallet */}
        <div className="md:col-span-1 md:row-span-1 bg-primary text-on-primary p-10 rounded-xl flex flex-col justify-center">
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
        </div>

        {/* Gamification */}
        <div className="md:col-span-1 md:row-span-1 bg-surface-container-high p-10 rounded-xl flex flex-col justify-between">
          <h4 className="text-xl font-bold font-headline">Gamification</h4>
          <span className="material-symbols-outlined text-primary !text-6xl">
            military_tech
          </span>
          <p className="text-tertiary text-sm">
            Earn badges and compete on regional leaderboards.
          </p>
        </div>

        {/* Eco Dashboard */}
        <div className="md:col-span-1 md:row-span-1 bg-surface-container-lowest p-10 rounded-xl flex flex-col justify-between border border-outline-variant/10">
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
        </div>

        {/* Anti-Fraud Validation */}
        <div className="md:col-span-2 md:row-span-1 bg-linear-to-br from-on-primary-container to-primary text-on-primary p-10 rounded-xl relative overflow-hidden flex flex-col justify-center">
          {/* Decorative blurs matching exactly the app's new visual identity */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-surface-container-lowest/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-8">
            <div className="flex-1">
              <h4 className="!text-3xl font-bold font-headline mb-4 tracking-tight">
                Anti-Fraud Barcode Scanner
              </h4>
              <p className="text-on-primary/90 mb-6 font-medium leading-relaxed">
                Pencegahan kecurangan secara cerdas. Sistem kami memvalidasi standar barcode EAN untuk memastikan botol plastik belum pernah diklaim sebelumnya.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-surface-container-lowest/15 backdrop-blur-sm px-4 py-2 rounded-full border border-on-primary/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span className="text-sm font-bold">100% Valid</span>
                </div>
                <div className="bg-surface-container-lowest/15 backdrop-blur-sm px-4 py-2 rounded-full border border-on-primary/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                  <span className="text-sm font-bold">Live EAN Support</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex w-40 h-40 bg-surface-container-lowest/15 backdrop-blur-md rounded-3xl shrink-0 shadow-2xl border border-on-primary/15 items-center justify-center p-6 transition-transform hover:scale-105 duration-500 group-hover:scale-105">
               <span className="material-symbols-outlined !text-[80px] drop-shadow-md text-on-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                 barcode_scanner
               </span>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="md:col-span-1 md:row-span-1 bg-surface-container-highest p-10 rounded-xl flex flex-col justify-end">
          <span className="material-symbols-outlined text-primary !text-4xl mb-4">
            insights
          </span>
          <h4 className="text-xl font-bold font-headline mb-1">Analytics</h4>
          <p className="text-tertiary text-sm">
            Deep insights for corporate sustainability partners.
          </p>
        </div>
      </div>
    </section>
  );
}
