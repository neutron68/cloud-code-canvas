import { useState, useCallback } from 'react';
import {
  FileNode,
  requestFolderAccess,
  requestFileAccess,
  buildFileTree,
  buildFileList,
  readFileContent,
  writeFileContent,
  saveFolderHandle,
  isFileSystemAccessSupported,
} from '@/lib/folderBrowser';
import { useToast } from '@/hooks/use-toast';

export const useFolderBrowser = () => {
  const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Open folder picker and load file tree
  const openFolder = useCallback(async () => {
    if (!isFileSystemAccessSupported()) {
      toast({
        title: 'Not Supported',
        description: 'Your browser does not support local folder access. Please use Chrome, Edge, or another Chromium-based browser.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const handle = await requestFolderAccess();
      if (handle) {
        setFolderHandle(handle);
        const tree = await buildFileTree(handle);
        setFileTree(tree);
        await saveFolderHandle(handle);
        
        toast({
          title: 'Folder Opened',
          description: `Successfully opened "${handle.name}"`,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to open folder',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Open individual files
  const openFilesFromSystem = useCallback(async () => {
    if (!isFileSystemAccessSupported()) {
      toast({
        title: 'Not Supported',
        description: 'Your browser does not support local file access. Please use Chrome, Edge, or another Chromium-based browser.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const fileHandles = await requestFileAccess();
      if (fileHandles && fileHandles.length > 0) {
        const fileNodes = buildFileList(fileHandles);
        setOpenFiles(prev => [...prev, ...fileNodes]);
        setFileTree(prev => [...prev, ...fileNodes]);
        
        toast({
          title: 'Files Opened',
          description: `Successfully opened ${fileHandles.length} file(s)`,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to open files',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  const readFile = useCallback(async (node: FileNode): Promise<string | null> => {
    if (!node.handle || node.type !== 'file') return null;
    
    try {
      const content = await readFileContent(node.handle as FileSystemFileHandle);
      return content;
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to read file: ${node.name}`,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  // Save file content
  const saveFile = useCallback(async (
    fileHandle: FileSystemFileHandle,
    content: string
  ): Promise<boolean> => {
    try {
      await writeFileContent(fileHandle, content);
      toast({
        title: 'Saved',
        description: 'File saved successfully',
      });
      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save file',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Refresh file tree
  const refreshTree = useCallback(async () => {
    if (!folderHandle) return;
    
    setIsLoading(true);
    try {
      const tree = await buildFileTree(folderHandle);
      setFileTree(tree);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to refresh folder',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [folderHandle, toast]);

  // Close folder
  const closeFolder = useCallback(() => {
    setFolderHandle(null);
    setFileTree([]);
    setOpenFiles([]);
  }, []);

  return {
    folderHandle,
    fileTree,
    openFiles,
    isLoading,
    openFolder,
    openFilesFromSystem,
    readFile,
    saveFile,
    refreshTree,
    closeFolder,
    isSupported: isFileSystemAccessSupported(),
  };
};
