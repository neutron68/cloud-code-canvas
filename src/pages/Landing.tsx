import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import LanguagesSection from "@/components/landing/LanguagesSection";

const Landing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <LanguagesSection />
    <footer className="py-12 text-center border-t border-border">
      <p className="text-muted-foreground text-sm">
        © 2026 OmniCode. The Universal Cloud IDE.
      </p>
    </footer>
  </div>
);

export default Landing;
