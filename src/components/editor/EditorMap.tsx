import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useItineraryStore } from "@/store/itineraryStore";
import type { DayItinerary } from "@/types/itinerary";
import { DynamicIcon } from "./DynamicIcon";

interface EditorMapProps {
  selectedDay: DayItinerary | null;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
}

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

function percentToCoords(xPercent: number, yPercent: number) {
  const lng = mapBounds.minLng + (xPercent / 100) * (mapBounds.maxLng - mapBounds.minLng);
  const lat = mapBounds.maxLat - (yPercent / 100) * (mapBounds.maxLat - mapBounds.minLat);
  return { lat, lng };
}

export function EditorMap({ selectedDay, onMapClick }: EditorMapProps) {
  const { days } = useItineraryStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onMapClick || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const coords = percentToCoords(x, y);
    onMapClick(coords);
  };

  // Group days by unique coordinates
  const uniqueLocations = days.reduce((acc, day) => {
    const key = `${day.coordinates.lat.toFixed(2)}-${day.coordinates.lng.toFixed(2)}`;
    if (!acc[key]) {
      acc[key] = {
        coords: day.coordinates,
        days: [],
        color: day.color,
        iconName: day.iconName,
      };
    }
    acc[key].days.push(day);
    return acc;
  }, {} as Record<string, { coords: { lat: number; lng: number }; days: DayItinerary[]; color: string; iconName: string }>);

  // Create paths between consecutive days
  const paths: { from: { x: number; y: number }; to: { x: number; y: number } }[] = [];
  for (let i = 0; i < days.length - 1; i++) {
    const fromPos = coordsToPercent(days[i].coordinates.lat, days[i].coordinates.lng);
    const toPos = coordsToPercent(days[i + 1].coordinates.lat, days[i + 1].coordinates.lng);
    if (fromPos.x !== toPos.x || fromPos.y !== toPos.y) {
      paths.push({ from: fromPos, to: toPos });
    }
  }

  return (
    <div className="card-elevated p-4 h-full flex flex-col">
      <h3 className="text-display text-xl mb-4 text-center">Mapa del Itinerario</h3>
      <p className="text-xs text-muted-foreground text-center mb-4">
        Haz clic en el mapa para asignar coordenadas al día seleccionado
      </p>

      <div
        ref={mapRef}
        onClick={handleMapClick}
        className={`relative flex-1 min-h-[300px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg overflow-hidden border border-border ${
          onMapClick ? "cursor-crosshair" : ""
        }`}
      >
        {/* Grid lines for reference */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {[20, 40, 60, 80].map((pos) => (
            <g key={pos}>
              <line x1={`${pos}%`} y1="0" x2={`${pos}%`} y2="100%" stroke="currentColor" strokeWidth="0.5" />
              <line x1="0" y1={`${pos}%`} x2="100%" y2={`${pos}%`} stroke="currentColor" strokeWidth="0.5" />
            </g>
          ))}
        </svg>

        {/* Paths */}
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
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            />
          ))}
        </svg>

        {/* Location markers */}
        {Object.entries(uniqueLocations).map(([key, location]) => {
          const pos = coordsToPercent(location.coords.lat, location.coords.lng);
          const isSelected = selectedDay && location.days.some((d) => d.id === selectedDay.id);
          const isHovered = location.days.some((d) => d.id === hoveredDay);

          return (
            <motion.div
              key={key}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: isSelected || isHovered ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              onMouseEnter={() => setHoveredDay(location.days[0].id)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? "ring-4 ring-accent ring-offset-2 ring-offset-background" : ""
                }`}
                style={{ backgroundColor: location.color }}
              >
                <DynamicIcon name={location.iconName} size={18} className="text-white" />

                {/* Day numbers badge */}
                <div className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                  {location.days.map((d) => d.day).join(",")}
                </div>
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg z-10 whitespace-nowrap"
                >
                  <p className="font-medium text-sm">{location.days[0].location}</p>
                  <p className="text-xs text-muted-foreground">
                    Días: {location.days.map((d) => d.day).join(", ")}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Selected day highlight */}
        {selectedDay && (
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-accent"
            style={{
              left: `${coordsToPercent(selectedDay.coordinates.lat, selectedDay.coordinates.lng).x}%`,
              top: `${coordsToPercent(selectedDay.coordinates.lat, selectedDay.coordinates.lng).y}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}

        {/* Coordinate display */}
        {selectedDay && (
          <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm border border-border rounded px-2 py-1 text-xs">
            <span className="text-muted-foreground">Lat:</span> {selectedDay.coordinates.lat.toFixed(4)},{" "}
            <span className="text-muted-foreground">Lng:</span> {selectedDay.coordinates.lng.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
}
