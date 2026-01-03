# Pre-Deployment Checklist

## ✅ Files Ready for Vercel

### Root Level
- [x] index.html - Main entry point
- [x] vercel.json - Deployment configuration
- [x] README.md - Project documentation
- [x] MIGRATION_GUIDE.md - Code migration details
- [x] VERCEL_DEPLOYMENT.md - Deployment instructions

### Directory Structure
- [x] public/ - HTML pages
- [x] src/ - JavaScript modules & CSS
- [x] images/ - Static assets
- [x] archive/ - Old ENV files (ignored in deployment)
- [x] archive2/ - Old flat structure (ignored in deployment)

## 🔍 Pre-Deployment Verification

### API Configuration
- [ ] Verify API_BASE_URL in `src/js/config/constants.js`
- [ ] Current: `https://horang.dev.ericfromkorea.com:50001`
- [ ] CORS enabled on API server for Vercel domain

### File Paths
- [ ] index.html links to `./public/` pages
- [ ] HTML pages link to `../src/` resources
- [ ] All ES6 modules use relative imports

### Test Locally
```bash
# Test with a local server
python3 -m http.server 8000
# or
npx http-server .

# Visit http://localhost:8000
```

### Test These Pages
- [ ] index.html loads
- [ ] /public/submitOrder.html works
- [ ] /public/checkOrder.html works
- [ ] /public/admin/controlMenu.html works
- [ ] All JavaScript modules load
- [ ] CSS styles apply correctly
- [ ] Images display properly

## 🚀 Deploy to Vercel

### First Time Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /path/to/web
vercel
```

### Vercel Settings
- **Framework Preset:** Other
- **Build Command:** (empty)
- **Output Directory:** `.`
- **Install Command:** (empty)

### Production Deployment
```bash
vercel --prod
```

## 📊 Post-Deployment

### Verify Live Site
- [ ] Visit your Vercel URL
- [ ] Test all pages
- [ ] Check browser console for errors
- [ ] Test order submission
- [ ] Test order lookup
- [ ] Test admin functions

### Monitor
- [ ] Check Vercel Analytics
- [ ] Monitor API calls
- [ ] Watch for errors in logs

## 🔧 Troubleshooting

### Common Issues
1. **404 Errors**
   - Check file paths (case-sensitive)
   - Verify files exist in correct directories

2. **Module Not Found**
   - Check import paths
   - Ensure `.js` extensions in imports

3. **CORS Errors**
   - Enable CORS on API server
   - Add Vercel domain to allowed origins

4. **CSS Not Loading**
   - Verify CSS paths in HTML
   - Check file names match exactly

## 📝 Notes

- All old unused files are in `archive2/`
- Vercel ignores archive folders (add to `.vercelignore` if needed)
- No build step required (vanilla JS project)
- ES6 modules work natively in modern browsers

