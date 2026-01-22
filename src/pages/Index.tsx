import { HeroSection } from "@/components/HeroSection";
import { Schedule } from "@/components/Schedule";
import { IncludesSection } from "@/components/IncludesSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <Schedule />
      <IncludesSection />
    </main>
  );
};

export default Index;
