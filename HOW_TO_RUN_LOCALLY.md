# How to Run Your Project Locally

## ✅ Fixed Issues

All file paths have been corrected:
- ✓ CSS paths: `../src/css/reset.css`
- ✓ JavaScript paths: `../src/js/pages/...`
- ✓ Image paths: `../images/gotgam/...`

## 🚀 Option 1: Using Python HTTP Server (Recommended)

```bash
# Navigate to the web directory (project root)
cd /Users/son_mbp/Desktop/sonBook_Programming/web/WORK/horangGotgam/prj/web

# Start the server
python3 -m http.server 8000

# Open your browser to:
# http://localhost:8000/index.html
# http://localhost:8000/public/submitOrder.html
# http://localhost:8000/public/checkOrder.html
```

## 🔧 Option 2: Using Live Server (VS Code)

**IMPORTANT: You MUST open Live Server from the correct directory!**

### Method A: Set Correct Root
1. In VS Code, open the **web** folder (not public folder!)
2. Right-click on `index.html` in the root
3. Select "Open with Live Server"

### Method B: Configure Live Server Settings
Add to your VS Code settings.json:
```json
{
  "liveServer.settings.root": "/Users/son_mbp/Desktop/sonBook_Programming/web/WORK/horangGotgam/prj/web"
}
```

## 🎯 Option 3: Using Node.js http-server

```bash
# Install (first time only)
npm install -g http-server

# Navigate to project root
cd /Users/son_mbp/Desktop/sonBook_Programming/web/WORK/horangGotgam/prj/web

# Start server
http-server

# Usually runs on http://localhost:8080
```

## ✅ Verify Everything Works

After starting your server, test these pages:

1. **Main Page**
   - http://localhost:8000/index.html
   - Should load with styled buttons

2. **Submit Order Page**
   - http://localhost:8000/public/submitOrder.html
   - Should show all product images
   - CSS should be applied
   - No 404 errors in console

3. **Check Order Page**
   - http://localhost:8000/public/checkOrder.html
   - Should load correctly with styles

4. **Admin Pages**
   - http://localhost:8000/public/admin/controlMenu.html
   - etc.

## 🔍 Troubleshooting

### CSS Not Loading
**Error:** "MIME type ('text/html') is not a supported stylesheet"

**Solution:** You're serving from the wrong directory. Make sure you:
- Start the server from `/web/` (project root)
- NOT from `/web/public/`

### Images Not Loading (404)
**Error:** "Failed to load resource: 404"

**Solution:** 
- Fixed! All image paths now use `../images/` 
- Reload the page with Ctrl+F5 (hard refresh)

### JavaScript Module Errors
**Error:** "Failed to load module"

**Solution:**
- Ensure you're using a web server (not file:// protocol)
- Check browser console for specific path errors

## 📂 Current Directory Structure

```
/web (← START SERVER HERE!)
├── index.html
├── public/
│   ├── submitOrder.html
│   └── checkOrder.html
├── src/
│   ├── css/
│   └── js/
└── images/
    ├── gotgam/
    └── durup/
```

## ⚠️ Common Mistakes

❌ **WRONG:** Opening Live Server on a file inside `/public/`
✅ **RIGHT:** Opening Live Server from the `/web/` root directory

❌ **WRONG:** Using `file:///path/to/submitOrder.html`
✅ **RIGHT:** Using `http://localhost:8000/public/submitOrder.html`

## 🎉 Quick Start Command

Just run this from your project directory:

```bash
python3 -m http.server 8000
```

Then open: http://localhost:8000/public/submitOrder.html

