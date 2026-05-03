import { useState, useCallback, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Code2, Save, Settings, PanelLeftClose, PanelLeft, X, Eye, EyeOff } from "lucide-react";
import FileSidebar from "@/components/workspace/FileSidebar";
import EnhancedTerminal from "@/components/workspace/EnhancedTerminal";
import HTMLPreview from "@/components/workspace/HTMLPreview";
import ErrorPanel from "@/components/workspace/ErrorPanel";
import LanguageSelector from "@/components/workspace/LanguageSelector";
import { languages, Language } from "@/data/languages";
import { judge0LanguageMap } from "@/data/judge0Languages";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFolderBrowser } from "@/hooks/useFolderBrowser";
import { FileNode } from "@/lib/folderBrowser";
import { useToast } from "@/hooks/use-toast";
import { executeCode, stopExecution, isCodeRunning, DebugInfo } from "@/lib/codeExecution";
import { stopJavaExecution } from "@/lib/javaExecutor";
import { analyzeCode, ErrorAnalysis } from "@/lib/errorDetection";
import type { editor } from 'monaco-editor';

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
  const [showPreview, setShowPreview] = useState(false);
  const [errorAnalysis, setErrorAnalysis] = useState<ErrorAnalysis | null>(null);
  const [showErrorPanel, setShowErrorPanel] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

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

    // Auto-show preview for HTML/CSS
    if (lang.id === 'html' || lang.id === 'css') {
      setShowPreview(true);
    }
  }, [activeTabIndex]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    setTabs((prev) => {
      const updated = [...prev];
      if (updated[activeTabIndex]) {
        updated[activeTabIndex] = { ...updated[activeTabIndex], code: value || "" };
      }
      return updated;
    });

    // Real-time error detection
    if (value && tabs[activeTabIndex]) {
      const currentTab = tabs[activeTabIndex];
      const analysis = analyzeCode(value, currentTab.language.id);
      setErrorAnalysis(analysis);

      // Update editor markers
      if (editorRef.current) {
        const monaco = (window as Window & { monaco?: typeof import("monaco-editor") }).monaco;
        if (monaco) {
          const model = editorRef.current.getModel();
          if (model) {
            const markers = [...analysis.errors, ...analysis.warnings].map(err => ({
              severity: err.severity === 'error' ? monaco.MarkerSeverity.Error :
                err.severity === 'warning' ? monaco.MarkerSeverity.Warning :
                  monaco.MarkerSeverity.Info,
              startLineNumber: err.line,
              startColumn: err.column,
              endLineNumber: err.line,
              endColumn: err.column + 10,
              message: `${err instanceof Error ? err.message : String(err)}\n\n💡 ${err.suggestion}`,
              code: err.code,
            }));
            monaco.editor.setModelMarkers(model, 'errorDetection', markers);
          }
        }
      }
    }
  }, [activeTabIndex, tabs]);

  const handleFileSelect = useCallback(async (node: FileNode) => {
    if (node.type !== 'file') return;

    const identifier = node.path || node.name;
    const existingIndex = tabs.findIndex((t) => (t.path || t.filename) === identifier);

    if (existingIndex >= 0) {
      setActiveTabIndex(existingIndex);
      const existingTab = tabs[existingIndex];
      // Auto-show preview for HTML/CSS files
      if (existingTab.language.id === 'html' || existingTab.language.id === 'css') {
        setShowPreview(true);
      }
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

    // Auto-show preview for HTML/CSS files
    if (lang.id === 'html' || lang.id === 'css') {
      setShowPreview(true);
    }
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

    if (!tabs[activeTabIndex]) return;

    const currentTab = tabs[activeTabIndex];

    // For HTML/CSS, just show the preview
    if (currentTab.language.id === 'html' || currentTab.language.id === 'css') {
      setShowPreview(true);
      toast({
        title: 'Preview Updated',
        description: 'HTML preview is now visible',
      });
      return;
    }

    // Check for errors before running
    const analysis = analyzeCode(currentTab.code, currentTab.language.id);
    setErrorAnalysis(analysis);

    if (!analysis.canRun) {
      setShowErrorPanel(true);
      toast({
        title: 'Cannot Run Code',
        description: `Found ${analysis.errors.length} error(s). Fix them before running.`,
        variant: 'destructive',
      });
      return;
    }

    setIsRunning(true);
    setOutput("");
    setDebugInfo([]);

    try {
      // First try cloud execution if supported (skip for C/C++ as we want inbuilt compiler)
      const langId = judge0LanguageMap[currentTab.language.id];
      const isInbuiltCCpp = currentTab.language.id === 'c' || currentTab.language.id === 'cpp';
      let cloudExecutionAttempted = false;

      if (langId && !isInbuiltCCpp) {
        cloudExecutionAttempted = true;
        const timestamp = new Date().toLocaleTimeString();
        setOutput(`[${timestamp}] Submitting to cloud compiler (${currentTab.language.name})...\n`);

        try {
          const { data, error } = await supabase.functions.invoke("execute-code", {
            body: {
              source_code: currentTab.code,
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
        } catch (cloudError: unknown) {
          console.log('Cloud execution failed, falling back to simulation:', cloudError instanceof Error ? cloudError.message : String(cloudError));
          const timestamp = new Date().toLocaleTimeString();
          setOutput(`[${timestamp}] ⚠ Cloud execution failed: ${cloudError instanceof Error ? cloudError.message : String(cloudError)}\n\nFalling back to local simulation...\n\n`);
        }
      }

      // Fallback to enhanced local execution
      const result = await executeCode(
        {
          language: currentTab.language.id,
          code: currentTab.code,
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
    } catch (err: unknown) {
      const timestamp = new Date().toLocaleTimeString();
      setOutput(`[${timestamp}] ❌ Execution failed: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: 'Error',
        description: 'Failed to execute code',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  }, [tabs, activeTabIndex, isDebugging, toast]);

  const handleStop = useCallback(() => {
    stopExecution();
    stopJavaExecution(); // Also stop Java execution if running
    setIsRunning(false);
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => prev + `\n[${timestamp}] Execution stopped by user.`);
    toast({
      title: 'Stopped',
      description: 'Code execution has been stopped',
    });
  }, [toast]);

  const handleDebug = useCallback(() => {
    if (!tabs[activeTabIndex]) return;

    const currentTab = tabs[activeTabIndex];
    // Analyze code for errors
    const analysis = analyzeCode(currentTab.code, currentTab.language.id);
    setErrorAnalysis(analysis);
    setShowErrorPanel(true);

    if (analysis.hasErrors) {
      toast({
        title: 'Errors Detected',
        description: `Found ${analysis.errors.length} error(s). Check the debug panel for details.`,
        variant: 'destructive',
      });
    } else if (analysis.hasWarnings) {
      toast({
        title: 'Warnings Found',
        description: `Found ${analysis.warnings.length} warning(s). Code can run but may have issues.`,
      });
    } else {
      toast({
        title: 'No Issues Found',
        description: 'Your code looks great! Ready to run.',
      });
    }
  }, [tabs, activeTabIndex, toast]);

  const handleJumpToLine = useCallback((line: number) => {
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(line);
      editorRef.current.setPosition({ lineNumber: line, column: 1 });
      editorRef.current.focus();
      setShowErrorPanel(false);
    }
  }, []);

  const handleApplyFix = useCallback((line: number, fix: string) => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const lineContent = model.getLineContent(line);
        const range = {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: lineContent.length + 1,
        };
        editorRef.current.executeEdits('quickfix', [{
          range,
          text: fix,
        }]);
        toast({
          title: 'Fix Applied',
          description: `Line ${line} has been updated`,
        });
      }
    }
  }, [toast]);

  const handleEditorMount = useCallback((editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Initial error check
    if (tabs[activeTabIndex]?.code) {
      const currentTab = tabs[activeTabIndex];
      const analysis = analyzeCode(currentTab.code, currentTab.language.id);
      setErrorAnalysis(analysis);
    }
  }, [tabs, activeTabIndex]);

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
          {(activeTab.language.id === 'html' || activeTab.language.id === 'css') && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors"
              title={showPreview ? "Hide preview" : "Show preview"}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide" : "Preview"}
            </button>
          )}
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
            {isRunning ? "Running..." : (activeTab.language.id === 'html' || activeTab.language.id === 'css') ? "Preview" : "Run"}
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
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-t border border-b-0 border-border transition-colors shrink-0 group ${index === activeTabIndex
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

          {/* Editor and Preview Container */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className={`${showPreview && (activeTab.language.id === 'html' || activeTab.language.id === 'css') ? 'w-1/2' : 'flex-1'} overflow-hidden`}>
              {tabs.length > 0 ? (
                <Editor
                  height="100%"
                  language={activeTab.language.monacoLang}
                  value={activeTab.code}
                  onChange={handleCodeChange}
                  onMount={handleEditorMount}
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

            {/* HTML Preview */}
            {tabs.length > 0 && (
              <HTMLPreview
                htmlCode={activeTab.language.id === 'html' ? activeTab.code : ''}
                cssCode={activeTab.language.id === 'css' ? activeTab.code : ''}
                isVisible={showPreview && (activeTab.language.id === 'html' || activeTab.language.id === 'css')}
              />
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

      {/* Error Panel */}
      {showErrorPanel && errorAnalysis && (
        <ErrorPanel
          errors={errorAnalysis.errors}
          warnings={errorAnalysis.warnings}
          summary={errorAnalysis.summary}
          canRun={errorAnalysis.canRun}
          onClose={() => setShowErrorPanel(false)}
          onJumpToLine={handleJumpToLine}
          onApplyFix={handleApplyFix}
        />
      )}
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
