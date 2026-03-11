# Architecture Diagram: Local Folder Browser

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                      (React Components)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Workspace.tsx (Main)                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  • Tab Management                                         │ │
│  │  • Editor State                                           │ │
│  │  • File Operations                                        │ │
│  │  • Keyboard Shortcuts                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           │                                    │
           ▼                                    ▼
┌──────────────────────────┐      ┌──────────────────────────────┐
│   FileSidebar.tsx        │      │   useFolderBrowser Hook      │
│  ┌────────────────────┐  │      │  ┌────────────────────────┐  │
│  │ • Tree Display     │  │      │  │ • State Management     │  │
│  │ • Folder Controls  │  │      │  │ • File Operations      │  │
│  │ • File Selection   │  │      │  │ • Error Handling       │  │
│  │ • UI Feedback      │  │      │  │ • Notifications        │  │
│  └────────────────────┘  │      │  └────────────────────────┘  │
└──────────────────────────┘      └──────────────────────────────┘
                                              │
                                              ▼
                              ┌──────────────────────────────────┐
                              │   folderBrowser.ts (Utils)       │
                              │  ┌────────────────────────────┐  │
                              │  │ • API Wrappers             │  │
                              │  │ • Tree Building            │  │
                              │  │ • File I/O                 │  │
                              │  │ • Language Detection       │  │
                              │  └────────────────────────────┘  │
                              └──────────────────────────────────┘
                                              │
                                              ▼
                              ┌──────────────────────────────────┐
                              │   File System Access API         │
                              │  ┌────────────────────────────┐  │
                              │  │ • showDirectoryPicker()    │  │
                              │  │ • FileSystemHandle         │  │
                              │  │ • Read/Write Operations    │  │
                              │  │ • Permission Management    │  │
                              │  └────────────────────────────┘  │
                              └──────────────────────────────────┘
                                              │
                                              ▼
                              ┌──────────────────────────────────┐
                              │      Local File System           │
                              └──────────────────────────────────┘
```

## Component Interaction Flow

### Opening a Folder

```
User Click "Open Folder"
         │
         ▼
FileSidebar.onOpenFolder()
         │
         ▼
useFolderBrowser.openFolder()
         │
         ▼
folderBrowser.requestFolderAccess()
         │
         ▼
window.showDirectoryPicker()
         │
         ▼
User Grants Permission
         │
         ▼
folderBrowser.buildFileTree()
         │
         ▼
Recursive Directory Traversal
         │
         ▼
FileNode Tree Created
         │
         ▼
State Updated (fileTree)
         │
         ▼
FileSidebar Re-renders
         │
         ▼
Tree Displayed to User
```

### Opening a File

```
User Clicks File in Tree
         │
         ▼
FileSidebar.onFileSelect(node)
         │
         ▼
Workspace.handleFileSelect(node)
         │
         ▼
Check if Already Open
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    │         ▼
    │    useFolderBrowser.readFile(node)
    │         │
    │         ▼
    │    folderBrowser.readFileContent()
    │         │
    │         ▼
    │    FileSystemFileHandle.getFile()
    │         │
    │         ▼
    │    File.text()
    │         │
    │         ▼
    │    Create New Tab
    │         │
    └────┬────┘
         │
         ▼
Switch to Tab
         │
         ▼
Editor Displays Content
```

### Saving a File

```
User Presses Ctrl+S
         │
         ▼
Workspace.handleSaveFile()
         │
         ▼
Check fileHandle Exists
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    │         ▼
    │    Show Error Toast
    │         │
    ▼         │
useFolderBrowser.saveFile()
    │         │
    ▼         │
folderBrowser.writeFileContent()
    │         │
    ▼         │
FileSystemFileHandle.createWritable()
    │         │
    ▼         │
WritableStream.write()
    │         │
    ▼         │
WritableStream.close()
    │         │
    ▼         │
Show Success Toast
    │         │
    └────┬────┘
         │
         ▼
File Saved to Disk
```

## Data Structures

### FileNode (Tree Structure)

```
FileNode
├── name: string              // "src"
├── type: "folder"            // or "file"
├── path: string              // "src"
├── handle: FileSystemHandle  // API handle
└── children: FileNode[]      // Nested items
    ├── FileNode
    │   ├── name: "main.py"
    │   ├── type: "file"
    │   ├── path: "src/main.py"
    │   ├── language: "python"
    │   └── handle: FileSystemFileHandle
    └── FileNode
        ├── name: "utils.py"
        └── ...
