import { useState } from "react";
import { motion } from "framer-motion";
import { DayCard } from "./DayCard";
import { JourneyMap } from "./JourneyMap";
import { itineraryData } from "@/data/itinerary";

export function ItinerarySection() {
  const [activeDay, setActiveDay] = useState<number | null>(1);

  const handleDayClick = (day: number) => {
    setActiveDay(activeDay === day ? null : day);
  };

  return (
    <section className="py-20 bg-background" id="itinerario">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display text-4xl md:text-5xl text-foreground mb-4">
            Itinerario día a día
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Explora cada día de tu viaje. Haz clic en un día para ver los detalles.
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-3 space-y-4">
            {itineraryData.map((day, index) => (
              <DayCard
                key={day.day}
                day={day}
                isActive={activeDay === day.day}
                onClick={() => handleDayClick(day.day)}
                index={index}
              />
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2 hidden lg:block">
            <JourneyMap activeDay={activeDay} />
          </div>
        </div>
      </div>
    </section>
  );
}
