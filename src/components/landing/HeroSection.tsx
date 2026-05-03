import { motion } from "framer-motion";
import { ArrowRight, Play, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-blue/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(217 91% 60% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60% / 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-glow mb-8">
            <Zap className="w-4 h-4 text-neon-blue" />
            <span className="text-sm text-muted-foreground">100+ Languages Supported</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="text-foreground">Code in </span>
          <span className="gradient-text">Any Language.</span>
          <br />
          <span className="text-foreground">Instantly.</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The universal cloud IDE. Write, compile, and run code in 100+ languages
          directly from your browser. Zero setup required.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button
            onClick={() => navigate("/workspace")}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg gradient-primary text-primary-foreground font-semibold text-lg glow-blue transition-all hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Start Coding
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Mini editor preview */}
        <motion.div
          className="mt-16 mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="glass rounded-xl border-glow overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-neon-green/60" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">main.py — OmniCode</span>
            </div>
            <div className="p-6 text-left font-mono text-sm leading-relaxed">
              <div><span className="text-neon-purple">def</span> <span className="text-neon-blue">solve</span><span className="text-muted-foreground">(</span><span className="text-foreground">problem</span><span className="text-muted-foreground">)</span><span className="text-muted-foreground">:</span></div>
              <div className="pl-6"><span className="text-neon-green">"""Solve any problem, in any language."""</span></div>
              <div className="pl-6"><span className="text-neon-purple">return</span> <span className="text-neon-green">"Hello, World!"</span></div>
              <div className="mt-2"><span className="text-neon-blue">print</span><span className="text-muted-foreground">(</span><span className="text-neon-blue">solve</span><span className="text-muted-foreground">(</span><span className="text-neon-green">"everything"</span><span className="text-muted-foreground">)</span><span className="text-muted-foreground">)</span></div>
              <div className="mt-4 pt-3 border-t border-border text-neon-green/80">
                <span className="text-muted-foreground">▶ </span>Hello, World!
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
