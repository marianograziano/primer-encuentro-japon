import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Clock, Car, Lightbulb } from "lucide-react";
import { useItineraryStore } from "@/store/itineraryStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { updateDay, deleteDay, addActivity, updateActivity, removeActivity, updateMarkerContent, addMarkerHighlight, removeMarkerHighlight } = useItineraryStore();
  const [newActivity, setNewActivity] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      addActivity(day.id, newActivity.trim());
      setNewActivity("");
    }
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      addMarkerHighlight(day.id, newHighlight.trim());
      setNewHighlight("");
    }
  };

  const handleLocationChange = (location: string) => {
    updateDay(day.id, { location });
    updateMarkerContent(day.id, { title: location });
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
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => {
          onSelect();
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="text-muted-foreground cursor-grab">
          <GripVertical size={18} />
        </div>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: day.color }}
        >
          <DynamicIcon name={day.iconName} size={20} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Día {day.day}
            </span>
            <span className="text-xs text-secondary">• {day.location}</span>
            {day.duration && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={10} /> {day.duration}
              </span>
            )}
          </div>
          <h4 className="font-medium text-foreground truncate">{day.title}</h4>
        </div>

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
            <div className="px-4 pb-4 border-t border-border/50 pt-4">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="marker">Marker/Popup</TabsTrigger>
                  <TabsTrigger value="activities">Actividades</TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-4">
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
                        onChange={(e) => {
                          updateDay(day.id, { title: e.target.value });
                          updateMarkerContent(day.id, { subtitle: e.target.value });
                        }}
                        placeholder="Título descriptivo"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Descripción</Label>
                    <Textarea
                      value={day.description}
                      onChange={(e) => updateDay(day.id, { description: e.target.value })}
                      placeholder="Descripción general del día..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> Duración
                      </Label>
                      <Input
                        value={day.duration}
                        onChange={(e) => updateDay(day.id, { duration: e.target.value })}
                        placeholder="Día completo"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Car size={12} /> Transporte
                      </Label>
                      <Input
                        value={day.transport}
                        onChange={(e) => updateDay(day.id, { transport: e.target.value })}
                        placeholder="Metro, tren..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lightbulb size={12} /> Tip
                      </Label>
                      <Input
                        value={day.tips}
                        onChange={(e) => updateDay(day.id, { tips: e.target.value })}
                        placeholder="Consejo útil..."
                        className="mt-1"
                      />
                    </div>
                  </div>

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
                </TabsContent>

                {/* Marker/Popup Tab */}
                <TabsContent value="marker" className="space-y-4">
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground mb-3">
                      Configura el contenido que se muestra al hacer clic en el marker del mapa.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Título del popup</Label>
                      <Input
                        value={day.markerContent.title}
                        onChange={(e) => updateMarkerContent(day.id, { title: e.target.value })}
                        placeholder="Título en el mapa"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Subtítulo</Label>
                      <Input
                        value={day.markerContent.subtitle}
                        onChange={(e) => updateMarkerContent(day.id, { subtitle: e.target.value })}
                        placeholder="Subtítulo descriptivo"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Descripción del popup</Label>
                    <Textarea
                      value={day.markerContent.description}
                      onChange={(e) => updateMarkerContent(day.id, { description: e.target.value })}
                      placeholder="Información detallada que aparece en el popup..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">URL de imagen</Label>
                    <Input
                      value={day.markerContent.imageUrl}
                      onChange={(e) => updateMarkerContent(day.id, { imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="mt-1"
                    />
                    {day.markerContent.imageUrl && (
                      <div className="mt-2 h-24 rounded-lg overflow-hidden">
                        <img
                          src={day.markerContent.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      Destacados ({day.markerContent.highlights.length})
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {day.markerContent.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent rounded-full text-xs"
                        >
                          {highlight}
                          <button
                            onClick={() => removeMarkerHighlight(day.id, idx)}
                            className="hover:text-destructive ml-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        placeholder="Agregar destacado..."
                        className="flex-1"
                        onKeyDown={(e) => e.key === "Enter" && handleAddHighlight()}
                      />
                      <Button onClick={handleAddHighlight} size="sm" disabled={!newHighlight.trim()}>
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Activities Tab */}
                <TabsContent value="activities" className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      Actividades del día ({day.activities.length})
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
                </TabsContent>
              </Tabs>

              {/* Delete button */}
              <div className="pt-4 mt-4 border-t border-border/50">
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
