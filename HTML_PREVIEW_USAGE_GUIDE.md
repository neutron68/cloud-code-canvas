# HTML Preview - Quick Start Guide

## How to Use HTML Live Preview

### Step 1: Open an HTML File

**Option A: From Local Storage**
1. Click "Open Folder" or "Open File" in the sidebar
2. Select an HTML file from your computer
3. File opens in the editor
4. Preview button automatically appears in toolbar

**Option B: Create New HTML File**
1. Select "HTML" from the language dropdown
2. Start typing your HTML code
3. Preview button appears in toolbar

### Step 2: Enable Preview

**Automatic:**
- Preview automatically shows when you open an HTML file
- Split view: Editor (left) + Preview (right)

**Manual:**
- Click the "Preview" button in the toolbar
- Or click the "Run" button (renamed to "Preview" for HTML)

### Step 3: Edit and See Changes

**Real-time Updates:**
```html
<!-- Type in the editor: -->
<h1>Hello World</h1>

<!-- See instantly in preview: -->
```
The preview updates as you type - no need to save or refresh!

### Step 4: Use Preview Controls

**Available Controls:**

🔄 **Refresh Button**
- Manually refresh the preview
- Useful if preview seems stuck

🔗 **Open in New Tab**
- Opens preview in a separate browser tab
- Full browser features available
- Can bookmark or share the URL

⛶ **Fullscreen Toggle**
- Switch between split view and fullscreen
- Fullscreen: Preview takes entire screen
- Great for testing responsive designs

👁 **Show/Hide Preview**
- Toggle preview visibility
- Get more space for editing when needed

## Common Workflows

### Workflow 1: Building a Simple Page

```html
<!-- Step 1: Basic structure -->
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Welcome</h1>
</body>
</html>
```
✓ Preview shows: "Welcome" as a heading

```html
<!-- Step 2: Add content -->
<body>
    <h1>Welcome</h1>
    <p>This is my first page!</p>
    <button>Click Me</button>
</body>
```
✓ Preview updates: Shows paragraph and button

```html
<!-- Step 3: Add styles -->
<head>
    <title>My Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2563eb;
        }
        button {
            background: #2563eb;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
```
✓ Preview updates: Shows styled content

### Workflow 2: Working with CSS Files

