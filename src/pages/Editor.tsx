import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RotateCcw, Eye, ArrowLeft, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { useItineraryStore } from "@/store/itineraryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DayEditorForm } from "@/components/editor/DayEditorForm";
import { LeafletMapEditor } from "@/components/editor/LeafletMapEditor";
import { defaultCoordinates, colorOptions } from "@/types/itinerary";
import { useToast } from "@/hooks/use-toast";

export default function Editor() {
  const { days, selectedDayId, setSelectedDayId, addDay, updateDay, resetToDefault } =
    useItineraryStore();
  const { toast } = useToast();

  const [isAddingDay, setIsAddingDay] = useState(false);
  const [newDayForm, setNewDayForm] = useState({
    location: "",
    title: "",
  });

  const selectedDay = days.find((d) => d.id === selectedDayId) || null;

  const handleAddDay = () => {
    if (!newDayForm.location.trim() || !newDayForm.title.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa la ubicación y el título",
        variant: "destructive",
      });
      return;
    }

    const knownLocation = Object.keys(defaultCoordinates).find((key) =>
      newDayForm.location.toLowerCase().includes(key.toLowerCase())
    );

    addDay({
      day: days.length + 1,
      location: newDayForm.location,
      title: newDayForm.title,
      description: "",
      activities: [],
      coordinates: knownLocation
        ? defaultCoordinates[knownLocation]
        : { lat: 35.6762, lng: 139.6503 },
      iconName: "MapPin",
      color: colorOptions[0].value,
      markerContent: {
        title: newDayForm.location,
        subtitle: newDayForm.title,
        description: "",
        imageUrl: "",
        highlights: [],
      },
      tips: "",
      duration: "Día completo",
      transport: "",
    });

    setNewDayForm({ location: "", title: "" });
    setIsAddingDay(false);
    toast({
      title: "Día agregado",
      description: `Día ${days.length + 1} añadido al itinerario`,
    });
  };

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    if (selectedDayId) {
      updateDay(selectedDayId, { coordinates: coords });
      toast({
        title: "Coordenadas actualizadas",
        description: `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`,
      });
    } else {
      toast({
        title: "Selecciona un día",
        description: "Primero selecciona un día para asignarle coordenadas",
      });
    }
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de restaurar el itinerario original? Se perderán todos los cambios.")) {
      resetToDefault();
      toast({
        title: "Itinerario restaurado",
        description: "Se ha restaurado el itinerario original",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-display text-2xl text-foreground">Editor de Itinerario</h1>
              <p className="text-sm text-muted-foreground">{days.length} días configurados</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw size={16} className="mr-2" />
              Restaurar
            </Button>
            <Link to="/">
              <Button size="sm">
                <Eye size={16} className="mr-2" />
                Vista previa
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Day List Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-display text-xl text-foreground">Días del viaje</h2>
              <Button onClick={() => setIsAddingDay(true)} size="sm">
                <Plus size={16} className="mr-2" />
                Agregar día
              </Button>
            </div>

            {/* Add new day form */}
            {isAddingDay && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="card-elevated p-4 mb-4"
              >
                <h3 className="font-medium mb-3">Nuevo día</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Ubicación</Label>
                    <Input
                      value={newDayForm.location}
                      onChange={(e) => setNewDayForm({ ...newDayForm, location: e.target.value })}
                      placeholder="Ej: Tokio, Kioto..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Título</Label>
                    <Input
                      value={newDayForm.title}
                      onChange={(e) => setNewDayForm({ ...newDayForm, title: e.target.value })}
                      placeholder="Descripción del día"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddDay} size="sm">
                    Crear día
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsAddingDay(false)}>
                    Cancelar
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Days list */}
            <div className="space-y-3">
              {days.map((day, index) => (
                <DayEditorForm
                  key={day.id}
                  day={day}
                  isSelected={selectedDayId === day.id}
                  onSelect={() => setSelectedDayId(day.id === selectedDayId ? null : day.id)}
                  index={index}
                />
              ))}
            </div>

            {days.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No hay días configurados</p>
                <Button onClick={() => setIsAddingDay(true)} variant="outline" className="mt-4">
                  <Plus size={16} className="mr-2" />
                  Agregar el primer día
                </Button>
              </div>
            )}
          </div>

          {/* Right: Map */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <LeafletMapEditor selectedDay={selectedDay} onMapClick={handleMapClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
