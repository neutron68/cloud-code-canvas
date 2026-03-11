import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { languages, Language } from "@/data/languages";

interface Props {
  selected: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSelector = ({ selected, onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md glass border-glow text-sm font-mono hover:bg-muted/50 transition-colors"
      >
        <span className="text-neon-blue">{selected.name}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 w-64 max-h-80 glass rounded-lg border-glow shadow-2xl z-50 overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="bg-transparent text-sm text-foreground outline-none flex-1 placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-60 overflow-auto">
              {filtered.map((lang) => (
                <button
                  key={lang.id}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors ${
                    selected.id === lang.id ? "text-neon-blue" : "text-muted-foreground"
                  }`}
                  onClick={() => { onSelect(lang); setOpen(false); setSearch(""); }}
                >
                  {lang.name}
                  <span className="ml-2 text-xs text-muted-foreground">{lang.extension}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
