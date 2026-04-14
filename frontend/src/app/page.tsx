import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InteractiveBlobs from "@/components/layout/InteractiveBlobs";
import HeroSection from "@/components/sections/HeroSection";
import ProcessSection from "@/components/sections/ProcessSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ImpactSection from "@/components/sections/ImpactSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <div className="bg-surface relative overflow-hidden min-h-screen flex flex-col text-on-surface">
      {/* Decorative primary theme blobs identical to Login, Register, and Dashboard Cards */}
      <InteractiveBlobs />
      
      <Navbar />
      
      <main className="pt-24 relative z-10 flex-1 w-full">
        <HeroSection />
        <ImpactSection />
        <ProcessSection />
        <FeaturesSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
