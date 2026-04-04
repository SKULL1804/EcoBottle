import Image from "next/image";

export default function ScanCard() {
  return (
    <section className="md:col-span-4 lg:col-span-3 bg-gradient-to-br from-on-primary-container to-primary text-on-primary rounded-xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDNKg0PZTjpdEbLxPMKfxtwJBhzKSqz7cgotSs49PqlsRNn_s4p5iiAjI9nFjTKtY6dSOb7ImayGHYbyG1uOt5krY3-6b3SHDzrLFrR70wjHy3KZFAdjrDeHarCfSdh8bEWtVMkk2B-C1b3-Rd1pzIO43MRQV2395HVvjMBgzsKzhlKQrT5uzHQiIZKbSYlKNrtTWZe99Ny0HBJUWgZX41gsi5aJbPcBs-5BHHha8aAZadZIXD7k3-zPyobIWwRXPb6ftB5P52zw"
          alt="Recycling background"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-black mb-2 leading-tight font-headline">
          Scan Botol
        </h3>
        <p className="text-primary-fixed opacity-90 max-w-[240px]">
          Ready to turn your plastic waste into rewards? Scan now.
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <button className="group flex items-center justify-between w-full p-4 bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl hover:bg-surface-container-lowest/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-surface-container-lowest p-3 rounded-xl text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                qr_code_scanner
              </span>
            </div>
            <span className="font-bold text-lg">Start Scanning</span>
          </div>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
      </div>
    </section>
  );
}
