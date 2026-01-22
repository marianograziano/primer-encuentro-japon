import { motion } from "framer-motion";
import { 
  Plane, Camera, Sparkles, Utensils, Moon, Coffee, 
  Footprints, ShoppingBag, Building2, Map, Mountain, 
  Music, Train, Check, ArrowRight
} from "lucide-react";
import { itineraryData } from "@/data/itineraryData";
import { activityIcons, cityColors } from "@/types/itinerary";
import type { Activity, Travel } from "@/types/itinerary";

const iconComponents: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Plane, Camera, Sparkles, Utensils, Moon, Coffee,
  Footprints, ShoppingBag, Building2, Map, Mountain,
  Music, Train
};

function ActivityIcon({ type }: { type: string }) {
  const iconName = activityIcons[type] || "Camera";
  const IconComponent = iconComponents[iconName] || Camera;
  return <IconComponent className="w-4 h-4" />;
}

function ActivityItem({ activity }: { activity: Activity }) {
  const isIncluded = activity.included === true;
  const isFree = activity.included === false;
  
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <ActivityIcon type={activity.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-foreground">{activity.name}</span>
          {isIncluded && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" />
              Incluido
            </span>
          )}
          {isFree && activity.notes && (
            <span className="text-xs text-muted-foreground italic">({activity.notes})</span>
          )}
        </div>
        {activity.details && activity.details.length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {activity.details.map((detail, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50 mt-2 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TravelItem({ travel }: { travel: Travel }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 bg-secondary/5 rounded-lg border border-secondary/20">
      <Train className="w-5 h-5 text-secondary" />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {travel.from && travel.to ? (
            <span className="font-medium text-foreground">
              {travel.from} <ArrowRight className="w-3 h-3 inline mx-1" /> {travel.to}
            </span>
          ) : (
            <span className="font-medium text-foreground">{travel.name}</span>
          )}
          {travel.included && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" />
              Incluido
            </span>
          )}
        </div>
        {(travel.time_note || travel.purpose) && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {travel.time_note || travel.purpose}
          </p>
        )}
      </div>
    </div>
  );
}

function DayCard({ day, index }: { day: typeof itineraryData.itinerary[0]; index: number }) {
  const cityColor = cityColors[day.base_city] || "#B87333";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative"
    >
      {/* Timeline connector */}
      {index < itineraryData.itinerary.length - 1 && (
        <div 
          className="absolute left-6 top-16 w-0.5 h-[calc(100%-32px)]"
          style={{ background: `linear-gradient(to bottom, ${cityColor}40, ${cityColor}20)` }}
        />
      )}

      <div className="card-elevated overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center gap-4 p-5 border-b border-border/50"
          style={{ background: `linear-gradient(135deg, ${cityColor}08, transparent)` }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display text-lg shadow-md"
            style={{ backgroundColor: cityColor }}
          >
            {day.day}
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: cityColor }}>
              {day.base_city}
            </div>
            <h3 className="text-display text-xl text-foreground">
              {day.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Travel info */}
          {day.travel && day.travel.length > 0 && (
            <div className="space-y-2 mb-4">
              {day.travel.map((t, idx) => (
                <TravelItem key={idx} travel={t} />
              ))}
            </div>
          )}

          {/* Activities */}
          <div className="space-y-1">
            {day.activities.map((activity, idx) => (
              <ActivityItem key={idx} activity={activity} />
            ))}
          </div>

          {/* Continued activities (for split days) */}
          {day.activities_continued && day.activities_continued.length > 0 && (
            <div className="space-y-1 pt-3 border-t border-border/30">
              {day.activities_continued.map((activity, idx) => (
                <ActivityItem key={idx} activity={activity} />
              ))}
            </div>
          )}

          {/* End note */}
          {day.end_note && (
            <p className="text-sm text-muted-foreground italic pt-3 border-t border-border/30">
              {day.end_note}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Schedule() {
  // Group days by city for visual sections
  const cities = [...new Set(itineraryData.itinerary.map(d => d.base_city))];
  
  return (
    <section className="py-20 bg-background" id="itinerario">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display text-4xl md:text-5xl text-foreground mb-4">
            {itineraryData.title}
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto mb-6">
            {itineraryData.duration_days} días de descubrimiento por {cities.join(", ")}
          </p>
          
          {/* City legend */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {cities.map(city => (
              <div 
                key={city}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                style={{ 
                  backgroundColor: `${cityColors[city] || "#B87333"}15`,
                  color: cityColors[city] || "#B87333"
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cityColors[city] || "#B87333" }}
                />
                {city}
              </div>
            ))}
          </div>
          
          <div className="section-divider" />
        </motion.div>

        {/* Timeline */}
        <div className="space-y-6">
          {itineraryData.itinerary.map((day, index) => (
            <DayCard key={day.day} day={day} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
