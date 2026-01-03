# Vercel Deployment Guide

## Project Structure (Optimized for Vercel)

```
/web (root)
├── index.html                # Main entry point (Vercel auto-detects)
├── vercel.json              # Vercel configuration
├── public/                  # Additional HTML pages
│   ├── submitOrder.html
│   ├── checkOrder.html
│   ├── bankAccount.html
│   └── admin/
│       ├── login.html
│       ├── hub.html
│       ├── controlMenu.html
│       ├── typeOrder.html
│       └── print.html
├── src/                     # JavaScript modules & CSS
│   ├── js/
│   │   ├── config/
│   │   ├── services/
│   │   ├── utils/
│   │   └── pages/
│   └── css/
├── images/                  # Static assets
│   ├── gotgam/
│   └── durup/
├── archive/                 # Old ENV-based files (ignore)
└── archive2/                # Old flat structure files (ignore)
```

## Deployment Steps

### 1. Connect to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /path/to/web
vercel
```

### 2. Vercel Configuration

The `vercel.json` file is already configured with:
- Proper MIME types for ES6 modules
- Rewrite rules for clean URLs
- Static file serving

### 3. Environment Variables (if needed)

If you need to switch API endpoints for different environments:

**In Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add variable: `VITE_API_URL` or similar
3. Update `src/js/config/constants.js` to read from environment

**OR simply edit the API URL in the code:**
```javascript
// src/js/config/constants.js
export const API_BASE_URL = "https://horang.dev.ericfromkorea.com:50001";
```

### 4. Build Settings

Since this is a vanilla JS project (no build step required):

**Vercel Settings:**
- Framework Preset: **Other**
- Build Command: *(leave empty)*
- Output Directory: `.` (current directory)
- Install Command: *(leave empty)*

### 5. Deploy

```bash
# Deploy to production
vercel --prod

# Preview deployment (for testing)
vercel
```

## File Paths

### Root Level
- `index.html` - Landing page (auto-loaded by Vercel)
- Links to pages in `./public/` directory

### HTML Pages
All other HTML pages are in `public/` folder:
- `/public/submitOrder.html`
- `/public/checkOrder.html`
- `/public/admin/controlMenu.html`
- etc.

### Assets
- JavaScript modules: `/src/js/**/*.js`
- CSS files: `/src/css/**/*.css`
- Images: `/images/**/*`

## Important Notes

### ES6 Modules
All JavaScript files use `type="module"`:
```html
<script type="module" src="../src/js/pages/submit-order.js"></script>
```

Vercel automatically serves these with correct MIME type (`application/javascript`).

### CORS & API
If your API is on a different domain, ensure CORS headers are set on the API server.

### Static Assets
All files in the project are served as static assets. No server-side rendering.

## Verification Checklist

After deployment, verify:
- [ ] Root URL loads index.html correctly
- [ ] Links to other pages work (`/public/submitOrder.html`)
- [ ] JavaScript modules load without errors
- [ ] CSS styling applies correctly
- [ ] Images load from `/images/` directory
- [ ] API calls to `https://horang.dev.ericfromkorea.com:50001` work
- [ ] Admin pages accessible at `/public/admin/...`

## Troubleshooting

### Module not found errors
- Check file paths in import statements
- Ensure all paths are relative (start with `./` or `../`)

### MIME type errors
- Verify `vercel.json` is in root directory
- Check that files have `.js` extension (not `.mjs`)

### 404 errors
- Ensure file paths match case-sensitively
- Check that HTML files link to correct paths in `public/` folder

### API errors
- Verify API endpoint in `src/js/config/constants.js`
- Check CORS settings on API server
- Ensure API is accessible from Vercel's servers

## Custom Domain (Optional)

To add a custom domain:
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `horang.example.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

## Rollback

If needed, previous deployments can be restored:
1. Go to Vercel Dashboard → Deployments
2. Find the working deployment
3. Click "Promote to Production"

## Performance Optimization

Consider adding for production:
- Image optimization (Vercel Image Optimization)
- Compression (automatically handled by Vercel)
- Caching headers (add to `vercel.json` if needed)

## Monitoring

View deployment logs and analytics:
- Vercel Dashboard → Your Project → Analytics
- Real-time logs available during deployment
- Monitor API errors and performance
