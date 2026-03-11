import { useState } from "react";
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Plus, MoreHorizontal, FolderSearch, RefreshCw, X, File } from "lucide-react";
import { FileNode } from "@/lib/folderBrowser";
import { Button } from "@/components/ui/button";

interface Props {
  onFileSelect: (node: FileNode) => void;
  activeFile: string;
  fileTree?: FileNode[];
  onOpenFolder?: () => void;
  onOpenFile?: () => void;
  onRefresh?: () => void;
  onCloseFolder?: () => void;
  isLoading?: boolean;
  folderName?: string;
}

const defaultTree: FileNode[] = [];

const FileTreeItem = ({ node, depth, onSelect, activeFile }: { node: FileNode; depth: number; onSelect: (node: FileNode) => void; activeFile: string }) => {
  const [open, setOpen] = useState(true);
  const isActive = node.type === "file" && (node.path === activeFile || node.name === activeFile);

  if (node.type === "folder") {
    return (
      <div>
        <button
          className="flex items-center gap-1 w-full px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          {open ? <FolderOpen className="w-4 h-4 text-neon-blue" /> : <Folder className="w-4 h-4 text-neon-blue" />}
          <span className="ml-1">{node.name}</span>
        </button>
        {open && node.children?.map((child) => (
          <FileTreeItem key={child.name} node={child} depth={depth + 1} onSelect={onSelect} activeFile={activeFile} />
        ))}
      </div>
    );
  }

  return (
    <button
      className={`flex items-center gap-1 w-full px-2 py-1 text-sm rounded transition-colors ${
        isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
      onClick={() => onSelect(node)}
    >
      <FileText className="w-4 h-4" />
      <span className="ml-1 truncate">{node.name}</span>
    </button>
  );
};

const FileSidebar = ({ 
  onFileSelect, 
  activeFile, 
  fileTree, 
  onOpenFolder, 
  onOpenFile,
  onRefresh, 
  onCloseFolder,
  isLoading,
  folderName 
}: Props) => {
  const treeToDisplay = fileTree && fileTree.length > 0 ? fileTree : defaultTree;
  const hasLocalFolder = fileTree && fileTree.length > 0;

  return (
    <div className="w-60 border-r border-border bg-card flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
          {hasLocalFolder && folderName ? folderName : 'Explorer'}
        </span>
        <div className="flex gap-1">
          {hasLocalFolder ? (
            <>
              <button 
                className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors disabled:opacity-50"
                onClick={onRefresh}
                disabled={isLoading}
                title="Refresh folder"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                onClick={onOpenFile}
                title="Open file"
              >
                <File className="w-4 h-4" />
              </button>
              <button 
                className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                onClick={onCloseFolder}
                title="Close folder"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button 
                className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                onClick={onOpenFolder}
                title="Open local folder"
              >
                <FolderSearch className="w-4 h-4" />
              </button>
              <button 
                className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                onClick={onOpenFile}
                title="Open file"
              >
                <File className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {!hasLocalFolder && (
        <div className="px-3 py-4 text-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenFolder}
            className="w-full mb-2"
          >
            <FolderSearch className="w-4 h-4 mr-2" />
            Open Folder
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenFile}
            className="w-full"
          >
            <File className="w-4 h-4 mr-2" />
            Open File
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Browse folders or open individual files from your local system
          </p>
        </div>
      )}
      
      <div className="flex-1 overflow-auto py-1">
        {treeToDisplay.map((node) => (
          <FileTreeItem key={node.path || node.name} node={node} depth={0} onSelect={onFileSelect} activeFile={activeFile} />
        ))}
        {treeToDisplay.length === 0 && !hasLocalFolder && (
          <div className="px-3 py-8 text-center text-muted-foreground text-sm">
            No files open. Open a folder or file to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default FileSidebar;
