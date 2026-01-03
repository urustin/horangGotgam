# 호랑곶감 (Horang Gotgam) - Modern Vanilla JS Project

This project has been refactored to follow modern vanilla JavaScript conventions with ES6 modules and organized file structure.

## Project Structure

```
/web
├── public/                    # HTML files and static assets
│   ├── index.html            # Landing page
│   ├── submitOrder.html      # Order submission page
│   ├── checkOrder.html       # Order lookup page
│   ├── bankAccount.html      # Bank account information
│   └── admin/                # Admin pages
│       ├── login.html
│       ├── hub.html
│       ├── controlMenu.html  # Manage dates and products
│       ├── typeOrder.html    # Manual order entry
│       └── print.html        # Print order lists
├── src/
│   ├── js/                   # JavaScript modules
│   │   ├── config/
│   │   │   └── constants.js  # API URLs, product prices, configuration
│   │   ├── services/
│   │   │   └── api.js        # API service (all HTTP requests)
│   │   ├── utils/
│   │   │   ├── formatters.js # Formatting utilities (currency, dates, phone)
│   │   │   ├── validators.js # Form validation
│   │   │   └── dom.js        # DOM manipulation helpers
│   │   └── pages/
│   │       ├── submit-order.js
│   │       ├── check-order.js
│   │       └── admin/
│   │           ├── control-menu.js
│   │           ├── type-order.js
│   │           └── print.js
│   └── css/                  # Stylesheets
│       ├── reset.css         # CSS reset
│       └── pages/
│           ├── submit-order.css
│           ├── check-order.css
│           └── admin/
│               ├── login.css
│               ├── hub.css
│               ├── control-menu.css
│               ├── type-order.css
│               └── print.css
├── images/                   # Images
│   ├── gotgam/
│   └── durup/
└── archive/                  # Old files (backup)

```

## Key Features

### ES6 Modules
All JavaScript files now use modern ES6 import/export syntax:

```javascript
// Import from modules
import { API_BASE_URL, PRODUCT_PRICES } from '../config/constants.js';
import { apiService } from '../services/api.js';
import { formatCurrency } from '../utils/formatters.js';

// Export from modules
export const SHIPPING_FEE = 4000;
export function calculateTotal() { ... }
```

### Organized by Concern
- **Services**: API calls and external communication
- **Utils**: Reusable utility functions
- **Pages**: Page-specific logic and controllers
- **Config**: Configuration and constants

### Modern Fetch API
Replaced XMLHttpRequest with modern fetch API:

```javascript
const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
const result = await response.json();
```

### Class-based Architecture
Page controllers use ES6 classes for better organization:

```javascript
class SubmitOrderPage {
    constructor() {
        this.init();
    }

    init() {
        // Setup
    }

    async submitOrder() {
        // Logic
    }
}
```

## Configuration

### API Endpoints
Edit `src/js/config/constants.js` to change API URLs:

```javascript
export const API_BASE_URL = "https://horang.dev.ericfromkorea.com:50001";

export const ENV = {
    DEVELOP: false, // Set to true for local development
    get BASE_URL() {
        return this.DEVELOP
            ? 'http://localhost:5008'
            : 'https://ec2seoul.flaresolution.com/horang';
    }
};
```

### Product Prices
Update product prices in `src/js/config/constants.js`:

```javascript
export const PRODUCT_PRICES = {
    gotgam: {
        product1: 32000,
        product2: 43000,
        product3: 63000,
        product4: 85000,
        product5: 110000
    },
    durup: {
        durup1: 25000,
        durup2: 15000
    }
};
```

## File Naming Conventions

- **Directories**: kebab-case (e.g., `submit-order`, `check-order`)
- **JavaScript files**: kebab-case (e.g., `submit-order.js`, `api.js`)
- **CSS files**: kebab-case (e.g., `submit-order.css`)
- **HTML files**: camelCase (e.g., `submitOrder.html`) for compatibility

## How to Use

1. **Serve the files**: Use any web server to serve the `public` directory
   ```bash
   # Using Python
   python3 -m http.server 8000

   # Using Node.js http-server
   npx http-server public
   ```

2. **Access pages**:
   - Main page: `http://localhost:8000/index.html`
   - Order page: `http://localhost:8000/submitOrder.html`
   - Check orders: `http://localhost:8000/checkOrder.html`

3. **Modules load automatically**: The browser will load all ES6 modules automatically via `type="module"` script tags

## Browser Compatibility

- Requires modern browsers with ES6 module support
- Chrome 61+, Firefox 60+, Safari 11+, Edge 16+

## Development Notes

- All modules use strict mode by default
- Module scope is isolated (no global pollution)
- Async/await for cleaner asynchronous code
- Proper error handling with try/catch

## Migration Notes

The old files have been moved to the `archive/` directory:
- Old flat JavaScript files
- `web_durup/` backup folder
- Original `config.js` and `loadjs.js`

## Future Enhancements

Consider adding:
- Build process (Vite, Webpack, or esbuild)
- TypeScript for type safety
- CSS preprocessor (SCSS/LESS)
- Testing framework (Jest, Vitest)
- Linting (ESLint, Prettier)
