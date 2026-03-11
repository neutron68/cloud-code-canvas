import { useState, useRef, useEffect } from "react";
import { Terminal as TermIcon, X, ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  output: string;
  isRunning: boolean;
}

const OutputConsole = ({ output, isRunning }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className={`border-t border-border bg-card flex flex-col transition-all ${collapsed ? "h-10" : "h-56"}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <TermIcon className="w-4 h-4 text-neon-blue" />
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Output</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-xs text-neon-green">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
              Running...
            </span>
          )}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors">
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {!collapsed && (
        <div ref={scrollRef} className="flex-1 overflow-auto p-3 font-mono text-sm">
          {output ? (
            <pre className="text-foreground whitespace-pre-wrap">{output}</pre>
          ) : (
            <p className="text-muted-foreground italic">Click "Run" to execute your code...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OutputConsole;
