export interface Activity {
  type: string;
  name: string;
  details?: string[];
  included?: boolean;
  notes?: string;
}

export interface Travel {
  mode: string;
  name?: string;
  from?: string;
  to?: string;
  purpose?: string;
  time_note?: string;
  included?: boolean;
}

export interface DayItinerary {
  day: number;
  base_city: string;
  title: string;
  activities: Activity[];
  activities_continued?: Activity[];
  travel?: Travel[];
  end_note?: string;
}

export interface Itinerary {
  title: string;
  duration_days: number;
  itinerary: DayItinerary[];
}

export const activityIcons: Record<string, string> = {
  logistics: "Plane",
  sightseeing: "Camera",
  experience: "Sparkles",
  meal: "Utensils",
  rest: "Moon",
  free_time: "Coffee",
  walk: "Footprints",
  food_market: "ShoppingBag",
  museum: "Building2",
  day_trip: "Map",
  hike: "Mountain",
  nightlife: "Music",
  transport: "Train",
};

export const cityColors: Record<string, string> = {
  "Tokio": "#B87333",
  "Hakone": "#6B7B5E",
  "Osaka": "#E07A5F",
  "Hiroshima": "#4A90A4",
  "Kioto": "#8B5A7C",
};
