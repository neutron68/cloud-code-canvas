# Quick Start Guide: Local Folder Browser

## Step-by-Step Instructions

### Opening a Local Folder

1. **Navigate to the Workspace**
   - Go to `/workspace` in your browser
   - You'll see the IDE interface with the Explorer sidebar on the left

2. **Open Folder Dialog**
   - Look for the folder icon (🔍) in the Explorer header
   - Or click the "Open Folder" button in the sidebar
   - This will trigger your browser's folder picker

3. **Select Your Folder**
   - Browse to the folder you want to work with
   - Click "Select Folder" or "Open"
   - Your browser will ask for permission - click "Allow"

4. **Browse Your Files**
   - The folder structure will appear in the Explorer
   - Folders show with a folder icon
   - Files show with a document icon
   - Click any file to open it

### Editing Files

1. **Open a File**
   - Click on any file in the Explorer
   - The file opens in a new tab
   - Content is loaded from your local system

2. **Make Changes**
   - Edit the file in the Monaco editor
   - Syntax highlighting is automatic based on file extension
   - All standard editor features are available

3. **Save Your Changes**
   - Press `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac)
   - Or click the Save button in the toolbar
   - Changes are written back to your local file
   - You'll see a success notification

### Managing Tabs

- **Switch Tabs**: Click on any tab to switch to that file
- **Close Tabs**: Click the X icon on a tab (minimum 1 tab must remain open)
- **Multiple Files**: Open as many files as you need

### Folder Operations

- **Refresh**: Click the refresh icon (🔄) to reload the folder structure
- **Close Folder**: Click the X icon to close the folder and return to demo files
- **Folder Name**: The current folder name is displayed in the sidebar header

## UI Elements

```
┌─────────────────────────────────────────────────────────┐
│  OmniCode  [≡]  Language ▼  [💾]  [⚙]  [▶ Run]        │
├─────────────┬───────────────────────────────────────────┤
│ My Project  │  main.py  utils.py  config.json          │
│ [🔄] [✕]    │  ─────────────────────────────────────   │
│             │                                            │
│ 📁 src      │  def hello():                             │
│   📄 main.py│      print("Hello, World!")               │
│   📄 utils  │                                            │
│ 📄 README   │                                            │
│             │                                            │
│             │                                            │
└─────────────┴───────────────────────────────────────────┘
```

## Common Scenarios

### Scenario 1: Edit a Python Project
1. Open your Python project folder
2. Navigate to your `.py` files in the Explorer
3. Click to open files
4. Edit and save with `Ctrl+S`
5. Click "Run" to execute in the cloud

### Scenario 2: Work on a Web Project
1. Open your web project folder
2. Open HTML, CSS, and JavaScript files
3. Edit multiple files in different tabs
4. Save changes to each file
5. Preview changes in your browser

### Scenario 3: Quick File Edits
1. Open any folder with text files
2. Make quick edits
3. Save and close
4. Changes persist on your local system

## Troubleshooting

### "Not Supported" Error
- Your browser doesn't support the File System Access API
- Use Chrome, Edge, or another Chromium-based browser

### Can't Save Files
- Make sure you opened the file from a local folder
- Demo files (without opening a folder) cannot be saved
- Check that you granted folder permissions

### Files Not Showing
- Click the refresh button to reload
- Check if files are hidden (starting with `.`)
- Verify the folder isn't empty

### Permission Denied
- Your browser blocked folder access
- Try opening the folder again
- Check browser settings for file system permissions

## Tips & Tricks

1. **Keyboard Shortcuts**
   - `Ctrl+S` / `Cmd+S`: Save current file
   - Works only for files from local folders

2. **File Organization**
   - Keep related files in the same folder
   - Use meaningful file names
   - Organize with subfolders

3. **Performance**
   - Large folders may take time to load
   - Consider opening specific subfolders
   - Hidden files and common build folders are automatically filtered

4. **Workflow**
   - Open folder → Edit files → Save → Run code
   - Switch between files using tabs
   - Use the refresh button after external changes

5. **Safety**
   - Always save before closing tabs
   - Changes are immediate when saved
   - No undo for saved changes (use version control!)

## Next Steps

- Explore the 30+ supported programming languages
- Try the cloud code execution feature
- Experiment with different file types
- Integrate with your existing projects

---

**Need Help?** Check the main README or open an issue on GitHub.
