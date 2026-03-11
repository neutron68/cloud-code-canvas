import { motion } from "framer-motion";

const langs = [
  "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Java", "Go", "Rust",
  "Ruby", "PHP", "Swift", "Kotlin", "Scala", "Dart", "Lua", "R", "Perl",
  "Haskell", "Elixir", "Clojure", "Julia", "Bash", "Zig", "Nim", "OCaml",
  "F#", "Fortran", "COBOL", "Assembly", "Pascal", "Erlang", "Prolog", "Lisp", "Solidity",
];

const LanguagesSection = () => (
  <section className="relative py-32 px-4 overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-purple/5 blur-[150px]" />
    </div>

    <div className="relative max-w-5xl mx-auto text-center">
      <motion.h2
        className="text-3xl sm:text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="gradient-text">Every language</span> you can think of
      </motion.h2>
      <motion.p
        className="text-muted-foreground text-lg mb-12"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        And many more. We're always adding new languages.
      </motion.p>

      <motion.div
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {langs.map((lang, i) => (
          <motion.span
            key={lang}
            className="px-4 py-2 rounded-lg glass border-glow text-sm font-mono text-muted-foreground hover:text-foreground hover:glow-blue transition-all cursor-default"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.02 * i }}
          >
            {lang}
          </motion.span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default LanguagesSection;
