import { motion } from "framer-motion";

const locations = [
  { name: "Tokio", x: 85, y: 35, days: "1-2, 10-12, 14" },
  { name: "Fuji", x: 70, y: 55, days: "3" },
  { name: "Kioto", x: 35, y: 50, days: "4-6, 8" },
  { name: "Nara", x: 40, y: 60, days: "7" },
  { name: "Osaka", x: 30, y: 55, days: "8-9" },
  { name: "Kamakura", x: 88, y: 45, days: "13" },
];

const paths = [
  { from: 0, to: 1 }, // Tokio -> Fuji
  { from: 1, to: 2 }, // Fuji -> Kioto
  { from: 2, to: 3 }, // Kioto -> Nara
  { from: 3, to: 4 }, // Nara/Kioto -> Osaka
  { from: 4, to: 0 }, // Osaka -> Tokio
  { from: 0, to: 5 }, // Tokio -> Kamakura
];

interface JourneyMapProps {
  activeDay: number | null;
}

export function JourneyMap({ activeDay }: JourneyMapProps) {
  const getActiveLocation = () => {
    if (activeDay === null) return null;
    if ([1, 2, 10, 11, 12, 14].includes(activeDay)) return 0; // Tokio
    if (activeDay === 3) return 1; // Fuji
    if ([4, 5, 6, 8].includes(activeDay)) return 2; // Kioto
    if (activeDay === 7) return 3; // Nara
    if (activeDay === 9) return 4; // Osaka
    if (activeDay === 13) return 5; // Kamakura
    return null;
  };

  const activeLocation = getActiveLocation();

  return (
    <div className="card-elevated p-6 sticky top-8">
      <h3 className="text-display text-2xl text-foreground mb-6 text-center">
        Recorrido del Viaje
      </h3>
      
      <div className="relative aspect-[4/3] bg-gradient-to-br from-background to-muted/30 rounded-lg overflow-hidden">
        {/* Japan outline - simplified artistic representation */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Stylized Japan shape */}
          <path
            d="M75 15 Q85 20 90 30 Q95 45 88 55 Q82 65 78 75 Q75 80 70 82 Q60 85 50 80 Q40 78 35 70 Q28 60 25 50 Q22 40 28 32 Q35 22 45 18 Q55 14 65 15 Q70 15 75 15"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
            className="opacity-50"
          />
          
          {/* Connection paths */}
          {paths.map((path, idx) => {
            const from = locations[path.from];
            const to = locations[path.to];
            return (
              <motion.line
                key={idx}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="hsl(var(--primary))"
                strokeWidth="0.8"
                strokeDasharray="3,2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
              />
            );
          })}

          {/* Location markers */}
          {locations.map((loc, idx) => (
            <motion.g
              key={loc.name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
            >
              <motion.circle
                cx={loc.x}
                cy={loc.y}
                r={activeLocation === idx ? 4 : 2.5}
                fill={activeLocation === idx ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                animate={{
                  r: activeLocation === idx ? [4, 5, 4] : 2.5,
                  opacity: activeLocation === idx ? 1 : 0.7,
                }}
                transition={{
                  r: { repeat: Infinity, duration: 1.5 },
                }}
              />
              {activeLocation === idx && (
                <motion.circle
                  cx={loc.x}
                  cy={loc.y}
                  r="6"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="0.5"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </motion.g>
          ))}
        </svg>

        {/* Location labels */}
        {locations.map((loc, idx) => (
          <motion.div
            key={loc.name}
            className={`absolute transform -translate-x-1/2 text-center transition-all duration-300 ${
              activeLocation === idx
                ? "text-accent font-semibold scale-110"
                : "text-muted-foreground"
            }`}
            style={{
              left: `${loc.x}%`,
              top: `${loc.y + 6}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + idx * 0.1 }}
          >
            <span className="text-xs font-display">{loc.name}</span>
            {activeLocation === idx && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-accent/80 whitespace-nowrap"
              >
                Días: {loc.days}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {locations.map((loc, idx) => (
          <span
            key={loc.name}
            className={`text-xs px-2 py-1 rounded-full transition-all ${
              activeLocation === idx
                ? "bg-accent/20 text-accent"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            {loc.name}
          </span>
        ))}
      </div>
    </div>
  );
}
