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

// Itinerario literario y cultural de 14 días por Japón
const initialDays: DayItinerary[] = [
  {
    id: "1",
    day: 1,
    location: "Tokio",
    title: "Llegada y primeras impresiones",
    description: "Llegada a Japón y primer contacto con la cultura tradicional en el histórico barrio de Asakusa.",
    activities: [
      "Llegada y traslado al hotel",
      "Asakusa: paseo por el barrio tradicional y templo Sensō-ji",
      "Caminata por la ribera del río Sumida",
      "Experiencia 'sento': baño público japonés",
      "Cena temprana en restaurante familiar (incluida)",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Plane",
    color: "#B87333",
    markerContent: {
      title: "Tokio - Asakusa",
      subtitle: "Bienvenida a Japón",
      description: "El templo Sensō-ji es el templo budista más antiguo de Tokio, fundado en el año 645.",
      imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      highlights: ["Templo Sensō-ji", "Río Sumida", "Sento tradicional"],
    },
    tips: "Llevar yen en efectivo. Muchos locales no aceptan tarjeta.",
    duration: "Día completo",
    transport: "Traslado desde aeropuerto",
  },
  {
    id: "2",
    day: 2,
    location: "Tokio",
    title: "Ueno, Yanaka y Jinbocho",
    description: "Explorando mercados, templos históricos y el paraíso de las librerías.",
    activities: [
      "Ueno: mercado Ameyoko y parque con templos",
      "Almuerzo libre",
      "Barrio Yanaka: calles estrechas y templos que sobrevivieron a la guerra",
      "Santuario Nezu",
      "Jinbocho: el paraíso de las librerías",
      "Cena libre en barrio cercano",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "BookOpen",
    color: "#B87333",
    markerContent: {
      title: "Tokio - Yanaka & Jinbocho",
      subtitle: "Historia y literatura",
      description: "Yanaka conserva el encanto del viejo Tokio. Jinbocho alberga más de 170 librerías.",
      imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
      highlights: ["Mercado Ameyoko", "Santuario Nezu", "Librerías antiguas"],
    },
    tips: "Jinbocho es ideal para encontrar libros de arte y fotografía japonesa.",
    duration: "Día completo",
    transport: "JR Yamanote Line",
  },
  {
    id: "3",
    day: 3,
    location: "Fuji",
    title: "Medio día Tokio, salida al Fuji",
    description: "Mañana relajada en Tokio y traslado al icónico Monte Fuji.",
    activities: [
      "Mañana: paseo por Sumida River",
      "Breve visita a un café tradicional",
      "Traslado a Monte Fuji – Lago Kawaguchiko",
      "Ascenso al Mt. Tenjō: mirador del Fuji",
      "Paseo en bote por el lago Kawaguchiko",
      "Caminata crepuscular por la orilla del lago",
    ],
    coordinates: defaultCoordinates["Fuji"],
    iconName: "Mountain",
    color: "#6B7B5E",
    markerContent: {
      title: "Monte Fuji",
      subtitle: "Símbolo sagrado de Japón",
      description: "El Monte Fuji (3,776m) es Patrimonio de la Humanidad y el pico más alto de Japón.",
      imageUrl: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400",
      highlights: ["Mt. Tenjō", "Lago Kawaguchiko", "Reflejo dorado del Fuji"],
    },
    tips: "La mejor visibilidad del Fuji es temprano en la mañana.",
    duration: "Día completo + noche",
    transport: "Bus express desde Shinjuku",
  },
  {
    id: "4",
    day: 4,
    location: "Kioto",
    title: "Llegada a Kioto - Fushimi Inari y Gion",
    description: "Primer día en la antigua capital imperial con los miles de torii rojos.",
    activities: [
      "Santuario Fushimi Inari: los miles de torii rojos",
      "Barrio de Gion: paseo por calles históricas",
      "Casas de té y geishas",
      "Descanso en hotel",
      "Cena libre en Pontocho",
    ],
    coordinates: defaultCoordinates["Kioto"],
    iconName: "MapPin",
    color: "#C9A227",
    markerContent: {
      title: "Kioto - Fushimi Inari",
      subtitle: "Miles de puertas torii",
      description: "El santuario tiene más de 10,000 torii que forman túneles a lo largo de 4km de senderos.",
      imageUrl: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400",
      highlights: ["10,000+ torii", "Barrio Gion", "Pontocho"],
    },
    tips: "Reservar ryokan con anticipación si se desea experiencia tradicional.",
    duration: "Día completo",
    transport: "Shinkansen desde Fuji",
  },
  {
    id: "5",
    day: 5,
    location: "Himeji",
    title: "Excursión a Himeji",
    description: "Visita al impresionante Castillo Blanco, Patrimonio de la Humanidad.",
    activities: [
      "Castillo de Himeji: recorre la fortaleza blanca y sube a la torre principal",
      "Jardines Koko-en: pasea por los nueve jardines Edo",
      "Té matcha contemplando el murmullo del agua",
      "Calle Miyuki-dori: tiendas locales y Himeji oden",
    ],
    coordinates: { lat: 34.8394, lng: 134.6939 },
    iconName: "Castle",
    color: "#8B5A7C",
    markerContent: {
      title: "Himeji",
      subtitle: "El Castillo de la Garza Blanca",
      description: "El Castillo de Himeji es el mejor ejemplo de arquitectura de castillos japoneses, Patrimonio UNESCO.",
      imageUrl: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400",
      highlights: ["Castillo Patrimonio UNESCO", "Jardines Koko-en", "Himeji oden"],
    },
    tips: "Las explicaciones serán concisas pero profundas, invitando al diálogo sobre el sentido espiritual e histórico.",
    duration: "Día completo",
    transport: "Shinkansen desde Kioto (1h)",
  },
  {
    id: "6",
    day: 6,
    location: "Kioto",
    title: "Arashiyama y templos",
    description: "El famoso bosque de bambú y los pabellones dorados.",
    activities: [
      "Arashiyama: puente Togetsukyo y bosque de bambú",
      "Templo Tenryu-ji (Patrimonio UNESCO)",
      "Almuerzo libre",
      "Kinkaku-ji (Pabellón Dorado)",
      "Ryoan-ji (jardín zen)",
      "Cena libre",
    ],
    coordinates: defaultCoordinates["Kioto"],
    iconName: "TreePine",
    color: "#6B7B5E",
    markerContent: {
      title: "Arashiyama & Kinkaku-ji",
      subtitle: "Bambú y oro",
      description: "El Pabellón Dorado está cubierto con hojas de oro puro. El bosque de bambú de Arashiyama es mágico.",
      imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400",
      highlights: ["Bosque de bambú", "Pabellón Dorado", "Jardín zen Ryoan-ji"],
    },
    tips: "Llegar temprano a Arashiyama (7am) para evitar multitudes.",
    duration: "Día completo",
    transport: "Tren JR Sagano",
  },
  {
    id: "7",
    day: 7,
    location: "Kioto",
    title: "Filosofía y castillos",
    description: "Kiyomizu-dera, el Paseo del Filósofo y el Castillo Nijo.",
    activities: [
      "Kiyomizu-dera: terraza de madera y fuentes sagradas",
      "Callejuelas de acceso con tiendas tradicionales",
      "Santuario Heian Jingu con torii gigante",
      "Paseo del Filósofo: caminata reflexiva",
      "Jardines del Palacio Imperial",
      "Castillo de Nijo: residencia de los shogunes Tokugawa",
    ],
    coordinates: defaultCoordinates["Kioto"],
    iconName: "Footprints",
    color: "#C9A227",
    markerContent: {
      title: "Kioto - Paseo del Filósofo",
      subtitle: "Reflexión y naturaleza",
      description: "El Paseo del Filósofo debe su nombre al filósofo Nishida Kitaro quien meditaba mientras caminaba.",
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400",
      highlights: ["Kiyomizu-dera", "Paseo del Filósofo", "Castillo Nijo"],
    },
    tips: "Kiyomizu-dera merece al menos 2 horas de exploración.",
    duration: "Día completo",
    transport: "Bus municipal de Kioto",
  },
  {
    id: "8",
    day: 8,
    location: "Nara / Uji",
    title: "Excursión Nara y Uji",
    description: "Ciervos sagrados, el Gran Buda y la ciudad del té verde.",
    activities: [
      "Nara: Gran Buda de Tōdai-ji",
      "Ciervos sagrados en el parque",
      "Uji: ciudad del té verde",
      "Visita al Byōdō-in",
      "Regreso a Kioto",
      "Cena libre",
    ],
    coordinates: defaultCoordinates["Nara"],
    iconName: "Coffee",
    color: "#6B7B5E",
    markerContent: {
      title: "Nara & Uji",
      subtitle: "Ciervos y té matcha",
      description: "Los 1,200 ciervos de Nara son considerados mensajeros de los dioses. Uji produce el mejor matcha.",
      imageUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400",
      highlights: ["Gran Buda Tōdai-ji", "Ciervos sagrados", "Té matcha en Uji"],
    },
    tips: "Comprar galletas 'shika senbei' para alimentar los ciervos (¥200).",
    duration: "Día completo",
    transport: "JR desde Kioto",
  },
  {
    id: "9",
    day: 9,
    location: "Osaka",
    title: "Llegada a Osaka",
    description: "Llegada a la vibrante Osaka, la cocina de Japón.",
    activities: [
      "Castillo de Osaka: símbolo de la ciudad",
      "Barrio Shinsekai: torre Tsūtenkaku y ambiente retro",
      "Cena libre",
    ],
    coordinates: defaultCoordinates["Osaka"],
    iconName: "Building2",
    color: "#E07A5F",
    markerContent: {
      title: "Osaka",
      subtitle: "La cocina de Japón",
      description: "Osaka es famosa por su gastronomía: takoyaki, okonomiyaki, y la cultura de 'kuidaore'.",
      imageUrl: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400",
      highlights: ["Castillo de Osaka", "Shinsekai", "Torre Tsūtenkaku"],
    },
    tips: "Osaka es más informal que Tokio. La gente es muy amigable.",
    duration: "Tarde y noche",
    transport: "JR Special Rapid desde Kioto",
  },
  {
    id: "10",
    day: 10,
    location: "Osaka",
    title: "Osaka completo",
    description: "Exploración de los barrios más vibrantes y gastronómicos.",
    activities: [
      "Nanba, Shinsaibashi y Dotonbori",
      "Luces, gastronomía y vida urbana",
      "Kuromon Ichiba Market: takoyaki y sushi fresco",
      "Descanso en hotel",
      "Cena libre",
    ],
    coordinates: defaultCoordinates["Osaka"],
    iconName: "Utensils",
    color: "#E07A5F",
    markerContent: {
      title: "Dotonbori",
      subtitle: "Centro neurálgico de Osaka",
      description: "El icónico cartel del hombre Glico y el cangrejo gigante son símbolos de Osaka.",
      imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400",
      highlights: ["Dotonbori", "Kuromon Market", "Takoyaki"],
    },
    tips: "Probar el takoyaki de Wanaka y el okonomiyaki de Mizuno.",
    duration: "Día completo",
    transport: "Metro Osaka",
  },
  {
    id: "11",
    day: 11,
    location: "Tokio",
    title: "Regreso a Tokio",
    description: "Mañana libre en Osaka y viaje en tren bala a Tokio.",
    activities: [
      "Mañana libre para compras en Osaka",
      "Almuerzo incluido",
      "Tren bala a Tokio",
      "Check-in hotel Tokio",
      "Cena libre",
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
    id: "12",
    day: 12,
    location: "Tokio",
    title: "Santuarios y barrios",
    description: "Meiji Jingu, Shibuya y la moda de Harajuku.",
    activities: [
      "Santuario Meiji: espiritualidad en medio de la ciudad",
      "Shibuya: paseo por el barrio y cruce famoso",
      "Harajuku: moda y juventud, Calle Takeshita",
      "Compras y paseo",
      "Cena libre",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "ShoppingBag",
    color: "#8B5A7C",
    markerContent: {
      title: "Shibuya & Harajuku",
      subtitle: "Juventud y moda",
      description: "El cruce de Shibuya ve pasar 2,500 personas por luz verde. Harajuku es la cuna de la moda callejera.",
      imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
      highlights: ["Meiji Jingu", "Shibuya Crossing", "Takeshita Street"],
    },
    tips: "El mejor punto para fotos del cruce es Starbucks en Shibuya.",
    duration: "Día completo",
    transport: "JR Yamanote",
  },
  {
    id: "13",
    day: 13,
    location: "Tokio",
    title: "Cultura pop y vida nocturna",
    description: "Barrios alternativos, librerías y la vibrante Golden Gai.",
    activities: [
      "Nakano y Koenji: barrios alternativos y librerías",
      "Templos escondidos",
      "Shinjuku: vida nocturna y Golden Gai",
      "Experiencia de sake y comida callejera",
      "Cena libre",
    ],
    coordinates: defaultCoordinates["Tokio"],
    iconName: "Music",
    color: "#C9A227",
    markerContent: {
      title: "Nakano & Golden Gai",
      subtitle: "Tokio alternativo",
      description: "Golden Gai tiene 200+ bares en 6 callejones diminutos. Nakano es paraíso otaku menos conocido.",
      imageUrl: "https://images.unsplash.com/photo-1554797589-7241bb691973?w=400",
      highlights: ["Nakano Broadway", "Golden Gai", "Sake artesanal"],
    },
    tips: "En Golden Gai algunos bares cobran cover. Preguntar antes de entrar.",
    duration: "Tarde y noche",
    transport: "JR Chuo Line",
  },
  {
    id: "14",
    day: 14,
    location: "Kamakura / Tokio",
    title: "Kamakura y despedida",
    description: "Excursión matutina a Kamakura, última tarde en Tokio y despedida.",
    activities: [
      "08:30 - Salida en tren JR a Kamakura",
      "Templo Hase-dera: jardines y vistas al mar",
      "Gran Buda (Daibutsu) en Kōtoku-in",
      "Paseo por Komachi-dori: tiendas y dulces locales",
      "Santuario Tsurugaoka Hachimangū",
      "14:30 - Regreso a Tokio",
      "Tiempo libre para compras en Shinjuku o Ginza",
      "Traslado al aeropuerto - Fin del viaje",
    ],
    coordinates: defaultCoordinates["Kamakura"],
    iconName: "Sunset",
    color: "#D4756A",
    markerContent: {
      title: "Kamakura",
      subtitle: "La pequeña Kioto",
      description: "El Gran Buda de Kamakura (13.35m) es una estatua de bronce de 1252. Puedes entrar en su interior.",
      imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400",
      highlights: ["Gran Buda", "Templo Hase-dera", "Komachi-dori"],
    },
    tips: "Kamakura es perfecta para una mañana tranquila antes de la despedida.",
    duration: "Día completo",
    transport: "JR Yokosuka Line (1 hora)",
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
