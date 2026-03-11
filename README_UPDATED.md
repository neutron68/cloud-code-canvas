# OmniCode - Cloud-Based Multi-Language IDE

A modern, cloud-based IDE supporting 30+ programming languages with local folder browsing and cloud code execution.

## 🚀 Features

### Core IDE Features
- **Multi-Language Support**: 30+ programming languages including Python, JavaScript, TypeScript, C, C++, Java, Go, Rust, and more
- **Monaco Editor**: Professional code editor with syntax highlighting, IntelliSense, and code completion
- **Cloud Execution**: Run code in the cloud using Judge0 API with real-time output
- **Multi-Tab Interface**: Work with multiple files simultaneously
- **Real-Time Output**: See compilation and execution results instantly

### 🆕 Local Folder Browser (NEW!)
- **Browse Local Files**: Open and browse folders from your local file system
- **Edit Local Files**: Make changes to files directly in the IDE
- **Save Changes**: Save modifications back to your local system with Ctrl+S
- **File Tree Navigation**: Intuitive folder structure with expand/collapse
- **Automatic Language Detection**: Syntax highlighting based on file extension
- **Permission Management**: Secure, browser-managed file access

## 🎯 Quick Start

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Modern Chromium-based browser (Chrome, Edge, Opera) for local folder features

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```sh
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📖 Using the Local Folder Browser

### Opening a Folder
1. Navigate to the Workspace (`/workspace`)
2. Click the folder icon (🔍) in the Explorer sidebar
3. Select a folder from your local system
4. Grant permission when prompted by your browser

### Editing Files
1. Click any file in the Explorer tree
2. File opens in a new tab with content loaded
3. Make your changes in the Monaco editor
4. Press `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac) to save

### Managing Files
- **Refresh**: Click the refresh icon to reload folder structure
- **Close Folder**: Click the X icon to close the current folder
- **Multiple Files**: Open as many files as needed in separate tabs

### Browser Compatibility
- ✅ Chrome 86+
- ✅ Edge 86+
- ✅ Opera 72+
- ❌ Firefox (not yet supported)
- ❌ Safari (not yet supported)

## 🏗️ Project Structure

```
├── src/
│   ├── components/
│   │   ├── landing/          # Landing page components
│   │   ├── workspace/        # IDE workspace components
│   │   │   ├── FileSidebar.tsx      # File tree browser
│   │   │   ├── LanguageSelector.tsx # Language picker
│   │   │   └── OutputConsole.tsx    # Code output display
│   │   └── ui/               # shadcn-ui components
│   ├── data/
│   │   ├── languages.ts      # Language configurations
│   │   └── judge0Languages.ts # Judge0 API mappings
│   ├── hooks/
│   │   ├── useFolderBrowser.ts # Folder operations hook
│   │   └── use-toast.ts      # Toast notifications
│   ├── lib/
│   │   ├── folderBrowser.ts  # File System API utilities
│   │   └── utils.ts          # Helper functions
│   ├── pages/
│   │   ├── Landing.tsx       # Landing page
│   │   ├── Workspace.tsx     # Main IDE interface
│   │   └── NotFound.tsx      # 404 page
│   ├── types/
│   │   └── file-system-access.d.ts # TypeScript declarations
│   └── integrations/
│       └── supabase/         # Backend integration
├── supabase/
│   └── functions/
│       └── execute-code/     # Cloud execution function
└── public/                   # Static assets
```

## 🛠️ Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Editor**: Monaco Editor
- **UI Components**: shadcn-ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Backend**: Supabase (auth, storage, functions)
- **Code Execution**: Judge0 API
- **State Management**: React hooks + React Query
- **Routing**: React Router v6

## 📚 Documentation

- [Folder Browser Feature Guide](./FOLDER_BROWSER_FEATURE.md) - Complete feature documentation
- [Usage Guide](./USAGE_GUIDE.md) - Step-by-step user instructions
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical implementation details
- [Architecture Diagram](./ARCHITECTURE_DIAGRAM.md) - System architecture overview
- [Feature Checklist](./FEATURE_CHECKLIST.md) - Implementation checklist

## 🔒 Security & Privacy

### Local Folder Access
- User must explicitly grant permission for each folder
- All file operations are local (no server uploads)
- Browser-managed security and sandboxing
- Hidden files and build folders automatically filtered

### Data Handling
- Code execution happens in isolated cloud environment
- No persistent storage of code on servers
- Supabase handles authentication securely
- Local files never leave your system

## 🎨 Supported Languages

Python, JavaScript, TypeScript, C, C++, C#, Java, Go, Rust, Ruby, PHP, Swift, Kotlin, Scala, Perl, Lua, R, Dart, Elixir, Haskell, Clojure, F#, Objective-C, Assembly, SQL, Shell, Bash, PowerShell, MATLAB, Fortran, and more!

## 🚀 Deployment

### Using Lovable
1. Open [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Click Share → Publish
3. Your app is live!

### Custom Domain
Navigate to Project > Settings > Domains and click Connect Domain.
[Learn more](https://docs.lovable.dev/features/custom-domain#custom-domain)

### Manual Deployment
```sh
# Build the project
npm run build

# Deploy the dist/ folder to your hosting service
# (Vercel, Netlify, GitHub Pages, etc.)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is built with Lovable and uses various open-source technologies.

## 🔗 Links

- **Project URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID
- **Documentation**: See docs folder for detailed guides
- **Support**: Open an issue on GitHub

## 🎯 Roadmap

### Current Features
- ✅ Multi-language code editor
- ✅ Cloud code execution
- ✅ Local folder browsing
- ✅ File editing and saving
- ✅ Multi-tab interface
- ✅ Real-time output

### Planned Features
- [ ] Create/delete files and folders
- [ ] Rename files and folders
- [ ] Search within folder
- [ ] Git integration
- [ ] Collaborative editing
- [ ] Code snippets library
- [ ] Custom themes
- [ ] Keyboard shortcuts customization
- [ ] Workspace persistence
- [ ] File upload/download

## 💡 Tips

1. **Keyboard Shortcuts**: Use `Ctrl+S` / `Cmd+S` to save files quickly
2. **Large Projects**: Open specific subfolders for better performance
3. **File Organization**: Keep related files in the same folder
4. **Version Control**: Use Git for tracking changes to local files
5. **Browser Choice**: Use Chrome or Edge for best experience

## 🐛 Troubleshooting

### "Not Supported" Error
- Use a Chromium-based browser (Chrome, Edge, Opera)
- Update your browser to the latest version

### Can't Save Files
- Ensure you opened the file from a local folder
- Check that you granted folder permissions
- Demo files (without opening a folder) cannot be saved

### Files Not Showing
- Click the refresh button to reload
- Check if files are hidden (starting with `.`)
- Verify folder permissions

## 📞 Support

For issues, questions, or feature requests:
1. Check the documentation in the docs folder
2. Search existing GitHub issues
3. Open a new issue with detailed information

---

**Built with ❤️ using Lovable, React, and modern web technologies**
