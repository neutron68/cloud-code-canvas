import { motion } from "framer-motion";
import { Globe, Shield, Zap, Layers, Terminal, Users } from "lucide-react";

const features = [
  { icon: Globe, title: "100+ Languages", desc: "From Python to Assembly. Write in any language without installing anything." },
  { icon: Zap, title: "Instant Execution", desc: "Click run and see results in milliseconds. Powered by cloud containers." },
  { icon: Shield, title: "Secure Sandboxing", desc: "Every execution runs in an isolated container. Your code is safe." },
  { icon: Layers, title: "Multi-file Projects", desc: "Build real projects with multiple files, folders, and dependencies." },
  { icon: Terminal, title: "Integrated Terminal", desc: "Full terminal access for advanced development workflows." },
  { icon: Users, title: "Collaborative", desc: "Share projects, collaborate in real-time, and learn together." },
];

const FeaturesSection = () => (
  <section className="relative py-32 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          Everything you need to <span className="gradient-text">code anywhere</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A professional-grade development environment that lives in your browser.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="glass rounded-xl p-6 border-glow hover:glow-blue/30 transition-all group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <f.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
