import Image from "next/image";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-background font-headline">
          Welcome back, Alex
        </h2>
        <p className="text-tertiary">Eco-warrior since 2023 • Level 12</p>
      </div>
      <div className="flex gap-4 items-center">
        <button className="p-3 bg-surface-container-low rounded-full text-on-surface hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <Link
          href="/dashboard/profile"
          className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-surface-container-lowest relative hover:ring-2 hover:ring-primary/30 transition-all"
        >
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOqrvEyhuS6aBvcMlPQmjQcOm68CzclfiDSSDGy8ENJ16p0Dl8rRW-qBuudjsfiJ5hQC-zBA11uom2bPxfRmCy7p5wO1soPI4Ff4yxM5wZ2gSPX978UMSiK5GsexZT8xWGmwrrs01DG7Sc_wox5enTydw4new9s6-P2g6cQXEwm0fyTAtH7gXGXy34KbOLt0go048wWAc5FTDfSMpwpkrA8KwTVDk7XHOOfMwbP6X1k84OHQzlaD2GDMIEvuC0vxF25IZrZe1goA"
            alt="Profile"
            fill
            className="object-cover"
            sizes="48px"
          />
        </Link>
      </div>
    </header>
  );
}

