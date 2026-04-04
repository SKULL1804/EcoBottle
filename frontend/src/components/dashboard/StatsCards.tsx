export default function StatsCards() {
  return (
    <>
      {/* Total Bottles */}
      <section className="md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] flex flex-col justify-center border border-transparent hover:border-primary/20 transition-colors">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container/50 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">eco</span>
          </div>
          <div>
            <p className="text-tertiary text-xs font-semibold">Total Botol</p>
            <h4 className="text-2xl font-black text-on-surface font-headline">
              50 Botol
            </h4>
          </div>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-[70%] rounded-full" />
        </div>
        <p className="mt-3 text-[10px] text-tertiary font-medium">
          15 bottles more to hit Platinum level
        </p>
      </section>

      {/* Impact */}
      <section className="md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] flex flex-col justify-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">scale</span>
          </div>
          <div>
            <p className="text-tertiary text-xs font-semibold">Impact</p>
            <h4 className="text-2xl font-black text-on-surface font-headline">
              5 Kg Saved
            </h4>
          </div>
        </div>
        <div className="flex gap-1 mt-4">
          <div className="h-8 flex-1 bg-surface-container-low rounded-md" />
          <div className="h-8 flex-1 bg-surface-container-low rounded-md" />
          <div className="h-8 flex-1 bg-primary/30 rounded-md" />
          <div className="h-8 flex-1 bg-primary rounded-md" />
        </div>
      </section>
    </>
  );
}
