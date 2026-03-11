import { useState, useRef, useEffect, useCallback } from "react";
import { Terminal as TermIcon, X, ChevronUp, ChevronDown, Play, Square, RotateCcw, Bug, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DebugInfo {
  line: number;
  variable: string;
  value: any;
  timestamp: string;
}

interface Props {
  output: string;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onDebug: () => void;
  debugInfo?: DebugInfo[];
  language: string;
}

const EnhancedTerminal = ({ 
  output, 
  isRunning, 
  onRun, 
  onStop, 
  onDebug, 
  debugInfo = [],
  language 
}: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("output");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output, terminalHistory]);

  const handleCommandSubmit = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      const newEntry = `[${timestamp}] $ ${currentCommand}`;
      
      // Simulate command execution
      let response = '';
      if (currentCommand.startsWith('debug ')) {
        response = `[${timestamp}] Debug mode enabled for ${language}`;
        onDebug();
      } else if (currentCommand === 'run') {
        response = `[${timestamp}] Executing ${language} code...`;
        onRun();
      } else if (currentCommand === 'stop') {
        response = `[${timestamp}] Stopping execution...`;
        onStop();
      } else if (currentCommand === 'clear') {
        setTerminalHistory([]);
        setCurrentCommand('');
        return;
      } else {
        response = `[${timestamp}] Command not recognized: ${currentCommand}`;
      }
      
      setTerminalHistory(prev => [...prev, newEntry, response]);
      setCurrentCommand('');
    }
  }, [currentCommand, language, onRun, onStop, onDebug]);

  const formatDebugInfo = (info: DebugInfo) => {
    return `Line ${info.line}: ${info.variable} = ${JSON.stringify(info.value)}`;
  };

  const getLanguageCommands = () => {
    const commands = {
      python: ['python main.py', 'pip install', 'python -m pdb'],
      javascript: ['node main.js', 'npm run', 'node --inspect'],
      typescript: ['ts-node main.ts', 'tsc', 'ts-node --inspect'],
      java: ['javac Main.java', 'java Main', 'jdb Main'],
      cpp: ['g++ main.cpp -o main', './main', 'gdb main'],
      c: ['gcc main.c -o main', './main', 'gdb main'],
    };
    return commands[language as keyof typeof commands] || ['run', 'debug', 'stop'];
  };

  return (
    <div className={`border-t border-border bg-card flex flex-col transition-all ${collapsed ? "h-10" : "h-80"}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <TermIcon className="w-4 h-4 text-neon-blue" />
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Terminal</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-xs text-neon-green">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
              Running...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onRun}
            disabled={isRunning}
            className="h-6 px-2 text-xs"
          >
            <Play className="w-3 h-3 mr-1" />
            Run
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onStop}
            disabled={!isRunning}
            className="h-6 px-2 text-xs"
          >
            <Square className="w-3 h-3 mr-1" />
            Stop
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDebug}
            className="h-6 px-2 text-xs"
          >
            <Bug className="w-3 h-3 mr-1" />
            Debug
          </Button>
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
          >
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {!collapsed && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
            <TabsTrigger value="terminal" className="text-xs">Terminal</TabsTrigger>
            <TabsTrigger value="debug" className="text-xs">Debug</TabsTrigger>
          </TabsList>
          
          <TabsContent value="output" className="flex-1 overflow-auto p-3 font-mono text-sm m-0">
            <div ref={scrollRef} className="h-full">
              {output ? (
                <pre className="text-foreground whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="text-muted-foreground italic">
                  <p>Click "Run" to execute your code...</p>
                  <div className="mt-4 text-xs">
                    <p className="font-semibold mb-2">Quick Commands for {language}:</p>
                    {getLanguageCommands().map((cmd, i) => (
                      <p key={i} className="ml-2">• {cmd}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="terminal" className="flex-1 flex flex-col m-0">
            <div className="flex-1 overflow-auto p-3 font-mono text-sm">
              {terminalHistory.map((entry, i) => (
                <div key={i} className="text-foreground whitespace-pre-wrap mb-1">
                  {entry}
                </div>
              ))}
              {terminalHistory.length === 0 && (
                <div className="text-muted-foreground italic">
                  <p>Interactive terminal - Type commands and press Enter</p>
                  <p className="text-xs mt-2">Available commands: run, debug, stop, clear</p>
                </div>
              )}
            </div>
            <div className="border-t border-border p-2 flex items-center gap-2">
              <span className="text-neon-green font-mono text-sm">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleCommandSubmit}
                placeholder="Type a command..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-foreground placeholder-muted-foreground"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="debug" className="flex-1 overflow-auto p-3 font-mono text-sm m-0">
            {debugInfo.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neon-blue mb-3">
                  <Bug className="w-4 h-4" />
                  <span className="font-semibold">Debug Information</span>
                </div>
                {debugInfo.map((info, i) => (
                  <div key={i} className="bg-muted/20 rounded p-2 border-l-2 border-neon-blue">
                    <div className="text-xs text-muted-foreground">{info.timestamp}</div>
                    <div className="text-foreground">{formatDebugInfo(info)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic">
                <div className="flex items-center gap-2 mb-3">
                  <Bug className="w-4 h-4" />
                  <span>Debug Mode</span>
                </div>
                <p>No debug information available.</p>
                <p className="text-xs mt-2">Click "Debug" or type "debug" in terminal to enable debugging.</p>
                <div className="mt-4 p-3 bg-muted/10 rounded border">
                  <p className="font-semibold text-xs mb-2">Debug Features:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Variable inspection</li>
                    <li>• Step-by-step execution</li>
                    <li>• Breakpoint management</li>
                    <li>• Call stack analysis</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EnhancedTerminal;