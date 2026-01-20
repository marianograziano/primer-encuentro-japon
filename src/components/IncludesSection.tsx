import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { includedItems, notIncludedItems } from "@/data/itinerary";

export function IncludesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-display text-4xl md:text-5xl text-foreground mb-4">
            ¿Qué incluye el viaje?
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Included */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-display text-2xl text-foreground">Incluye</h3>
            </div>

            <ul className="space-y-4">
              {includedItems.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </span>
                  <div>
                    <span className="font-medium text-foreground">{item.title}:</span>{" "}
                    <span className="text-muted-foreground text-sm">{item.description}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Not Included */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <X className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-display text-2xl text-foreground">No Incluye</h3>
            </div>

            <ul className="space-y-4">
              {notIncludedItems.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-secondary" />
                  </span>
                  <div>
                    <span className="font-medium text-foreground">{item.title}:</span>{" "}
                    <span className="text-muted-foreground text-sm">{item.description}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto"
        >
          <strong>Nota:</strong> El acompañamiento no implica responsabilidad legal sobre servicios de
          terceros. Los viajeros deben ser mayores de 18 años y contar con seguro de viaje obligatorio.
        </motion.p>
      </div>
    </section>
  );
}
