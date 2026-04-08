import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProcessSection from "@/components/sections/ProcessSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ImpactSection from "@/components/sections/ImpactSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <div className="bg-surface relative overflow-hidden min-h-screen flex flex-col text-on-surface">
      {/* Decorative primary theme blobs identical to Login, Register, and Dashboard Cards */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-fixed/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[30%] -left-32 w-[600px] h-[600px] bg-surface-container-lowest/10 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <Navbar />
      
      <main className="pt-24 relative z-10 flex-1 w-full">
        <HeroSection />
        <ProcessSection />
        <FeaturesSection />
        <ImpactSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
