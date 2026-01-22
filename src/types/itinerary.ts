import { LucideIcon } from "lucide-react";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MarkerContent {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  highlights: string[];
}

export interface DayItinerary {
  id: string;
  day: number;
  location: string;
  title: string;
  description: string;
  activities: string[];
  coordinates: Coordinates;
  iconName: string;
  color: string;
  markerContent: MarkerContent;
  tips: string;
  duration: string;
  transport: string;
}

export interface ItineraryState {
  days: DayItinerary[];
  selectedDayId: string | null;
}

export const defaultCoordinates: Record<string, Coordinates> = {
  "Tokio": { lat: 35.6762, lng: 139.6503 },
  "Fuji": { lat: 35.3606, lng: 138.7274 },
  "Kioto": { lat: 35.0116, lng: 135.7681 },
  "Osaka": { lat: 34.6937, lng: 135.5023 },
  "Nara": { lat: 34.6851, lng: 135.8048 },
  "Kamakura": { lat: 35.3192, lng: 139.5467 },
  "Uji": { lat: 34.8841, lng: 135.8003 },
};

export const iconOptions = [
  "MapPin",
  "Building2",
  "Mountain",
  "TreePine",
  "Shrine",
  "Train",
  "Utensils",
  "Camera",
  "Music",
  "ShoppingBag",
  "Waves",
  "Sunset",
  "Star",
  "Heart",
  "Coffee",
  "Plane",
] as const;

export const colorOptions = [
  { name: "Terracotta", value: "#B87333" },
  { name: "Gold", value: "#C9A227" },
  { name: "Moss", value: "#6B7B5E" },
  { name: "Coral", value: "#E07A5F" },
  { name: "Ocean", value: "#4A90A4" },
  { name: "Plum", value: "#8B5A7C" },
  { name: "Forest", value: "#2D5A3D" },
  { name: "Sunset", value: "#D4756A" },
];
