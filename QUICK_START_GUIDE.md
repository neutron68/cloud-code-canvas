# OmniCode IDE - Quick Start Guide

## 🚀 Getting Started

### 1. Access the IDE
Open your browser and go to: **http://localhost:8081/**

### 2. Navigate to IDE
Click either:
- "Start Coding" button (main hero section)
- "Try IDE" button (secondary button)
- "Start Coding" in navbar

### 3. Open Your Code
You have two options:

#### Option A: Open a Folder
1. Click "Open Folder" button
2. Select a folder from your computer
3. Browse files in the sidebar
4. Click any file to open it

#### Option B: Open Individual Files
1. Click "Open Files" button
2. Select one or more files
3. Files open in tabs

## 🎯 Key Features

### Multi-Tab Editing
- Open multiple files in tabs
- Switch between tabs by clicking
- Close tabs with the X button
- Tabs show filename and language

### Code Execution
1. Write or edit your code
2. Click "Run" button (top right)
3. View output in terminal below
4. Click "Stop" to halt execution

### HTML/CSS Preview
1. Open an HTML or CSS file
2. Preview button appears automatically
3. Click "Preview" to show/hide
4. Live updates as you type
5. Use fullscreen or open in new tab

### Error Detection
1. Errors appear as you type
2. Red/yellow markers in editor
3. Click "Debug" button for details
4. View error panel with:
   - Line numbers
   - Error messages
   - Suggestions
   - Quick fixes
5. Click "Jump to Line" to navigate
6. Code won't run if errors exist

### File Operations
- **Save**: Press Ctrl+S or click Save icon
- **Refresh**: Reload file tree
- **Close Folder**: Clear current workspace
- **Language**: Auto-detected from file extension

## ⌨️ Keyboard Shortcuts

- **Ctrl+S** - Save current file
- **Ctrl+/** - Toggle comment
- **Ctrl+F** - Find in file
- **Ctrl+H** - Find and replace
- **Alt+Up/Down** - Move line up/down
- **Ctrl+D** - Select next occurrence

## 🎨 Supported Languages

43 languages including:
- JavaScript, TypeScript, Python, Java
- C, C++, C#, Go, Rust
- HTML, CSS, PHP, Ruby
- SQL, Swift, Kotlin, Dart
- And many more!

## 🐛 Troubleshooting

### Black Screen?
- Refresh the page (F5)
- Clear browser cache
- Check console for errors (F12)

### Files Not Opening?
- Grant file system permissions
- Check browser supports File System Access API
- Try Chrome/Edge (best support)

### Code Not Running?
- Check for errors (click Debug)
- Verify language is supported
- Check internet connection (for cloud execution)

### Preview Not Showing?
- Click the "Preview" button
- Verify file is HTML or CSS
- Check for syntax errors

## 💡 Tips

1. **Start Small**: Open a single file first to test
2. **Use Debug**: Click Debug before running to catch errors
3. **Save Often**: Use Ctrl+S frequently
4. **Check Output**: Terminal shows execution details
5. **Try Preview**: HTML files show live preview
6. **Multiple Files**: Open related files in tabs

## 🔥 Quick Test

Try this to verify everything works:

1. Click "Open Files"
2. Create a new file: `test.js`
3. Paste this code:
```javascript
console.log("Hello from OmniCode!");
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);
```
4. Click "Run"
5. Check terminal output

## 📚 Feature Highlights

### Real-Time Error Detection
- Catches errors as you type
- Shows suggestions
- Prevents bad code from running

### Smart Preview
- Auto-shows for HTML/CSS
- Updates in real-time
- Sandboxed execution

### Cloud + Local Execution
- Tries cloud first (Judge0)
- Falls back to local simulation
- Shows execution time and memory

### File System Integration
- Browse local folders
- Save changes directly
- Refresh to see updates

## 🎯 Common Workflows

### Workflow 1: Edit Existing Project
1. Open Folder
2. Navigate file tree
3. Click files to edit
4. Save with Ctrl+S
5. Run to test

### Workflow 2: Quick Code Test
1. Open Files
2. Select test file
3. Edit code
4. Click Run
5. View output

### Workflow 3: HTML Development
1. Open HTML file
2. Preview auto-shows
3. Edit code
4. See live updates
5. Use fullscreen for better view

### Workflow 4: Debug Code
1. Write/edit code
2. Click Debug button
3. Review errors
4. Apply quick fixes
5. Run when clean

## ✅ Checklist

Before reporting issues, verify:
- [ ] Browser is Chrome/Edge (best support)
- [ ] Dev server is running (http://localhost:8081)
- [ ] File system permissions granted
- [ ] No console errors (F12)
- [ ] Internet connection active (for cloud execution)

## 🎉 You're Ready!

Start coding and enjoy the features. The IDE is designed to be intuitive and powerful.

**Happy Coding! 🚀**
