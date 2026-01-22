import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DayItinerary } from "@/types/itinerary";
import { defaultCoordinates } from "@/types/itinerary";

const createDefaultMarkerContent = (location: string, title: string) => ({
  title: location,
  subtitle: title,
  description: "",
  imageUrl: "",
  highlights: [],
});

// Initial data based on the original itinerary
const initialDays: DayItinerary[] = [
  {
    id: "1",
    day: 1,
    location: "Tokio",
    title: "Salida a Tokio: Asakusa y tradición",
    description: "Llegada a Japón y primer contacto con la cultura tradicional en el histórico barrio de Asakusa.",
    activities: [
      "Asakusa: barrio histórico y templo Sensō-ji",
      "Paseo por la calle tradicional Nakamise",
      "Experiencia 'wanko' en parque con perros celebridad",
      "Cena de bienvenida: tonkatsu en restaurante familiar",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Plane",
    color: "#B87333",
    markerContent: {
      title: "Tokio - Asakusa",
      subtitle: "Bienvenida a Japón",
      description: "El templo Sensō-ji es el templo budista más antiguo de Tokio, fundado en el año 645.",
      imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      highlights: ["Templo Sensō-ji", "Calle Nakamise", "Ambiente tradicional"],
    },
    tips: "Llevar yen en efectivo. Muchos locales no aceptan tarjeta.",
    duration: "Día completo",
    transport: "Metro desde el aeropuerto",
  },
  {
    id: "2",
    day: 2,
    location: "Tokio",
    title: "Yanaka y Akihabara: Dos caras de la ciudad",
    description: "Contraste entre el Tokio tradicional de Yanaka y el futurista Akihabara.",
    activities: [
      "Barrio Yanaka: templos y sake tradicional",
      "Almuerzo libre en la zona",
      "Akihabara: sumérgete en el mundo geek, manga y tecnología",
      "Retorno al hotel y descanso",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Building2",
    color: "#B87333",
    markerContent: {
      title: "Tokio - Yanaka & Akihabara",
      subtitle: "Tradición y modernidad",
      description: "Yanaka conserva el encanto del viejo Tokio, mientras Akihabara es el paraíso otaku.",
      imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
      highlights: ["Cementerio Yanaka", "Tiendas de anime", "Maid cafés"],
    },
    tips: "Los precios en Akihabara pueden negociarse en tiendas pequeñas.",
    duration: "Día completo",
    transport: "JR Yamanote Line",
  },
  {
    id: "3",
    day: 3,
    location: "Fuji",
    title: "Naturaleza a los pies del volcán",
    description: "Viaje al icónico Monte Fuji y el sereno Lago Kawaguchiko.",
    activities: [
      "Traslado al área del Monte Fuji",
      "Lago Kawaguchiko: las mejores postales",
      "Caminata crepuscular por la ribera",
      "Noche tranquila cerca del lago",
    ],
    coordinates: defaultCoordinates["Fuji"],
    iconName: "Mountain",
    color: "#6B7B5E",
    markerContent: {
      title: "Monte Fuji",
      subtitle: "Símbolo sagrado de Japón",
      description: "El Monte Fuji (3,776m) es Patrimonio de la Humanidad y el pico más alto de Japón.",
      imageUrl: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400",
      highlights: ["Vistas del Fuji", "Lago Kawaguchiko", "Aguas termales"],
    },
    tips: "La mejor visibilidad del Fuji es temprano en la mañana.",
    duration: "Día completo + noche",
    transport: "Bus express desde Shinjuku",
  },
  {
    id: "4",
    day: 4,
    location: "Kioto",
    title: "Llegada a la capital cultural",
    description: "Primer día en la antigua capital imperial, cuna de la tradición japonesa.",
    activities: [
      "Santuario Heian: simetría y color bermellón",
      "Paseo literario: calles Sannenzaka y Ninenzaka",
      "Cena libre en el histórico callejón Pontocho",
    ],
    coordinates: defaultCoordinates["Kioto"],
    iconName: "MapPin",
    color: "#C9A227",
    markerContent: {
      title: "Kioto",
      subtitle: "Capital cultural de Japón",
      description: "Kioto fue la capital de Japón durante más de 1000 años y alberga 17 sitios Patrimonio de la Humanidad.",
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400",
      highlights: ["Santuario Heian", "Calles históricas", "Pontocho"],
    },
    tips: "Reservar ryokan con anticipación si se desea experiencia tradicional.",
    duration: "Tarde y noche",
    transport: "Shinkansen desde Fuji",
  },
  {
    id: "5",
    day: 5,
    location: "Kioto",
    title: "Pabellones dorados y bosques de bambú",
    description: "Los iconos más fotografiados de Kioto: el Pabellón Dorado y Arashiyama.",
    activities: [
      "Templo Kinkaku-ji: el majestuoso Pabellón Dorado",
      "Arashiyama: caminata por el famoso bosque de bambú",
      "Templo Tenryu-ji y sus jardines zen",
    ],
    coordinates: defaultCoordinates["Kioto"],
    iconName: "TreePine",
    color: "#6B7B5E",
    markerContent: {
      title: "Kinkaku-ji & Arashiyama",
      subtitle: "Iconos de Kioto",
      description: "El Pabellón Dorado está cubierto con hojas de oro puro. El bosque de bambú de Arashiyama es mágico.",
      imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400",
      highlights: ["Pabellón Dorado", "Bosque de bambú", "Jardín zen"],
    },
    tips: "Llegar temprano a Arashiyama (7am) para evitar multitudes.",
    duration: "Día completo",
    transport: "Bus y tren local",
  },
  {
    id: "6",
    day: 6,
    location: "Kioto",
    title: "Senderos de Torii y noche de Jazz",
    description: "Los miles de torii rojos de Fushimi Inari y la vibrante escena de jazz de Kioto.",
    activities: [
      "Fushimi Inari: el camino de los mil torii",
      "Jardín Imperial Kyoto Gyoen",
      "Noche cultural: Jazz en vivo en Kioto",
    ],
    coordinates: defaultCoordinates["Kioto"],
    iconName: "Music",
    color: "#8B5A7C",
    markerContent: {
      title: "Fushimi Inari",
      subtitle: "Miles de puertas torii",
      description: "El santuario tiene más de 10,000 torii que forman túneles a lo largo de 4km de senderos.",
      imageUrl: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400",
      highlights: ["10,000+ torii", "Sendero de montaña", "Jazz nocturno"],
    },
    tips: "La subida completa toma 2-3 horas. Vista nocturna es especial.",
    duration: "Día completo + noche",
    transport: "JR Nara Line",
  },
  {
    id: "7",
    day: 7,
    location: "Nara / Uji",
    title: "Ciervos sagrados y la ciudad del té",
    description: "Encuentro con los ciervos sagrados de Nara y degustación de matcha en Uji.",
    activities: [
      "Nara: Gran Buda de Todai-ji y ciervos en el parque",
      "Uji: Cuna del té verde y templo Byodo-in",
      "Regreso a Kioto por la tarde",
    ],
    coordinates: defaultCoordinates["Nara"],
    iconName: "Coffee",
    color: "#6B7B5E",
    markerContent: {
      title: "Nara & Uji",
      subtitle: "Ciervos y té matcha",
      description: "Los 1,200 ciervos de Nara son considerados mensajeros de los dioses. Uji produce el mejor matcha.",
      imageUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400",
      highlights: ["Gran Buda", "Ciervos sagrados", "Matcha auténtico"],
    },
    tips: "Comprar galletas 'shika senbei' para alimentar los ciervos (¥200).",
    duration: "Día completo",
    transport: "JR desde Kioto",
  },
  {
    id: "8",
    day: 8,
    location: "Kioto / Osaka",
    title: "Hacia la vibrante Osaka",
    description: "Despedida de Kioto y llegada a la energética Osaka.",
    activities: [
      "Mañana libre en Kioto",
      "Tren a Osaka al mediodía",
      "Castillo de Osaka y barrio retro de Shinsekai",
    ],
    coordinates: defaultCoordinates["Osaka"],
    iconName: "Train",
    color: "#E07A5F",
    markerContent: {
      title: "Osaka",
      subtitle: "La cocina de Japón",
      description: "Osaka es famosa por su gastronomía: takoyaki, okonomiyaki, y la cultura de 'kuidaore' (comer hasta caer).",
      imageUrl: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400",
      highlights: ["Castillo de Osaka", "Shinsekai", "Street food"],
    },
    tips: "Osaka es más informal que Tokio. La gente es muy amigable.",
    duration: "Tarde y noche",
    transport: "JR Special Rapid (30 min)",
  },
  {
    id: "9",
    day: 9,
    location: "Osaka",
    title: "Sabores de Dotonbori",
    description: "El corazón gastronómico y de entretenimiento de Osaka.",
    activities: [
      "Kuromon Ichiba: sushi fresco y especialidades locales",
      "Dotonbori: el espectáculo de luces y comida callejera",
      "Tarde libre para compras",
    ],
    coordinates: defaultCoordinates["Osaka"],
    iconName: "Utensils",
    color: "#E07A5F",
    markerContent: {
      title: "Dotonbori",
      subtitle: "Centro neurálgico de Osaka",
      description: "El icónico cartel del hombre Glico y el cangrejo gigante de Kani Doraku son símbolos de Osaka.",
      imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400",
      highlights: ["Glico Man", "Takoyaki", "Kuromon Market"],
    },
    tips: "Probar el takoyaki de Wanaka y el okonomiyaki de Mizuno.",
    duration: "Día completo",
    transport: "Metro Osaka",
  },
  {
    id: "10",
    day: 10,
    location: "Tokio",
    title: "Retorno en Tren Bala",
    description: "Experiencia en el famoso Shinkansen de vuelta a Tokio.",
    activities: [
      "Shinkansen de Osaka a Tokio",
      "Tarde libre en la capital",
      "Check-in y cena tranquila",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Train",
    color: "#B87333",
    markerContent: {
      title: "Shinkansen",
      subtitle: "El tren bala",
      description: "El Shinkansen Nozomi cubre los 515km entre Osaka y Tokio en solo 2 horas 22 minutos.",
      imageUrl: "https://images.unsplash.com/photo-1565180803612-0ad79a86e1f7?w=400",
      highlights: ["Velocidad 285km/h", "Vista del Fuji", "Puntualidad perfecta"],
    },
    tips: "Reservar asiento del lado derecho (E) para ver el Monte Fuji.",
    duration: "Medio día",
    transport: "Shinkansen Nozomi",
  },
  {
    id: "11",
    day: 11,
    location: "Tokio",
    title: "Shibuya y Harajuku",
    description: "El Tokio juvenil: moda, tendencias y el cruce más famoso del mundo.",
    activities: [
      "Cruce de Shibuya: el latido de la ciudad",
      "Harajuku: moda Takeshita y Meiji Jingu",
      "Cena temática o libre",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "ShoppingBag",
    color: "#8B5A7C",
    markerContent: {
      title: "Shibuya & Harajuku",
      subtitle: "Juventud y moda",
      description: "El cruce de Shibuya ve pasar 2,500 personas por luz verde. Harajuku es la cuna de la moda callejera.",
      imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
      highlights: ["Shibuya Crossing", "Takeshita Street", "Meiji Jingu"],
    },
    tips: "El mejor punto para fotos del cruce es Starbucks en Shibuya.",
    duration: "Día completo",
    transport: "JR Yamanote",
  },
  {
    id: "12",
    day: 12,
    location: "Tokio",
    title: "Shimokita y Golden Gai",
    description: "El lado alternativo y bohemio de Tokio.",
    activities: [
      "Shimokitazawa: vibra alternativa y vinilos",
      "Shinjuku Golden Gai: callejones con historia",
      "Experiencia de sake nocturno",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Music",
    color: "#C9A227",
    markerContent: {
      title: "Shimokita & Golden Gai",
      subtitle: "Tokio alternativo",
      description: "Shimokitazawa es el barrio hipster de Tokio. Golden Gai tiene 200+ bares en 6 callejones diminutos.",
      imageUrl: "https://images.unsplash.com/photo-1554797589-7241bb691973?w=400",
      highlights: ["Tiendas vintage", "Bares íntimos", "Sake artesanal"],
    },
    tips: "En Golden Gai algunos bares cobran cover. Preguntar antes de entrar.",
    duration: "Tarde y noche",
    transport: "Keio Inokashira Line",
  },
  {
    id: "13",
    day: 13,
    location: "Kamakura",
    title: "Paz frente al mar",
    description: "Escape costero a la antigua capital samurái.",
    activities: [
      "Hasedera y el Gran Buda de Kamakura",
      "Komachi-dori y templos costeros",
      "Regreso a Tokio al atardecer",
    ],
    coordinates: defaultCoordinates["Kamakura"],
    iconName: "Waves",
    color: "#4A90A4",
    markerContent: {
      title: "Kamakura",
      subtitle: "La pequeña Kioto",
      description: "El Gran Buda de Kamakura (13.35m) es una estatua de bronce de 1252. Puedes entrar en su interior.",
      imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400",
      highlights: ["Gran Buda", "Templo Hasedera", "Playa de Yuigahama"],
    },
    tips: "Alquilar bicicleta es la mejor forma de explorar Kamakura.",
    duration: "Día completo",
    transport: "JR Yokosuka Line (1 hora)",
  },
  {
    id: "14",
    day: 14,
    location: "Tokio",
    title: "Skytree y despedida",
    description: "Último día completo en Japón con vistas panorámicas y cena de despedida.",
    activities: [
      "Tokyo Skytree: vistas panorámicas",
      "Ochanomizu: rincón universitario y relax",
      "Cena de despedida en Asakusa",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Sunset",
    color: "#D4756A",
    markerContent: {
      title: "Tokyo Skytree",
      subtitle: "Despedida desde las alturas",
      description: "Con 634m, el Skytree es la torre más alta de Japón. En días claros se ve el Monte Fuji.",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      highlights: ["Vista 360°", "Atardecer", "Cena tradicional"],
    },
    tips: "Comprar tickets online para evitar colas. Mejor ir al atardecer.",
    duration: "Día completo",
    transport: "Metro Asakusa Line",
  },
];

interface ItineraryStore {
  days: DayItinerary[];
  selectedDayId: string | null;
  setSelectedDayId: (id: string | null) => void;
  addDay: (day: Omit<DayItinerary, "id">) => void;
  updateDay: (id: string, updates: Partial<DayItinerary>) => void;
  deleteDay: (id: string) => void;
  reorderDays: (fromIndex: number, toIndex: number) => void;
  addActivity: (dayId: string, activity: string) => void;
  updateActivity: (dayId: string, activityIndex: number, newActivity: string) => void;
  removeActivity: (dayId: string, activityIndex: number) => void;
  updateMarkerContent: (dayId: string, content: Partial<DayItinerary["markerContent"]>) => void;
  addMarkerHighlight: (dayId: string, highlight: string) => void;
  removeMarkerHighlight: (dayId: string, index: number) => void;
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

      updateMarkerContent: (dayId, content) => {
        set({
          days: get().days.map((day) =>
            day.id === dayId
              ? { ...day, markerContent: { ...day.markerContent, ...content } }
              : day
          ),
        });
      },

      addMarkerHighlight: (dayId, highlight) => {
        set({
          days: get().days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  markerContent: {
                    ...day.markerContent,
                    highlights: [...day.markerContent.highlights, highlight],
                  },
                }
              : day
          ),
        });
      },

      removeMarkerHighlight: (dayId, index) => {
        set({
          days: get().days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  markerContent: {
                    ...day.markerContent,
                    highlights: day.markerContent.highlights.filter((_, i) => i !== index),
                  },
                }
              : day
          ),
        });
      },

      resetToDefault: () => set({ days: initialDays, selectedDayId: null }),
    }),
    {
      name: "itinerary-storage-v2",
    }
  )
);
