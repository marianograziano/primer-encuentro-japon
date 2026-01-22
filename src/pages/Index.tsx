import { HeroSection } from "@/components/HeroSection";
import { ItinerarySection } from "@/components/ItinerarySection";
import { IncludesSection } from "@/components/IncludesSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ItinerarySection />
      <IncludesSection />
    </main>
  );
};

export default Index;
