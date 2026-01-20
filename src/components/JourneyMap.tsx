import { motion } from "framer-motion";
import { DynamicIcon } from "./editor/DynamicIcon";
import type { DayItinerary } from "@/types/itinerary";

// Japan bounds (approximate)
const mapBounds = {
  minLat: 33.5,
  maxLat: 36.5,
  minLng: 134,
  maxLng: 141,
};

function coordsToPercent(lat: number, lng: number) {
  const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

interface JourneyMapProps {
  activeDay: number | null;
  days: DayItinerary[];
}

export function JourneyMap({ activeDay, days }: JourneyMapProps) {
  const getActiveLocation = () => {
    if (activeDay === null) return null;
    const day = days.find((d) => d.day === activeDay);
    return day ? days.indexOf(day) : null;
  };

  const activeLocationIndex = getActiveLocation();
  const activeLocation = activeLocationIndex !== null ? days[activeLocationIndex] : null;

  // Group days by unique coordinates
  const uniqueLocations = days.reduce((acc, day) => {
    const key = `${day.coordinates.lat.toFixed(2)}-${day.coordinates.lng.toFixed(2)}`;
    if (!acc[key]) {
      acc[key] = {
        coords: day.coordinates,
        days: [],
        color: day.color,
        iconName: day.iconName,
        location: day.location,
      };
    }
    acc[key].days.push(day);
    return acc;
  }, {} as Record<string, { coords: { lat: number; lng: number }; days: DayItinerary[]; color: string; iconName: string; location: string }>);

  // Create paths between consecutive days
  const paths: { from: { x: number; y: number }; to: { x: number; y: number } }[] = [];
  for (let i = 0; i < days.length - 1; i++) {
    const fromPos = coordsToPercent(days[i].coordinates.lat, days[i].coordinates.lng);
    const toPos = coordsToPercent(days[i + 1].coordinates.lat, days[i + 1].coordinates.lng);
    if (Math.abs(fromPos.x - toPos.x) > 2 || Math.abs(fromPos.y - toPos.y) > 2) {
      paths.push({ from: fromPos, to: toPos });
    }
  }

  return (
    <div className="card-elevated p-6 sticky top-8">
      <h3 className="text-display text-2xl text-foreground mb-6 text-center">
        Recorrido del Viaje
      </h3>
      
      <div className="relative aspect-[4/3] bg-gradient-to-br from-background to-muted/30 rounded-lg overflow-hidden">
        {/* Grid for reference */}
        <div className="absolute inset-0 opacity-10">
          {[20, 40, 60, 80].map((pos) => (
            <div
              key={pos}
              className="absolute w-full h-px bg-foreground"
              style={{ top: `${pos}%` }}
            />
          ))}
        </div>

        {/* Connection paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {paths.map((path, idx) => (
            <motion.line
              key={idx}
              x1={`${path.from.x}%`}
              y1={`${path.from.y}%`}
              x2={`${path.to.x}%`}
              y2={`${path.to.y}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="6,4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            />
          ))}
        </svg>

        {/* Location markers */}
        {Object.entries(uniqueLocations).map(([key, location]) => {
          const pos = coordsToPercent(location.coords.lat, location.coords.lng);
          const isActive = activeLocation && location.days.some((d) => d.day === activeDay);

          return (
            <motion.div
              key={key}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: isActive ? 1.3 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isActive ? "ring-4 ring-accent/50" : ""
                }`}
                style={{ backgroundColor: location.color }}
              >
                <DynamicIcon name={location.iconName} size={18} className="text-white" />
              </div>

              {/* Location label */}
              <div
                className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 text-center whitespace-nowrap transition-all ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                <span className="text-xs font-display font-medium">{location.location}</span>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-accent"
                  >
                    Días: {location.days.map((d) => d.day).join(", ")}
                  </motion.div>
                )}
              </div>

              {/* Pulse effect for active */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: location.color }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {Object.entries(uniqueLocations).map(([key, location]) => {
          const isActive = activeLocation && location.days.some((d) => d.day === activeDay);
          return (
            <span
              key={key}
              className={`text-xs px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
                isActive
                  ? "bg-accent/20 text-accent"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: location.color }}
              />
              {location.location}
            </span>
          );
        })}
      </div>
    </div>
  );
}
