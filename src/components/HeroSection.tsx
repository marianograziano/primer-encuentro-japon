import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useItineraryStore } from "@/store/itineraryStore";

export function HeroSection() {
  const { days } = useItineraryStore();
  
  // Get unique locations
  const uniqueLocations = new Set(days.map((d) => d.location.split("/")[0].trim()));

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-accent/5 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Japanese character decoration */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-display text-primary pointer-events-none select-none"
          >
            旅
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <span className="text-sm font-medium text-secondary uppercase tracking-[0.3em] mb-4 block">
              Itinerario completo
            </span>
            
            <h1 className="text-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6">
              {days.length} Días de
              <span className="block text-primary">Descubrimiento</span>
            </h1>

            <p className="text-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Un paseo espiritual y humano por Japón, a tu ritmo.
              <br />
              <em className="text-secondary">Sentir. Conversar. Vivir.</em>
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 mb-8"
          >
            {[
              { icon: Calendar, label: "Días", value: days.length.toString() },
              { icon: MapPin, label: "Ciudades", value: uniqueLocations.size.toString() },
              { icon: Users, label: "Grupo reducido", value: "8-10" },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-display text-2xl text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Editor button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/editor">
              <Button variant="outline" size="lg" className="gap-2">
                <Settings size={18} />
                Editar Itinerario
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
