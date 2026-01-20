import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DayItinerary, ItineraryState } from "@/types/itinerary";
import { defaultCoordinates } from "@/types/itinerary";

// Initial data based on the original itinerary
const initialDays: DayItinerary[] = [
  {
    id: "1",
    day: 1,
    location: "Tokio",
    title: "Salida a Tokio: Asakusa y tradición",
    activities: [
      "Asakusa: barrio histórico y templo Sensō-ji",
      "Paseo por la calle tradicional Nakamise",
      "Experiencia 'wanko' en parque con perros celebridad",
      "Cena de bienvenida: tonkatsu en restaurante familiar",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Plane",
    color: "#B87333",
  },
  {
    id: "2",
    day: 2,
    location: "Tokio",
    title: "Yanaka y Akihabara: Dos caras de la ciudad",
    activities: [
      "Barrio Yanaka: templos y sake tradicional",
      "Almuerzo libre en la zona",
      "Akihabara: sumérgete en el mundo geek, manga y tecnología",
      "Retorno al hotel y descanso",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Building2",
    color: "#B87333",
  },
  {
    id: "3",
    day: 3,
    location: "Fuji",
    title: "Naturaleza a los pies del volcán",
    activities: [
      "Traslado al área del Monte Fuji",
      "Lago Kawaguchiko: las mejores postales",
      "Caminata crepuscular por la ribera",
      "Noche tranquila cerca del lago",
    ],
    coordinates: defaultCoordinates["Fuji"],
    iconName: "Mountain",
    color: "#6B7B5E",
  },
  {
    id: "4",
    day: 4,
    location: "Kioto",
    title: "Llegada a la capital cultural",
    activities: [
      "Santuario Heian: simetría y color bermellón",
      "Paseo literario: calles Sannenzaka y Ninenzaka",
      "Cena libre en el histórico callejón Pontocho",
    ],
    coordinates: defaultCoordinates["Kioto"],
    iconName: "MapPin",
    color: "#C9A227",
  },
  {
    id: "5",
    day: 5,
    location: "Kioto",
    title: "Pabellones dorados y bosques de bambú",
    activities: [
      "Templo Kinkaku-ji: el majestuoso Pabellón Dorado",
      "Arashiyama: caminata por el famoso bosque de bambú",
      "Templo Tenryu-ji y sus jardines zen",
    ],
    coordinates: defaultCoordinates["Kioto"],
    iconName: "TreePine",
    color: "#6B7B5E",
  },
  {
    id: "6",
    day: 6,
    location: "Kioto",
    title: "Senderos de Torii y noche de Jazz",
    activities: [
      "Fushimi Inari: el camino de los mil torii",
      "Jardín Imperial Kyoto Gyoen",
      "Noche cultural: Jazz en vivo en Kioto",
    ],
    coordinates: defaultCoordinates["Kioto"],
    iconName: "Music",
    color: "#8B5A7C",
  },
  {
    id: "7",
    day: 7,
    location: "Nara / Uji",
    title: "Ciervos sagrados y la ciudad del té",
    activities: [
      "Nara: Gran Buda de Todai-ji y ciervos en el parque",
      "Uji: Cuna del té verde y templo Byodo-in",
      "Regreso a Kioto por la tarde",
    ],
    coordinates: defaultCoordinates["Nara"],
    iconName: "Coffee",
    color: "#6B7B5E",
  },
  {
    id: "8",
    day: 8,
    location: "Kioto / Osaka",
    title: "Hacia la vibrante Osaka",
    activities: [
      "Mañana libre en Kioto",
      "Tren a Osaka al mediodía",
      "Castillo de Osaka y barrio retro de Shinsekai",
    ],
    coordinates: defaultCoordinates["Osaka"],
    iconName: "Train",
    color: "#E07A5F",
  },
  {
    id: "9",
    day: 9,
    location: "Osaka",
    title: "Sabores de Dotonbori",
    activities: [
      "Kuromon Ichiba: sushi fresco y especialidades locales",
      "Dotonbori: el espectáculo de luces y comida callejera",
      "Tarde libre para compras",
    ],
    coordinates: defaultCoordinates["Osaka"],
    iconName: "Utensils",
    color: "#E07A5F",
  },
  {
    id: "10",
    day: 10,
    location: "Tokio",
    title: "Retorno en Tren Bala",
    activities: [
      "Shinkansen de Osaka a Tokio",
      "Tarde libre en la capital",
      "Check-in y cena tranquila",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Train",
    color: "#B87333",
  },
  {
    id: "11",
    day: 11,
    location: "Tokio",
    title: "Shibuya y Harajuku",
    activities: [
      "Cruce de Shibuya: el latido de la ciudad",
      "Harajuku: moda Takeshita y Meiji Jingu",
      "Cena temática o libre",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "ShoppingBag",
    color: "#8B5A7C",
  },
  {
    id: "12",
    day: 12,
    location: "Tokio",
    title: "Shimokita y Golden Gai",
    activities: [
      "Shimokitazawa: vibra alternativa y vinilos",
      "Shinjuku Golden Gai: callejones con historia",
      "Experiencia de sake nocturno",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Music",
    color: "#C9A227",
  },
  {
    id: "13",
    day: 13,
    location: "Kamakura",
    title: "Paz frente al mar",
    activities: [
      "Hasedera y el Gran Buda de Kamakura",
      "Komachi-dori y templos costeros",
      "Regreso a Tokio al atardecer",
    ],
    coordinates: defaultCoordinates["Kamakura"],
    iconName: "Waves",
    color: "#4A90A4",
  },
  {
    id: "14",
    day: 14,
    location: "Tokio",
    title: "Skytree y despedida",
    activities: [
      "Tokyo Skytree: vistas panorámicas",
      "Ochanomizu: rincón universitario y relax",
      "Cena de despedida en Asakusa",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Sunset",
    color: "#D4756A",
  },
];

interface ItineraryStore extends ItineraryState {
  setSelectedDayId: (id: string | null) => void;
  addDay: (day: Omit<DayItinerary, "id">) => void;
  updateDay: (id: string, updates: Partial<DayItinerary>) => void;
  deleteDay: (id: string) => void;
  reorderDays: (fromIndex: number, toIndex: number) => void;
  addActivity: (dayId: string, activity: string) => void;
  updateActivity: (dayId: string, activityIndex: number, newActivity: string) => void;
  removeActivity: (dayId: string, activityIndex: number) => void;
  resetToDefault: () => void;
}

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    (set, get) => ({
      days: initialDays,
      selectedDayId: null,

      setSelectedDayId: (id) => set({ selectedDayId: id }),

      addDay: (day) => {
        const newId = Date.now().toString();
        const currentDays = get().days;
        const newDayNumber = currentDays.length + 1;
        set({
          days: [...currentDays, { ...day, id: newId, day: newDayNumber }],
        });
      },

      updateDay: (id, updates) => {
        set({
          days: get().days.map((day) =>
            day.id === id ? { ...day, ...updates } : day
          ),
        });
      },

      deleteDay: (id) => {
        const filteredDays = get().days.filter((day) => day.id !== id);
        // Renumber days
        const renumberedDays = filteredDays.map((day, index) => ({
          ...day,
          day: index + 1,
        }));
        set({ days: renumberedDays, selectedDayId: null });
      },

      reorderDays: (fromIndex, toIndex) => {
        const days = [...get().days];
        const [removed] = days.splice(fromIndex, 1);
        days.splice(toIndex, 0, removed);
        // Renumber days
        const renumberedDays = days.map((day, index) => ({
          ...day,
          day: index + 1,
        }));
        set({ days: renumberedDays });
      },

      addActivity: (dayId, activity) => {
        set({
          days: get().days.map((day) =>
            day.id === dayId
              ? { ...day, activities: [...day.activities, activity] }
              : day
          ),
        });
      },

      updateActivity: (dayId, activityIndex, newActivity) => {
        set({
          days: get().days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  activities: day.activities.map((act, idx) =>
                    idx === activityIndex ? newActivity : act
                  ),
                }
              : day
          ),
        });
      },

      removeActivity: (dayId, activityIndex) => {
        set({
          days: get().days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  activities: day.activities.filter((_, idx) => idx !== activityIndex),
                }
              : day
          ),
        });
      },

      resetToDefault: () => set({ days: initialDays, selectedDayId: null }),
    }),
    {
      name: "itinerary-storage",
    }
  )
);
