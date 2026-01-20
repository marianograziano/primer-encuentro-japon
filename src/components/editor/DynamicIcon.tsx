import { 
  MapPin, Building2, Mountain, TreePine, Train, Utensils, 
  Camera, Music, ShoppingBag, Waves, Sunset, Star, Heart, Coffee, Plane,
  LucideIcon
} from "lucide-react";
import { iconOptions } from "@/types/itinerary";

const iconMap: Record<string, LucideIcon> = {
  MapPin,
  Building2,
  Mountain,
  TreePine,
  Train,
  Utensils,
  Camera,
  Music,
  ShoppingBag,
  Waves,
  Sunset,
  Star,
  Heart,
  Coffee,
  Plane,
};

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export function DynamicIcon({ name, size = 24, className = "", color }: DynamicIconProps) {
  const IconComponent = iconMap[name] || MapPin;
  
  return <IconComponent size={size} className={className} color={color} />;
}

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  color?: string;
}

export function IconPicker({ value, onChange, color }: IconPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2 p-2 bg-card rounded-lg border border-border max-h-48 overflow-y-auto">
      {iconOptions.map((iconName) => (
        <button
          key={iconName}
          type="button"
          onClick={() => onChange(iconName)}
          className={`p-3 rounded-lg transition-all flex items-center justify-center ${
            value === iconName
              ? "bg-primary text-primary-foreground ring-2 ring-primary"
              : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <DynamicIcon name={iconName} size={20} color={value === iconName ? undefined : color} />
        </button>
      ))}
    </div>
  );
}
