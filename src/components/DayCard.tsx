import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { DynamicIcon } from "./editor/DynamicIcon";
import type { DayItinerary } from "@/types/itinerary";

interface DayCardProps {
  day: DayItinerary;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export function DayCard({ day, isActive, onClick, index }: DayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative"
    >
      {/* Timeline connector */}
      {index < 13 && (
        <div className="absolute left-5 top-12 w-0.5 h-[calc(100%-12px)] bg-gradient-to-b from-primary/40 to-secondary/40" />
      )}

      <div
        onClick={onClick}
        className={`card-elevated cursor-pointer group relative overflow-hidden transition-all duration-300 ${
          isActive ? "ring-2 ring-primary/30" : ""
        }`}
      >
        <div className="flex items-start gap-4 p-5">
          {/* Day number with dynamic icon */}
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-md"
            style={{ backgroundColor: day.color }}
          >
            <DynamicIcon name={day.iconName} size={18} className="text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                {day.location}
              </span>
            </div>
            <h3 className="text-display text-xl text-foreground group-hover:text-primary transition-colors">
              Día {day.day} – {day.title}
            </h3>
          </div>

          {/* Expand icon */}
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-0">
                <div className="ml-14 border-l-2 border-accent/30 pl-4">
                  <ul className="space-y-2.5">
                    {day.activities.map((activity, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="text-body text-sm leading-relaxed">{activity}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
