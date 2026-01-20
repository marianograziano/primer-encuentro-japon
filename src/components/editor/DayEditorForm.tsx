import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { useItineraryStore } from "@/store/itineraryStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DynamicIcon, IconPicker } from "./DynamicIcon";
import { colorOptions, defaultCoordinates } from "@/types/itinerary";
import type { DayItinerary } from "@/types/itinerary";

interface DayEditorFormProps {
  day: DayItinerary;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export function DayEditorForm({ day, isSelected, onSelect, index }: DayEditorFormProps) {
  const { updateDay, deleteDay, addActivity, updateActivity, removeActivity } = useItineraryStore();
  const [newActivity, setNewActivity] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      addActivity(day.id, newActivity.trim());
      setNewActivity("");
    }
  };

  const handleLocationChange = (location: string) => {
    updateDay(day.id, { location });
    // Auto-update coordinates if location matches a known place
    const knownLocation = Object.keys(defaultCoordinates).find(
      (key) => location.toLowerCase().includes(key.toLowerCase())
    );
    if (knownLocation) {
      updateDay(day.id, { coordinates: defaultCoordinates[knownLocation] });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.02 }}
      className={`relative rounded-xl border transition-all duration-300 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      {/* Header - always visible */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => {
          onSelect();
          setIsExpanded(!isExpanded);
        }}
      >
        {/* Drag handle */}
        <div className="text-muted-foreground cursor-grab">
          <GripVertical size={18} />
        </div>

        {/* Day number with icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: day.color }}
        >
          <DynamicIcon name={day.iconName} size={20} className="text-white" />
        </div>

        {/* Basic info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Día {day.day}
            </span>
            <span className="text-xs text-secondary">• {day.location}</span>
          </div>
          <h4 className="font-medium text-foreground truncate">{day.title}</h4>
        </div>

        {/* Expand/Collapse button */}
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4">
              {/* Location & Title */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Ubicación</Label>
                  <Input
                    value={day.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    placeholder="Ciudad o lugar"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Título del día</Label>
                  <Input
                    value={day.title}
                    onChange={(e) => updateDay(day.id, { title: e.target.value })}
                    placeholder="Título descriptivo"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Latitud</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={day.coordinates.lat}
                    onChange={(e) =>
                      updateDay(day.id, {
                        coordinates: { ...day.coordinates, lat: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="mt-1 font-mono text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Longitud</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={day.coordinates.lng}
                    onChange={(e) =>
                      updateDay(day.id, {
                        coordinates: { ...day.coordinates, lng: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="mt-1 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Icon & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Ícono</Label>
                  <IconPicker
                    value={day.iconName}
                    onChange={(iconName) => updateDay(day.id, { iconName })}
                    color={day.color}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => updateDay(day.id, { color: color.value })}
                        className={`w-10 h-10 rounded-lg transition-all ${
                          day.color === color.value
                            ? "ring-2 ring-offset-2 ring-foreground scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Actividades ({day.activities.length})
                </Label>
                <div className="space-y-2">
                  {day.activities.map((activity, actIdx) => (
                    <div key={actIdx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center flex-shrink-0">
                        {actIdx + 1}
                      </span>
                      <Input
                        value={activity}
                        onChange={(e) => updateActivity(day.id, actIdx, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeActivity(day.id, actIdx)}
                        className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}

                  {/* Add new activity */}
                  <div className="flex items-center gap-2 mt-3">
                    <Input
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      placeholder="Nueva actividad..."
                      onKeyDown={(e) => e.key === "Enter" && handleAddActivity()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddActivity}
                      disabled={!newActivity.trim()}
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Plus size={16} className="mr-1" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Delete button */}
              <div className="pt-2 border-t border-border/50">
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:bg-destructive/10"
                  onClick={() => deleteDay(day.id)}
                >
                  <Trash2 size={16} className="mr-2" />
                  Eliminar Día {day.day}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
