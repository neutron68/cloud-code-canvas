import { useState, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Code2, Save, Settings, PanelLeftClose, PanelLeft, X } from "lucide-react";
import FileSidebar from "@/components/workspace/FileSidebar";
import EnhancedTerminal from "@/components/workspace/EnhancedTerminal";
import LanguageSelector from "@/components/workspace/LanguageSelector";
import { languages, Language } from "@/data/languages";
import { judge0LanguageMap } from "@/data/judge0Languages";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFolderBrowser } from "@/hooks/useFolderBrowser";
import { FileNode } from "@/lib/folderBrowser";
import { useToast } from "@/hooks/use-toast";
import { executeCode, stopExecution, isCodeRunning, DebugInfo } from "@/lib/codeExecution";

interface OpenTab {
  filename: string;
  code: string;
  language: Language;
  fileHandle?: FileSystemFileHandle;
  path?: string;
}

const Workspace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [debugInfo, setDebugInfo] = useState<DebugInfo[]>([]);
  const [isDebugging, setIsDebugging] = useState(false);

  // Folder browser hook
  const { 
    folderHandle, 
    fileTree, 
    isLoading: isFolderLoading, 
    openFolder, 
    openFilesFromSystem,
    readFile, 
    saveFile, 
    refreshTree, 
    closeFolder 
  } = useFolderBrowser();

  // Multi-tab state
  const [tabs, setTabs] = useState<OpenTab[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const activeTab = tabs[activeTabIndex] || { 
    filename: "untitled", 
    code: "", 
    language: languages[0] 
  };

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    setTabs((prev) => {
      const updated = [...prev];
      updated[activeTabIndex] = {
        ...updated[activeTabIndex],
        code: lang.template,
        language: lang,
        filename: `main${lang.extension}`,
      };
      return updated;
    });
    setOutput("");
  }, [activeTabIndex]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    setTabs((prev) => {
      const updated = [...prev];
      updated[activeTabIndex] = { ...updated[activeTabIndex], code: value || "" };
      return updated;
    });
  }, [activeTabIndex]);

  const handleFileSelect = useCallback(async (node: FileNode) => {
    if (node.type !== 'file') return;

    const identifier = node.path || node.name;
    const existingIndex = tabs.findIndex((t) => (t.path || t.filename) === identifier);
    
    if (existingIndex >= 0) {
      setActiveTabIndex(existingIndex);
      return;
    }

    // Determine language from file extension
    const ext = node.name.split(".").pop() || "";
    const lang = languages.find((l) => l.extension === `.${ext}`) || languages[0];

    let fileContent = lang.template;
    let fileHandle: FileSystemFileHandle | undefined;

    // If it's from local folder, read the actual content
    if (node.handle && node.type === 'file') {
      const content = await readFile(node);
      if (content !== null) {
        fileContent = content;
        fileHandle = node.handle as FileSystemFileHandle;
      }
    }

    const newTab: OpenTab = { 
      filename: node.name, 
      code: fileContent, 
      language: lang,
      fileHandle,
      path: node.path
    };
    
    setTabs((prev) => [...prev, newTab]);
    setActiveTabIndex(tabs.length);
    setLanguage(lang);
  }, [tabs, readFile]);

  const handleCloseTab = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length <= 1) {
      // If closing the last tab, clear it but keep one empty tab
      setTabs([]);
      setActiveTabIndex(0);
      return;
    }
    setTabs((prev) => prev.filter((_, i) => i !== index));
    if (activeTabIndex >= index && activeTabIndex > 0) {
      setActiveTabIndex((prev) => prev - 1);
    }
  }, [tabs.length, activeTabIndex]);

  // Save current file to local system
  const handleSaveFile = useCallback(async () => {
    if (!activeTab.fileHandle) {
      toast({
        title: 'Cannot Save',
        description: 'This file is not linked to your local system. Open a folder first.',
        variant: 'destructive',
      });
      return;
    }

    const success = await saveFile(activeTab.fileHandle, activeTab.code);
    if (success) {
      toast({
        title: 'Saved',
        description: `${activeTab.filename} saved successfully`,
      });
    }
  }, [activeTab, saveFile, toast]);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setOutput("");
    setDebugInfo([]);
    
    try {
      // First try cloud execution if supported
      const langId = judge0LanguageMap[activeTab.language.id];
      let cloudExecutionAttempted = false;
      
      if (langId) {
        cloudExecutionAttempted = true;
        const timestamp = new Date().toLocaleTimeString();
        setOutput(`[${timestamp}] Submitting to cloud compiler (${activeTab.language.name})...\n`);
        
        try {
          const { data, error } = await supabase.functions.invoke("execute-code", {
            body: {
              source_code: activeTab.code,
              language_id: langId,
            },
          });

          if (error) throw error;

          const endTime = new Date().toLocaleTimeString();
          let result = `[${endTime}] ${data.status?.description || "Completed"}\n\n`;

          if (data.compile_output) result += `Compile Output:\n${data.compile_output}\n\n`;
          if (data.stdout) result += data.stdout;
          if (data.stderr) result += `\nStderr:\n${data.stderr}`;
          if (data.time) result += `\n\n[Execution time: ${data.time}s | Memory: ${data.memory} KB]`;

          setOutput(result);
          
          toast({
            title: 'Execution Complete',
            description: `Cloud execution completed in ${data.time || 0}s`,
          });
          
          return; // Success, exit early
        } catch (cloudError: any) {
          console.log('Cloud execution failed, falling back to simulation:', cloudError.message);
          const timestamp = new Date().toLocaleTimeString();
          setOutput(`[${timestamp}] ⚠ Cloud execution failed: ${cloudError.message}\n\nFalling back to local simulation...\n\n`);
        }
      }
      
      // Fallback to enhanced local execution
      const result = await executeCode(
        {
          language: activeTab.language.id,
          code: activeTab.code,
          debug: isDebugging,
          timeout: 30000
        },
        (streamOutput) => {
          if (cloudExecutionAttempted) {
            // Append to existing cloud failure message
            setOutput(prev => prev + streamOutput.split('\n--- Program Output ---\n')[1] || streamOutput);
          } else {
            setOutput(streamOutput);
          }
        },
        (debug) => {
          setDebugInfo(prev => [...prev, debug]);
        }
      );
      
      if (!cloudExecutionAttempted) {
        setOutput(result.output);
      }
      
      if (result.status === 'error') {
        toast({
          title: 'Execution Error',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Execution Complete',
          description: `Completed in ${result.executionTime}ms`,
        });
      }
    } catch (err: any) {
      const timestamp = new Date().toLocaleTimeString();
      setOutput(`[${timestamp}] ❌ Execution failed: ${err.message}`);
      toast({
        title: 'Error',
        description: 'Failed to execute code',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  }, [activeTab, isDebugging, toast]);

  const handleStop = useCallback(() => {
    stopExecution();
    setIsRunning(false);
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => prev + `\n[${timestamp}] Execution stopped by user.`);
    toast({
      title: 'Stopped',
      description: 'Code execution has been stopped',
    });
  }, [toast]);

  const handleDebug = useCallback(() => {
    setIsDebugging(!isDebugging);
    toast({
      title: isDebugging ? 'Debug Disabled' : 'Debug Enabled',
      description: isDebugging ? 'Debug mode turned off' : 'Debug mode turned on - variables will be tracked',
    });
  }, [isDebugging, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab.fileHandle) {
          handleSaveFile();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab.fileHandle, handleSaveFile]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="h-12 flex items-center justify-between px-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Code2 className="w-5 h-5 text-neon-blue" />
            <span className="text-sm font-bold tracking-tight">
              Omni<span className="gradient-text">Code</span>
            </span>
          </div>
          <div className="w-px h-6 bg-border" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors">
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector selected={language} onSelect={handleLanguageChange} />
          <button 
            onClick={handleSaveFile}
            disabled={!activeTab.fileHandle}
            className="p-2 text-muted-foreground hover:text-foreground rounded transition-colors disabled:opacity-50"
            title={activeTab.fileHandle ? 'Save file (Ctrl+S)' : 'Open a local folder to enable saving'}
          >
            <Save className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground rounded transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md gradient-primary text-primary-foreground text-sm font-medium glow-blue hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <Play className="w-4 h-4" />
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <FileSidebar 
            onFileSelect={handleFileSelect} 
            activeFile={activeTab.path || activeTab.filename}
            fileTree={fileTree}
            onOpenFolder={openFolder}
            onOpenFile={openFilesFromSystem}
            onRefresh={refreshTree}
            onCloseFolder={closeFolder}
            isLoading={isFolderLoading}
            folderName={folderHandle?.name}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center border-b border-border bg-card px-2 h-9 shrink-0 overflow-x-auto">
            {tabs.length > 0 ? (
              tabs.map((tab, index) => (
                <button
                  key={tab.filename + index}
                  onClick={() => setActiveTabIndex(index)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-t border border-b-0 border-border transition-colors shrink-0 group ${
                    index === activeTabIndex
                      ? "bg-muted/50 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  {tab.filename}
                  <span
                    onClick={(e) => handleCloseTab(index, e)}
                    className="ml-1 p-0.5 rounded hover:bg-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </span>
                </button>
              ))
            ) : (
              <div className="flex items-center px-3 py-1 text-xs text-muted-foreground">
                No files open - Open a folder or file to get started
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            {tabs.length > 0 ? (
              <Editor
                height="100%"
                language={activeTab.language.monacoLang}
                value={activeTab.code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: true },
                  padding: { top: 16 },
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  renderLineHighlight: "all",
                  bracketPairColorization: { enabled: true },
                  scrollBeyondLastLine: false,
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-muted/5">
                <div className="text-center text-muted-foreground">
                  <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to OmniCode</h3>
                  <p className="text-sm mb-4">Open a folder or file to start coding</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={openFolder}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Open Folder
                    </button>
                    <button
                      onClick={openFilesFromSystem}
                      className="px-4 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      Open Files
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Output */}
          <EnhancedTerminal 
            output={output} 
            isRunning={isRunning}
            onRun={handleRun}
            onStop={handleStop}
            onDebug={handleDebug}
            debugInfo={debugInfo}
            language={activeTab.language.name}
          />
        </div>
      </div>
    </div>
  );
};

function simulateOutput(langId: string, code: string): string {
  const timestamp = new Date().toLocaleTimeString();
  const helloMatch = code.match(/["']([^"']*Hello[^"']*)['"]/i);
  const outputText = helloMatch ? helloMatch[1] : "Hello, World!";

  return `[${timestamp}] Compiling with ${langId}...\n[${timestamp}] Build successful.\n\n${outputText}\n\n[Process exited with code 0] — Execution time: ${(Math.random() * 0.5 + 0.1).toFixed(3)}s`;
}

export default Workspace;
