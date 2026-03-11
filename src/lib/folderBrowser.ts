// File System Access API utilities for local folder browsing

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  language?: string;
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
  path?: string;
}

// Check if File System Access API is supported
export const isFileSystemAccessSupported = (): boolean => {
  return 'showDirectoryPicker' in window;
};

// Request file access from user
export const requestFileAccess = async (): Promise<FileSystemFileHandle[] | null> => {
  try {
    const fileHandles = await window.showOpenFilePicker({
      multiple: true,
      types: [
        {
          description: 'All files',
          accept: {
            '*/*': []
          }
        }
      ]
    });
    return fileHandles;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      console.log('User cancelled file selection');
    } else {
      console.error('Error accessing files:', err);
    }
    return null;
  }
};

// Request folder access from user
export const requestFolderAccess = async (): Promise<FileSystemDirectoryHandle | null> => {
  try {
    const dirHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
    });
    return dirHandle;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      console.log('User cancelled folder selection');
    } else {
      console.error('Error accessing folder:', err);
    }
    return null;
  }
};

// Read file content from handle
export const readFileContent = async (fileHandle: FileSystemFileHandle): Promise<string> => {
  const file = await fileHandle.getFile();
  return await file.text();
};

// Write content to file
export const writeFileContent = async (
  fileHandle: FileSystemFileHandle,
  content: string
): Promise<void> => {
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
};

// Get language from file extension
const getLanguageFromExtension = (filename: string): string | undefined => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    py: 'python',
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'css',
    sass: 'css',
    less: 'css',
    c: 'c',
    cpp: 'cpp',
    cxx: 'cpp',
    cc: 'cpp',
    cs: 'csharp',
    java: 'java',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    dart: 'dart',
    lua: 'lua',
    r: 'r',
    pl: 'perl',
    hs: 'haskell',
    ex: 'elixir',
    exs: 'elixir',
    clj: 'clojure',
    erl: 'erlang',
    jl: 'julia',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    sql: 'sql',
    asm: 'asm',
    s: 'asm',
    f90: 'fortran',
    f95: 'fortran',
    pas: 'pascal',
    cob: 'cobol',
    zig: 'zig',
    nim: 'nim',
    ml: 'ocaml',
    fs: 'fsharp',
    lisp: 'lisp',
    sol: 'solidity',
    json: 'json',
    xml: 'xml',
    yml: 'yaml',
    yaml: 'yaml',
    md: 'markdown',
    markdown: 'markdown',
    ps1: 'powershell',
    vb: 'vbnet',
    m: 'matlab',
  };
  return langMap[ext || ''];
};

// Convert FileSystemDirectoryHandle to FileNode tree
export const buildFileTree = async (
  dirHandle: FileSystemDirectoryHandle,
  path: string = ''
): Promise<FileNode[]> => {
  const nodes: FileNode[] = [];
  
  try {
    for await (const entry of dirHandle.values()) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      
      // Skip hidden files and common ignore patterns
      if (entry.name.startsWith('.') || 
          entry.name === 'node_modules' || 
          entry.name === 'dist' ||
          entry.name === 'build') {
        continue;
      }

      if (entry.kind === 'directory') {
        const children = await buildFileTree(entry as FileSystemDirectoryHandle, entryPath);
        nodes.push({
          name: entry.name,
          type: 'folder',
          children,
          handle: entry as FileSystemDirectoryHandle,
          path: entryPath,
        });
      } else if (entry.kind === 'file') {
        nodes.push({
          name: entry.name,
          type: 'file',
          language: getLanguageFromExtension(entry.name),
          handle: entry as FileSystemFileHandle,
          path: entryPath,
        });
      }
    }
  } catch (err) {
    console.error('Error building file tree:', err);
  }

  // Sort: folders first, then files, alphabetically
  return nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
};

// Convert file handles to FileNode array
export const buildFileList = (fileHandles: FileSystemFileHandle[]): FileNode[] => {
  return fileHandles.map(handle => ({
    name: handle.name,
    type: 'file' as const,
    language: getLanguageFromExtension(handle.name),
    handle,
    path: handle.name,
  }));
};

// Save folder handle to localStorage for persistence
export const saveFolderHandle = async (
  handle: FileSystemDirectoryHandle
): Promise<void> => {
  try {
    // Store handle reference (requires permission persistence)
    const folderName = handle.name;
    localStorage.setItem('lastOpenedFolder', folderName);
  } catch (err) {
    console.error('Error saving folder handle:', err);
  }
};

// Create new file in directory
export const createNewFile = async (
  dirHandle: FileSystemDirectoryHandle,
  filename: string,
  content: string = ''
): Promise<FileSystemFileHandle | null> => {
  try {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    await writeFileContent(fileHandle, content);
    return fileHandle;
  } catch (err) {
    console.error('Error creating file:', err);
    return null;
  }
};

// Create new folder
export const createNewFolder = async (
  dirHandle: FileSystemDirectoryHandle,
  folderName: string
): Promise<FileSystemDirectoryHandle | null> => {
  try {
    return await dirHandle.getDirectoryHandle(folderName, { create: true });
  } catch (err) {
    console.error('Error creating folder:', err);
    return null;
  }
};