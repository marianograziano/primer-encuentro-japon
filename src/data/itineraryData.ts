import type { Itinerary } from "@/types/itinerary";

export const itineraryData: Itinerary = {
  title: "ITINERARIO: Primer encuentro con Japón",
  duration_days: 15,
  itinerary: [
    {
      day: 1,
      base_city: "Tokio",
      title: "Tokio",
      activities: [
        {
          type: "logistics",
          name: "Llegada a Tokio",
          details: ["Tren a hotel"],
          included: true
        },
        {
          type: "sightseeing",
          name: "Asakusa",
          details: [
            "Paseo por el barrio tradicional",
            "Visita al templo Sensō-ji",
            "Caminata por la ribera del río Sumida"
          ]
        },
        {
          type: "experience",
          name: "Experiencia sento",
          details: ["Baño público japonés", "Relajación y cultura cotidiana"]
        },
        {
          type: "meal",
          name: "Cena temprana en restaurante familiar",
          included: true
        }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 2,
      base_city: "Tokio",
      title: "Tokio",
      activities: [
        {
          type: "sightseeing",
          name: "Ueno",
          details: [
            "Paseo por el mercado Ameyoko",
            "Llegada al parque",
            "Breve visita a sus templos y museos"
          ]
        },
        { type: "meal", name: "Almuerzo", included: false, notes: "Libre" },
        {
          type: "sightseeing",
          name: "Barrio Yanaka",
          details: [
            "Calles estrechas y templos que sobrevivieron a la guerra",
            "Santuario Nezu"
          ]
        },
        { type: "sightseeing", name: "Jinbocho", details: ["El paraíso de las librerías"] },
        { type: "rest", name: "Descanso en hotel" },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 3,
      base_city: "Tokio",
      title: "Tokio / Hakone",
      travel: [
        {
          mode: "traslado",
          from: "Tokio",
          to: "Hakone",
          purpose: "Vistas del Monte Fuji",
          included: true
        }
      ],
      activities: [
        { type: "sightseeing", name: "Ascenso al mirador del Fuji" },
        {
          type: "experience",
          name: "Paseo en bote por el lago Ashi",
          included: true
        },
        {
          type: "walk",
          name: "Caminata crepuscular por la orilla del lago",
          details: ["Reflejo dorado del Fuji"]
        },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 4,
      base_city: "Hakone",
      title: "Hakone / Osaka",
      activities: [
        { type: "free_time", name: "Mañana libre" }
      ],
      travel: [
        {
          mode: "train",
          name: "Tren a Osaka",
          time_note: "Salida a mediodía",
          included: true
        }
      ],
      activities_continued: [
        { type: "logistics", name: "Llegada a Osaka" },
        { type: "sightseeing", name: "Castillo de Osaka", details: ["Símbolo de la ciudad"] },
        {
          type: "sightseeing",
          name: "Barrio Shinsekai",
          details: ["Torre Tsūtenkaku", "Ambiente retro"]
        },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 5,
      base_city: "Osaka",
      title: "Osaka",
      activities: [
        {
          type: "sightseeing",
          name: "Nanba, Shinsaibashi y Dotonbori",
          details: ["Luces", "Gastronomía", "Vida nocturna"]
        },
        {
          type: "food_market",
          name: "Kuromon Ichiba Market",
          details: ["Mercado popular", "Probar takoyaki", "Sushi fresco"]
        },
        { type: "rest", name: "Descanso en hotel" },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 6,
      base_city: "Osaka",
      title: "Osaka / Hiroshima",
      travel: [
        {
          mode: "train",
          name: "Tren bala a Hiroshima",
          time_note: "Salida de Osaka y llegada a mediodía"
        }
      ],
      activities: [
        { type: "sightseeing", name: "Parque de la Paz" },
        { type: "museum", name: "Museo de la Paz" },
        { type: "sightseeing", name: "Domo de la Bomba atómica" },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 7,
      base_city: "Hiroshima",
      title: "Hiroshima",
      activities: [
        {
          type: "day_trip",
          name: "Isla Miyajima",
          details: ["Ferry incluido"],
          included: true
        },
        {
          type: "sightseeing",
          name: "Santuario Itsukushima",
          details: ["Torii flotante"]
        },
        { type: "hike", name: "Monte Misen", details: ["Vistas panorámicas"] },
        { type: "logistics", name: "Regreso a Hiroshima" },
        {
          type: "meal",
          name: "Cena",
          included: false,
          notes: "Libre (Okonomimura)"
        }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 8,
      base_city: "Hiroshima",
      title: "Hiroshima / Kioto",
      travel: [
        {
          mode: "train",
          name: "Tren bala a Kioto",
          time_note: "Llegada a mediodía"
        }
      ],
      activities: [
        {
          type: "sightseeing",
          name: "Santuario Fushimi Inari",
          details: ["Los miles de torii rojos"]
        },
        {
          type: "sightseeing",
          name: "Barrio de Gion",
          details: ["Paseo por calles históricas", "Casas de té", "Geishas"]
        },
        { type: "rest", name: "Descanso en hotel" },
        { type: "meal", name: "Cena", included: false, notes: "Libre en Pontocho" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 9,
      base_city: "Kioto",
      title: "Kioto",
      activities: [
        {
          type: "sightseeing",
          name: "Arashiyama",
          details: ["Puente Togetsukyo", "Bosque de bambú"]
        },
        {
          type: "sightseeing",
          name: "Templo Tenryu-ji",
          details: ["Patrimonio UNESCO", "Opcional: Monkey Park Iwatayama"]
        },
        { type: "meal", name: "Almuerzo", included: false, notes: "Libre" },
        {
          type: "sightseeing",
          name: "Kinkaku-ji y Ryoan-ji",
          details: ["Pabellón Dorado", "Jardín zen"]
        },
        { type: "rest", name: "Descanso en hotel" },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 10,
      base_city: "Kioto",
      title: "Nara / Uji",
      travel: [
        {
          mode: "train",
          name: "Salida por la mañana",
          included: true
        }
      ],
      activities: [
        {
          type: "day_trip",
          name: "Nara",
          details: ["Gran Buda de Todai-ji", "Ciervos sagrados en el parque"]
        },
        {
          type: "day_trip",
          name: "Uji",
          details: ["Ciudad del té verde", "Visita al Byōdō-in", "Estatua Murasaki Shikibu"]
        },
        { type: "logistics", name: "Regreso a Kioto" },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 11,
      base_city: "Kioto",
      title: "Kioto",
      activities: [
        {
          type: "sightseeing",
          name: "Kiyomizu-dera",
          details: ["Terraza de madera", "Fuentes sagradas", "Callejuelas"]
        },
        {
          type: "sightseeing",
          name: "Santuario Heian Jingu",
          details: ["Torii gigante"]
        },
        {
          type: "walk",
          name: "Paseo del Filósofo",
          details: ["Caminata reflexiva entre templos y naturaleza"]
        },
        { type: "sightseeing", name: "Jardines del Palacio Imperial" },
        {
          type: "sightseeing",
          name: "Castillo de Nijo",
          details: ["Residencia de los shogunes Tokugawa"]
        },
        { type: "rest", name: "Descanso en hotel" },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 12,
      base_city: "Kioto",
      title: "Kioto / Tokio",
      travel: [
        {
          mode: "train",
          name: "Tren bala a Tokio",
          included: true
        }
      ],
      activities: [
        {
          type: "sightseeing",
          name: "Santuario Meiji",
          details: ["Espiritualidad en medio de la ciudad"]
        },
        {
          type: "sightseeing",
          name: "Shibuya",
          details: ["Paseo por el barrio", "Cruce famoso", "Estatua Hachiko"]
        },
        {
          type: "sightseeing",
          name: "Harajuku",
          details: ["Moda y juventud", "Calle Takeshita"]
        },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 13,
      base_city: "Tokio",
      title: "Tokio",
      activities: [
        {
          type: "sightseeing",
          name: "Nakano y Koenji",
          details: ["Barrios alternativos", "Librerías", "Templos escondidos"]
        },
        {
          type: "nightlife",
          name: "Shinjuku",
          details: ["Vida nocturna", "Golden Gai", "Experiencia de sake y comida callejera"]
        },
        { type: "meal", name: "Cena", included: false, notes: "Libre" }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 14,
      base_city: "Tokio",
      title: "Tokio",
      activities: [
        { type: "sightseeing", name: "Akihabara", details: ["Cultura pop", "Manga", "Anime"] },
        {
          type: "sightseeing",
          name: "Kanda Myōjin Shrine",
          details: ["Santuario con más de 1.200 años de historia"]
        },
        {
          type: "sightseeing",
          name: "Ochanomizu",
          details: [
            "Barrio de instrumentos musicales",
            "Librerías especializadas",
            "Rincón alternativo y creativo"
          ]
        },
        {
          type: "meal",
          name: "Cena despedida en Izakaya",
          included: true
        }
      ],
      end_note: "Fin de jornada."
    },
    {
      day: 15,
      base_city: "Tokio",
      title: "Tokio",
      activities: [
        { type: "free_time", name: "Día libre para compras", details: ["Ginza o Shinjuku"] },
        { type: "logistics", name: "Fin de viaje" },
        {
          type: "transport",
          name: "Tren a aeropuerto",
          included: true
        }
      ]
    }
  ]
};
