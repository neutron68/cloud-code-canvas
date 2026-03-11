# Local Folder Browser Feature

## Overview
The IDE now supports browsing and editing files directly from your local file system using the modern File System Access API.

## Features

### 1. Open Local Folders
- Click the folder icon in the Explorer sidebar
- Or click "Open Folder" button in the sidebar
- Select any folder from your local system
- The folder structure will be displayed in the file tree

### 2. File Tree Navigation
- Browse through folders and files
- Expand/collapse folders
- Click on any file to open it in the editor
- Files open in new tabs automatically

### 3. Edit and Save Files
- Edit files directly in the Monaco editor
- Save changes back to your local system
- Use keyboard shortcut: `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac)
- Save button is enabled only for files from local folders

### 4. Multi-Tab Support
- Open multiple files simultaneously
- Each file maintains its own state
- Switch between tabs easily
- Close tabs individually (minimum 1 tab required)

### 5. Folder Management
- **Refresh**: Reload the folder structure to see new files
- **Close Folder**: Return to default demo files
- Folder name displayed in sidebar header

## Browser Compatibility

This feature uses the **File System Access API**, which is supported in:
- ✅ Chrome 86+
- ✅ Edge 86+
- ✅ Opera 72+
- ❌ Firefox (not yet supported)
- ❌ Safari (not yet supported)

If your browser doesn't support this API, you'll see a notification when trying to open a folder.

## Privacy & Security

- **Permissions**: You must grant permission for each folder you open
- **Local Only**: All file operations happen locally in your browser
- **No Upload**: Files are not uploaded to any server
- **Sandboxed**: The browser ensures secure file access

## File Filtering

The following files/folders are automatically hidden:
- Hidden files (starting with `.`)
- `node_modules/`
- `dist/`
- `build/`

## Supported Languages

The IDE automatically detects file types and applies syntax highlighting for 30+ languages including:
- Python, JavaScript, TypeScript
- C, C++, C#, Java
- Go, Rust, Ruby, PHP
- HTML, CSS, JSON, Markdown
- And many more...

## Usage Tips

1. **First Time**: When opening a folder, your browser will ask for permission - click "Allow"
2. **Persistence**: Folder permissions are remembered by your browser
3. **Large Projects**: The file tree loads recursively, so very large projects may take a moment
4. **Unsaved Changes**: Remember to save your changes with `Ctrl+S` before closing tabs
5. **Cloud Execution**: You can still run code in the cloud compiler even with local files

## Technical Details

### New Files Created
- `src/lib/folderBrowser.ts` - Core file system utilities
- `src/hooks/useFolderBrowser.ts` - React hook for folder operations
- `src/types/file-system-access.d.ts` - TypeScript declarations

### Modified Files
- `src/components/workspace/FileSidebar.tsx` - Enhanced with folder browser UI
- `src/pages/Workspace.tsx` - Integrated folder browsing functionality

### Key APIs Used
- `window.showDirectoryPicker()` - Open folder picker dialog
- `FileSystemDirectoryHandle` - Access directory contents
- `FileSystemFileHandle` - Read and write file contents
- `FileSystemWritableFileStream` - Save file changes

## Future Enhancements

Potential improvements for future versions:
- Create new files/folders directly in the IDE
- Delete files/folders
- Rename files/folders
- Search within folder contents
- Git integration for local repositories
- File upload/download
- Workspace persistence across sessions
