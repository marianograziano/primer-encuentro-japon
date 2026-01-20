export interface DayItinerary {
  day: number;
  location: string;
  title: string;
  activities: string[];
}

export const itineraryData: DayItinerary[] = [
  {
    day: 1,
    location: "TOKIO",
    title: "Salida a Tokio: Asakusa y tradición",
    activities: [
      "Asakusa: barrio histórico y templo Sensō-ji",
      "Paseo por la calle tradicional Nakamise",
      "Experiencia 'wanko' en parque con perros celebridad",
      "Cena de bienvenida: tonkatsu en restaurante familiar",
    ],
  },
  {
    day: 2,
    location: "TOKIO",
    title: "Yanaka y Akihabara: Dos caras de la ciudad",
    activities: [
      "Barrio Yanaka: templos y sake tradicional",
      "Almuerzo libre en la zona",
      "Akihabara: sumérgete en el mundo geek, manga y tecnología",
      "Retorno al hotel y descanso",
    ],
  },
  {
    day: 3,
    location: "FUJI",
    title: "Naturaleza a los pies del volcán",
    activities: [
      "Traslado al área del Monte Fuji",
      "Lago Kawaguchiko: las mejores postales",
      "Caminata crepuscular por la ribera",
      "Noche tranquila cerca del lago",
    ],
  },
  {
    day: 4,
    location: "KIOTO",
    title: "Llegada a la capital cultural",
    activities: [
      "Santuario Heian: simetría y color bermellón",
      "Paseo literario: calles Sannenzaka y Ninenzaka",
      "Cena libre en el histórico callejón Pontocho",
    ],
  },
  {
    day: 5,
    location: "KIOTO",
    title: "Pabellones dorados y bosques de bambú",
    activities: [
      "Templo Kinkaku-ji: el majestuoso Pabellón Dorado",
      "Arashiyama: caminata por el famoso bosque de bambú",
      "Templo Tenryu-ji y sus jardines zen",
    ],
  },
  {
    day: 6,
    location: "KIOTO",
    title: "Senderos de Torii y noche de Jazz",
    activities: [
      "Fushimi Inari: el camino de los mil torii",
      "Jardín Imperial Kyoto Gyoen",
      "Noche cultural: Jazz en vivo en Kioto",
    ],
  },
  {
    day: 7,
    location: "NARA / UJI",
    title: "Ciervos sagrados y la ciudad del té",
    activities: [
      "Nara: Gran Buda de Todai-ji y ciervos en el parque",
      "Uji: Cuna del té verde y templo Byodo-in",
      "Regreso a Kioto por la tarde",
    ],
  },
  {
    day: 8,
    location: "KIOTO / OSAKA",
    title: "Hacia la vibrante Osaka",
    activities: [
      "Mañana libre en Kioto",
      "Tren a Osaka al mediodía",
      "Castillo de Osaka y barrio retro de Shinsekai",
    ],
  },
  {
    day: 9,
    location: "OSAKA",
    title: "Sabores de Dotonbori",
    activities: [
      "Kuromon Ichiba: sushi fresco y especialidades locales",
      "Dotonbori: el espectáculo de luces y comida callejera",
      "Tarde libre para compras",
    ],
  },
  {
    day: 10,
    location: "TOKIO",
    title: "Retorno en Tren Bala",
    activities: [
      "Shinkansen de Osaka a Tokio",
      "Tarde libre en la capital",
      "Check-in y cena tranquila",
    ],
  },
  {
    day: 11,
    location: "TOKIO",
    title: "Shibuya y Harajuku",
    activities: [
      "Cruce de Shibuya: el latido de la ciudad",
      "Harajuku: moda Takeshita y Meiji Jingu",
      "Cena temática o libre",
    ],
  },
  {
    day: 12,
    location: "TOKIO",
    title: "Shimokita y Golden Gai",
    activities: [
      "Shimokitazawa: vibra alternativa y vinilos",
      "Shinjuku Golden Gai: callejones con historia",
      "Experiencia de sake nocturno",
    ],
  },
  {
    day: 13,
    location: "KAMAKURA",
    title: "Paz frente al mar",
    activities: [
      "Hasedera y el Gran Buda de Kamakura",
      "Komachi-dori y templos costeros",
      "Regreso a Tokio al atardecer",
    ],
  },
  {
    day: 14,
    location: "TOKIO",
    title: "Skytree y despedida",
    activities: [
      "Tokyo Skytree: vistas panorámicas",
      "Ochanomizu: rincón universitario y relax",
      "Cena de despedida en Asakusa",
    ],
  },
];

export const includedItems = [
  { title: "Aéreo", description: "Desde Buenos Aires a Tokio (clase turista, 1 valija incluida)" },
  { title: "Hoteles Seleccionados", description: "2 noches en Tokio (Asakusa), 1 noche en Fuji (Kawaguchiko), 4 noches en Kioto, 2 noches en Osaka, 5 noches en Tokio" },
  { title: "Transporte Logístico", description: "Trenes, buses y metro entre ciudades" },
  { title: "Tren Bala", description: "Trayecto Osaka – Tokio en Shinkansen" },
  { title: "Tarjeta Suica/Pasmo", description: "Con 5.000 yenes para traslados locales" },
  { title: "Acompañamiento", description: "Guía personalizado durante todas las actividades" },
];

export const notIncludedItems = [
  { title: "Alimentación", description: "Almuerzos y cenas (libres para explorar)" },
  { title: "Traslados Locales", description: "Buses y metro fuera de lo previsto" },
  { title: "Seguro de Viaje", description: "Obligatorio contratar antes de la salida" },
  { title: "Entradas", description: "Acceso a templos, museos o atracciones" },
  { title: "Extras", description: "Gastos personales y actividades opcionales" },
];

export const cities = ["Tokio", "Fuji", "Kioto", "Osaka", "Nara", "Kamakura"];
