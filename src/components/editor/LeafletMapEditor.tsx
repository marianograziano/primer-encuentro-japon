import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useItineraryStore } from "@/store/itineraryStore";
import type { DayItinerary } from "@/types/itinerary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X, MapPin, ImageIcon, Save } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom colored marker
const createColoredIcon = (color: string, isSelected: boolean) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: ${isSelected ? "36px" : "28px"};
        height: ${isSelected ? "36px" : "28px"};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        ${isSelected ? "animation: pulse 1s infinite;" : ""}
      "></div>
    `,
    iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
    iconAnchor: [isSelected ? 18 : 14, isSelected ? 36 : 28],
    popupAnchor: [0, isSelected ? -36 : -28],
  });
};

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Auto-center component
function AutoCenter({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10, { duration: 0.8 });
    }
  }, [center, map]);
  return null;
}

interface LeafletMapEditorProps {
  selectedDay: DayItinerary | null;
  onMapClick?: (lat: number, lng: number) => void;
}

export function LeafletMapEditor({ selectedDay, onMapClick }: LeafletMapEditorProps) {
  const { days, updateDay, updateMarkerContent, addMarkerHighlight, removeMarkerHighlight } = useItineraryStore();
  const [editingPopup, setEditingPopup] = useState<string | null>(null);
  const [newHighlight, setNewHighlight] = useState("");

  // Group days by location
  const locationGroups = days.reduce((acc, day) => {
    const key = `${day.coordinates.lat.toFixed(3)}-${day.coordinates.lng.toFixed(3)}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(day);
    return acc;
  }, {} as Record<string, DayItinerary[]>);

  // Create polyline coordinates
  const polylineCoords: [number, number][] = days.map((day) => [
    day.coordinates.lat,
    day.coordinates.lng,
  ]);

  const handleAddHighlight = (dayId: string) => {
    if (newHighlight.trim()) {
      addMarkerHighlight(dayId, newHighlight.trim());
      setNewHighlight("");
    }
  };

  const japanCenter: [number, number] = [35.5, 137.5];

  return (
    <div className="h-full flex flex-col rounded-xl overflow-hidden border border-border">
      <div className="bg-card px-4 py-3 border-b border-border">
        <h3 className="text-display text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Mapa Interactivo
        </h3>
        <p className="text-xs text-muted-foreground">
          Haz clic en el mapa para mover el día seleccionado. Clic en un marker para editar su popup.
        </p>
      </div>

      <div className="flex-1 relative">
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: rotate(-45deg) scale(1); }
            50% { transform: rotate(-45deg) scale(1.1); }
          }
          .leaflet-popup-content-wrapper {
            border-radius: 12px;
            padding: 0;
            overflow: hidden;
          }
          .leaflet-popup-content {
            margin: 0;
            min-width: 280px;
            max-width: 320px;
          }
          .leaflet-popup-close-button {
            color: #666 !important;
            font-size: 20px !important;
            right: 8px !important;
            top: 8px !important;
          }
        `}</style>

        <MapContainer
          center={japanCenter}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

          {selectedDay && (
            <AutoCenter center={[selectedDay.coordinates.lat, selectedDay.coordinates.lng]} />
          )}

          {/* Route polyline */}
          <Polyline
            positions={polylineCoords}
            color="hsl(28, 54%, 46%)"
            weight={3}
            opacity={0.6}
            dashArray="10, 10"
          />

          {/* Markers for each location group */}
          {Object.entries(locationGroups).map(([key, groupDays]) => {
            const firstDay = groupDays[0];
            const isSelected = selectedDay && groupDays.some((d) => d.id === selectedDay.id);
            const isEditing = editingPopup === firstDay.id;

            return (
              <Marker
                key={key}
                position={[firstDay.coordinates.lat, firstDay.coordinates.lng]}
                icon={createColoredIcon(firstDay.color, !!isSelected)}
                eventHandlers={{
                  click: () => setEditingPopup(firstDay.id),
                }}
              >
                <Popup maxWidth={350} minWidth={300}>
                  <div className="p-0">
                    {/* Image header */}
                    {firstDay.markerContent.imageUrl ? (
                      <div className="relative h-32 -mx-0 -mt-0 mb-3 overflow-hidden">
                        <img
                          src={firstDay.markerContent.imageUrl}
                          alt={firstDay.markerContent.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-3 right-3 text-white">
                          <div className="text-xs opacity-80">
                            Día{groupDays.length > 1 ? "s" : ""} {groupDays.map((d) => d.day).join(", ")}
                          </div>
                          {isEditing ? (
                            <Input
                              value={firstDay.markerContent.title}
                              onChange={(e) =>
                                updateMarkerContent(firstDay.id, { title: e.target.value })
                              }
                              className="h-7 text-sm font-semibold bg-white/20 border-white/30 text-white placeholder:text-white/50"
                              placeholder="Título del marker"
                            />
                          ) : (
                            <h4 className="font-semibold text-base">
                              {firstDay.markerContent.title}
                            </h4>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm">Sin imagen</span>
                      </div>
                    )}

                    <div className="px-3 pb-3 space-y-3">
                      {/* Subtitle */}
                      {isEditing ? (
                        <Input
                          value={firstDay.markerContent.subtitle}
                          onChange={(e) =>
                            updateMarkerContent(firstDay.id, { subtitle: e.target.value })
                          }
                          className="h-8 text-sm"
                          placeholder="Subtítulo"
                        />
                      ) : (
                        <p className="text-sm font-medium text-primary">
                          {firstDay.markerContent.subtitle}
                        </p>
                      )}

                      {/* Description */}
                      {isEditing ? (
                        <Textarea
                          value={firstDay.markerContent.description}
                          onChange={(e) =>
                            updateMarkerContent(firstDay.id, { description: e.target.value })
                          }
                          className="text-sm resize-none"
                          rows={3}
                          placeholder="Descripción del lugar..."
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {firstDay.markerContent.description || "Sin descripción"}
                        </p>
                      )}

                      {/* Image URL */}
                      {isEditing && (
                        <div>
                          <Label className="text-xs text-muted-foreground">URL de imagen</Label>
                          <Input
                            value={firstDay.markerContent.imageUrl}
                            onChange={(e) =>
                              updateMarkerContent(firstDay.id, { imageUrl: e.target.value })
                            }
                            className="h-8 text-xs mt-1"
                            placeholder="https://..."
                          />
                        </div>
                      )}

                      {/* Highlights */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">
                          Destacados
                        </Label>
                        <div className="flex flex-wrap gap-1.5">
                          {firstDay.markerContent.highlights.map((highlight, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs"
                            >
                              {highlight}
                              {isEditing && (
                                <button
                                  onClick={() => removeMarkerHighlight(firstDay.id, idx)}
                                  className="hover:text-destructive"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </span>
                          ))}
                          {isEditing && (
                            <div className="flex items-center gap-1">
                              <Input
                                value={newHighlight}
                                onChange={(e) => setNewHighlight(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleAddHighlight(firstDay.id)
                                }
                                className="h-6 w-24 text-xs"
                                placeholder="Nuevo..."
                              />
                              <button
                                onClick={() => handleAddHighlight(firstDay.id)}
                                className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tips */}
                      {(firstDay.tips || isEditing) && (
                        <div className="pt-2 border-t border-border">
                          <Label className="text-xs text-muted-foreground">💡 Tip</Label>
                          {isEditing ? (
                            <Textarea
                              value={firstDay.tips}
                              onChange={(e) => updateDay(firstDay.id, { tips: e.target.value })}
                              className="text-xs resize-none mt-1"
                              rows={2}
                              placeholder="Consejos útiles..."
                            />
                          ) : (
                            <p className="text-xs text-muted-foreground mt-1">{firstDay.tips}</p>
                          )}
                        </div>
                      )}

                      {/* Edit toggle button */}
                      <Button
                        size="sm"
                        variant={isEditing ? "default" : "outline"}
                        className="w-full mt-2"
                        onClick={() => setEditingPopup(isEditing ? null : firstDay.id)}
                      >
                        {isEditing ? (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Guardar cambios
                          </>
                        ) : (
                          "Editar contenido"
                        )}
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