```

### OpenTab (Editor State)

```
OpenTab
├── filename: string          // "main.py"
├── code: string              // File content
├── language: Language        // Language config
├── fileHandle?: FileSystemFileHandle  // For saving
└── path?: string             // "src/main.py"
```

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                  Workspace Component                    │
│                                                         │
│  State:                                                 │
│  ├── tabs: OpenTab[]                                    │
│  ├── activeTabIndex: number                            │
│  ├── language: Language                                 │
│  ├── output: string                                     │
│  ├── isRunning: boolean                                 │
│  └── sidebarOpen: boolean                               │
│                                                         │
│  From useFolderBrowser:                                 │
│  ├── folderHandle: FileSystemDirectoryHandle | null    │
│  ├── fileTree: FileNode[]                               │
│  └── isLoading: boolean                                 │
└─────────────────────────────────────────────────────────┘
```

## API Layer

```
┌──────────────────────────────────────────────────────────┐
│              folderBrowser.ts (API Layer)                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Browser Detection:                                      │
│  └── isFileSystemAccessSupported()                       │
│                                                          │
│  Folder Operations:                                      │
│  ├── requestFolderAccess()                               │
│  ├── buildFileTree()                                     │
│  └── saveFolderHandle()                                  │
│                                                          │
│  File Operations:                                        │
│  ├── readFileContent()                                   │
│  ├── writeFileContent()                                  │
│  ├── createNewFile()                                     │
│  └── createNewFolder()                                   │
│                                                          │
│  Utilities:                                              │
│  └── getLanguageFromExtension()                          │
└──────────────────────────────────────────────────────────┘
```

## Hook Architecture

```
┌──────────────────────────────────────────────────────────┐
│         useFolderBrowser Hook (State + Logic)            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Internal State:                                         │
│  ├── folderHandle: FileSystemDirectoryHandle | null     │
│  ├── fileTree: FileNode[]                                │
│  └── isLoading: boolean                                  │
│                                                          │
│  Public Methods:                                         │
│  ├── openFolder()      → Opens folder picker            │
│  ├── readFile()        → Reads file content             │
│  ├── saveFile()        → Saves file content             │
│  ├── refreshTree()     → Reloads folder structure       │
│  └── closeFolder()     → Closes current folder          │
│                                                          │
│  Dependencies:                                           │
│  ├── folderBrowser.ts  → Core utilities                 │
│  └── useToast()        → User notifications             │
└──────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
Operation Attempted
         │
         ▼
Try Block Executes
         │
    ┌────┴────┐
    │         │
 Success    Error
    │         │
    │         ▼
    │    Catch Block
    │         │
    │         ▼
    │    Log Error
    │         │
    │         ▼
    │    Show Toast Notification
    │         │
    │         ▼
    │    Return Null/False
    │         │
    └────┬────┘
         │
         ▼
Component Handles Result
         │
         ▼
UI Updates
```

## Permission Flow

```
First Access to Folder
         │
         ▼
Browser Checks Permissions
         │
    ┌────┴────┐
    │         │
 Granted   Not Granted
    │         │
    │         ▼
    │    Show Permission Dialog
    │         │
    │    ┌────┴────┐
    │    │         │
    │  Allow     Deny
    │    │         │
    │    │         ▼
    │    │    Operation Fails
    │    │         │
    │    │         ▼
    │    │    Show Error
    │    │         │
    └────┴────┬────┘
              │
              ▼
    Permission Granted
              │
              ▼
    Store in Browser
              │
              ▼
    Future Access Automatic
```

## Type Safety Layer

```
┌──────────────────────────────────────────────────────────┐
│         file-system-access.d.ts (Type Definitions)       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Core Interfaces:                                        │
│  ├── FileSystemHandle                                    │
│  ├── FileSystemFileHandle                                │
│  ├── FileSystemDirectoryHandle                           │
│  └── FileSystemWritableFileStream                        │
│                                                          │
│  Window Extensions:                                      │
│  ├── showDirectoryPicker()                               │
│  ├── showOpenFilePicker()                                │
│  └── showSaveFilePicker()                                │
│                                                          │
│  Options Interfaces:                                     │
│  ├── DirectoryPickerOptions                              │
│  ├── FileSystemGetFileOptions                            │
│  └── FileSystemCreateWritableOptions                     │
└──────────────────────────────────────────────────────────┘
```

## Integration Points

```
┌─────────────────────────────────────────────────────────┐
│                   Existing System                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Monaco Editor  ←──────┐                                │
│  Language System ←─────┤                                │
│  Tab Management ←──────┼─── Folder Browser Feature     │
│  Toast System   ←──────┤                                │
│  UI Components  ←──────┘                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Type safety throughout
- ✅ Reusable components
- ✅ Scalable design
- ✅ Easy to maintain
- ✅ Well-documented