**HTML File (index.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Styled Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Styled Content</h1>
    </div>
</body>
</html>
```

**CSS File (styles.css):**
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
}

h1 {
    color: #2563eb;
    font-size: 3rem;
}
```

**How to Preview:**
1. Open HTML file - see basic structure
2. Switch to CSS file tab
3. Edit CSS - preview updates automatically
4. Switch back to HTML tab - see combined result

### Workflow 3: Testing Responsive Design

**1. Use Fullscreen Mode:**
- Click fullscreen button (⛶)
- Preview takes entire screen
- Resize browser window to test different sizes

**2. Add Responsive CSS:**
```css
/* Desktop */
.container {
    max-width: 1200px;
}

/* Tablet */
@media (max-width: 768px) {
    .container {
        max-width: 100%;
        padding: 10px;
    }
}

/* Mobile */
@media (max-width: 480px) {
    h1 {
        font-size: 1.5rem;
    }
}
```

**3. Test:**
- Resize browser window
- See responsive changes in real-time
- Exit fullscreen when done

### Workflow 4: Interactive Elements

**Forms:**
```html
<form onsubmit="alert('Form submitted!'); return false;">
    <input type="text" placeholder="Enter name">
    <button type="submit">Submit</button>
</form>
```
✓ Form is fully functional in preview
✓ Can type in input
✓ Button shows alert when clicked

**JavaScript:**
```html
<button onclick="changeColor()">Change Color</button>

<script>
function changeColor() {
    document.body.style.backgroundColor = 
        '#' + Math.floor(Math.random()*16777215).toString(16);
}
</script>
```
✓ Button is clickable
✓ JavaScript executes in preview
✓ Background color changes

## Tips & Tricks

### Tip 1: Auto-completion
If you write incomplete HTML, the preview auto-completes it:

**You write:**
```html
<h1>Hello</h1>
<p>World</p>
```

**Preview renders:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
</head>
<body>
    <h1>Hello</h1>
    <p>World</p>
</body>
</html>
```

### Tip 2: Quick Testing
- Make a change
- See result instantly
- No need to save or refresh
- Undo if you don't like it

### Tip 3: Export to Browser
- Click "Open in New Tab"
- Preview opens in new browser tab
- Use browser DevTools for advanced debugging
- Can share the URL with others

### Tip 4: Split Screen Editing
- Keep preview visible while editing
- See changes in real-time
- No context switching needed
- More productive workflow

### Tip 5: CSS Experimentation
- Try different colors, sizes, layouts
- See results immediately
- Learn CSS faster with visual feedback
- No fear of breaking things

## Keyboard Shortcuts

| Action | Shortcut | Description |
|--------|----------|-------------|
| Save File | Ctrl+S / Cmd+S | Save current file |
| Toggle Preview | (Coming soon) | Show/hide preview |
| Fullscreen | (Coming soon) | Toggle fullscreen mode |
| Refresh | (Coming soon) | Refresh preview |

## Troubleshooting

### Preview Not Showing?
1. Check if "Preview" button is visible in toolbar
2. Click the "Preview" button to enable it
3. Make sure you're editing an HTML or CSS file
4. Try clicking "Run" button

### Preview Not Updating?
1. Click the refresh button (🔄)
2. Make a small change in the code
3. Check browser console for errors
4. Try closing and reopening the file

### Styles Not Applying?
1. Check CSS syntax for errors
2. Make sure CSS is in `<style>` tags or linked properly
3. Use browser DevTools (open in new tab)
4. Check for CSS specificity issues

### JavaScript Not Working?
1. Check browser console for errors (open in new tab)
2. Make sure script is in `<script>` tags
3. Check for syntax errors
4. Some features may be restricted in sandbox

### Preview Looks Different Than Expected?
1. Check viewport meta tag
2. Try fullscreen mode
3. Open in new tab for full browser features
4. Check for CSS conflicts

## Best Practices

### 1. Structure Your HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- Your content here -->
</body>
</html>
```

### 2. Use Semantic HTML
```html
<header>
    <nav>...</nav>
</header>
<main>
    <article>...</article>
</main>
<footer>...</footer>
```

### 3. Organize CSS
```css
/* Layout */
.container { ... }

/* Typography */
h1, h2, h3 { ... }

/* Components */
.button { ... }

/* Utilities */
.text-center { ... }
```

### 4. Test Responsiveness
```css
/* Mobile First */
.container {
    width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        width: 750px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        width: 1000px;
    }
}
```

### 5. Use Comments
```html
<!-- Header Section -->
<header>
    ...
</header>

<!-- Main Content -->
<main>
    ...
</main>
```

## Examples to Try

### Example 1: Landing Page
```html
<!DOCTYPE html>
<html>
<head>
    <title>Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 20px;
            text-align: center;
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        .cta-button {
            background: white;
            color: #667eea;
            padding: 15px 30px;
            border: none;
            border-radius: 5px;
            font-size: 1.2rem;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Welcome to Our Product</h1>
        <p>The best solution for your needs</p>
        <button class="cta-button">Get Started</button>
    </div>
</body>
</html>
```

### Example 2: Card Layout
```html
<!DOCTYPE html>
<html>
<head>
    <title>Card Layout</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .card h2 {
            color: #333;
            margin-bottom: 10px;
        }
        .card p {
            color: #666;
        }
    </style>
</head>
<body>
    <div class="cards">
        <div class="card">
            <h2>Card 1</h2>
            <p>This is the first card with some content.</p>
        </div>
        <div class="card">
            <h2>Card 2</h2>
            <p>This is the second card with some content.</p>
        </div>
        <div class="card">
            <h2>Card 3</h2>
            <p>This is the third card with some content.</p>
        </div>
    </div>
</body>
</html>
```

## Summary

The HTML Live Preview feature makes web development in OmniCode as easy as:

1. **Open** an HTML file
2. **Edit** your code
3. **See** results instantly
4. **Test** in fullscreen
5. **Export** to browser

No configuration, no servers, no hassle - just pure web development productivity!

---

**Need Help?** Check the main documentation or experiment with the examples above!