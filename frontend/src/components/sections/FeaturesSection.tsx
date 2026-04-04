import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-8 py-20">
      <h2 className="text-4xl font-extrabold font-headline mb-16 text-center">
        Smart Tech for a Greener Planet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
        {/* AI Detection (Large) */}
        <div className="md:col-span-2 md:row-span-1 bg-surface-container-lowest p-10 rounded-xl relative overflow-hidden flex flex-col justify-end group">
          <Image
            className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa6Nhk5YKiAbraIRDicAgURthCuziSY45oIexeu3bfwgWb6EZQ6kvQ2hAP5nhkTdVx7fHbpriyFFfIVsAcMeg_WlKj9_p_A6uePftGAsVbXfLN6ybHqtiDpW_HdEYG6gHUwsyk0ZOaKTDbdFWXytVyctP_PPcWL6CiWEVMMryCZ7McbNRitIAvYxKZnDJqeYcf-r60Oc8b0g2fwemnrUhET72lcuw3rgZ_T_dTXkKjFvmMAJapGHY4FahLy-O6-6A4euAsvprg7A"
            alt="Abstract AI data processing with emerald green light trails"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="relative z-10">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">
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
            className="material-symbols-outlined text-4xl mb-4"
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
          <span className="material-symbols-outlined text-primary text-6xl">
            military_tech
          </span>
          <p className="text-tertiary text-sm">
            Earn badges and compete on regional leaderboards.
          </p>
        </div>

        {/* Eco Dashboard */}
        <div className="md:col-span-1 md:row-span-1 bg-surface-container-lowest p-10 rounded-xl flex flex-col justify-between border border-outline-variant/10">
          <div className="w-full h-32 bg-surface-container rounded-lg mb-4 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary-container text-5xl">
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

        {/* Smart Location */}
        <div className="md:col-span-2 md:row-span-1 bg-secondary-container p-10 rounded-xl flex items-center gap-8 group overflow-hidden">
          <div className="flex-1">
            <h4 className="text-3xl font-bold font-headline text-on-secondary-container mb-4">
              Smart Location
            </h4>
            <p className="text-on-secondary-container/80 mb-6">
              Find the nearest EcoBottle machine with real-time capacity
              updates.
            </p>
            <button className="bg-on-secondary-container text-white px-6 py-2 rounded-full font-semibold">
              Open Map
            </button>
          </div>
          <div className="hidden lg:block w-48 h-48 bg-white/50 backdrop-blur-sm rounded-full shrink-0 shadow-lg p-2">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <Image
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnVHn93_w9yhYNbL5R9h_2ibEVUxpln6kbgrbzkgWNuu7fUHAhmGDDNcRhpg1Ibx9fBbvIoLqA6L7PiUDTJ7f7Ukn-TUxZUz5tT8TaMwtssNHEOvNBD4mIDzbmS9sDtE2CeYepNWLc8txaITzjacle2nR1RAA7KTbkavIkyB1o3lwLcCj4wJeVZA9WkHKkv0JvNVYZrlYT33S9H7H8-24gf9kyZu5M3gSA0qkrTeKlP_PwpXlE7I3ZSisKdL_y-TObat3iXJRIzw"
                alt="Minimalist city map view with green location pin indicators"
                fill
                sizes="192px"
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="md:col-span-1 md:row-span-1 bg-surface-container-highest p-10 rounded-xl flex flex-col justify-end">
          <span className="material-symbols-outlined text-primary text-4xl mb-4">
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
