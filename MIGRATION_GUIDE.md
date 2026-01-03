# Migration Guide: Old → Modern Structure

## Overview
This project has been completely refactored from a flat file structure with traditional JavaScript to a modern, modular vanilla JS architecture.

## File Changes

### Before (Old Structure)
```
/web
├── index.html
├── submitOrder.html
├── submitOrder.js
├── submitOrder.css
├── checkOrder.html
├── checkOrder.js
├── checkOrder.css
├── admin_login.html
├── admin_login.js
├── admin_login.css
├── admin_controlMenu.html
├── admin_controlMenu.js
├── admin_controlMenu.css
├── ... (all files in root)
├── config.js
├── loadjs.js
├── reset.css
└── web_durup/
```

### After (New Structure)
```
/web
├── public/               # HTML files
│   ├── index.html
│   ├── submitOrder.html
│   ├── checkOrder.html
│   └── admin/
│       ├── controlMenu.html
│       ├── typeOrder.html
│       └── print.html
├── src/
│   ├── js/              # Modular JavaScript
│   │   ├── config/
│   │   ├── services/
│   │   ├── utils/
│   │   └── pages/
│   └── css/             # Organized stylesheets
│       ├── reset.css
│       └── pages/
└── archive/             # Old files (backup)
    ├── web_durup/
    ├── config.js
    └── loadjs.js
```

## Code Changes

### 1. Configuration (config.js → constants.js)

**Before:**
```javascript
// config.js
export const API_BASE_URL = "https://horang.dev.ericfromkorea.com:50001"
```

**After:**
```javascript
// src/js/config/constants.js
export const API_BASE_URL = "https://horang.dev.ericfromkorea.com:50001";

export const PRODUCT_PRICES = {
    gotgam: { product1: 32000, product2: 43000, ... },
    durup: { durup1: 25000, durup2: 15000 }
};

export const SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 4000;
export const ENV = {
    DEVELOP: false,
    get BASE_URL() { ... }
};
```

### 2. API Calls (Scattered → Centralized)

**Before:**
```javascript
// In submitOrder.js
const response = await fetch('https://ec2seoul.flaresolution.com/horang/submit-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});

// In checkOrder.js (using XMLHttpRequest!)
var xhr = new XMLHttpRequest();
xhr.open('GET', `https://ec2seoul.flaresolution.com/horang/check-order?...`, true);
xhr.onload = function() { ... };
xhr.send();
```

**After:**
```javascript
// src/js/services/api.js - Single service for all API calls
class APIService {
    async submitGotgamOrder(orderData) {
        return this.request('/submit-order', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async checkOrder(name, phoneNumber) {
        const params = new URLSearchParams({ name, phoneNumber });
        return this.request(`/check-order?${params}`);
    }
}

// Usage in pages
import { apiService } from '../services/api.js';
await apiService.submitGotgamOrder(data);
```

### 3. Utility Functions (Duplicated → Shared)

**Before:**
```javascript
// Duplicated in submitOrder.js
function formatDate(dateString) {
    const currentYear = 2025;
    const date = new Date(`${dateString}/${currentYear}`);
    // ... formatting logic
}

// Duplicated in admin_typeOrder.js
function formatDate(dateString) {
    const currentYear = 2025;
    const date = new Date(`${dateString}/${currentYear}`);
    // ... same logic repeated
}

// Loading animation duplicated everywhere
function startLoadingAnimation() {
    let loadingInterval = "";
    const loadingElement = document.getElementById('loading');
    // ... duplicated logic
}
```

**After:**
```javascript
// src/js/utils/formatters.js - Single source of truth
export function formatDate(dateString) {
    const currentYear = new Date().getFullYear();
    const date = new Date(`${dateString}/${currentYear}`);
    // ... formatting logic (defined once)
}

export function formatCurrency(amount) {
    return `${amount.toLocaleString()}원`;
}

// src/js/utils/dom.js - Reusable DOM utilities
export function startLoadingAnimation(element, message = 'Loading') {
    // ... single implementation
}

// Used everywhere
import { formatDate, formatCurrency } from '../utils/formatters.js';
import { startLoadingAnimation } from '../utils/dom.js';
```

### 4. Page Controllers (Functional → Class-based)

**Before (submitOrder.js):**
```javascript
// Global functions scattered throughout the file
function calculate_total() { ... }
function update_price() { ... }
function update_summary() { ... }
async function submitOrder() { ... }
function loadOrder() { ... }

// Global variables
const current = 'gotgam';
const develop = false;

// Event listeners at bottom
product1.addEventListener("oninput", update_price);
```

**After (submit-order.js):**
```javascript
class SubmitOrderPage {
    constructor() {
        this.currentProductType = PRODUCT_TYPES.GOTGAM;
        this.loadingInterval = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupYears();
            this.setupMenuVisibility();
            this.setupEventListeners();
            this.updatePrice();
        });
    }

    calculateTotal() { ... }
    updatePrice() { ... }
    updateSummary() { ... }
    async submitOrder() { ... }
}

// Single instance
const submitOrderPage = new SubmitOrderPage();

// Expose to global for HTML onclick
window.submitOrder = () => submitOrderPage.submitOrder();
```

### 5. HTML Updates

**Before:**
```html
<link rel="stylesheet" href="submitOrder.css">
<script src="./submitOrder.js"></script>
```

**After:**
```html
<link rel="stylesheet" href="../src/css/reset.css">
<link rel="stylesheet" href="../src/css/pages/submit-order.css">
<script type="module" src="../src/js/pages/submit-order.js"></script>
```

## Key Improvements

### 1. Code Reusability
- **Before**: Loading animation code duplicated 5+ times
- **After**: Single implementation in `utils/dom.js`

### 2. Maintainability
- **Before**: Change API URL in 8 different files
- **After**: Change once in `config/constants.js`

### 3. Modern JavaScript
- **Before**: Mix of XMLHttpRequest, fetch, and inconsistent patterns
- **After**: Consistent async/await with modern fetch API

### 4. Organization
- **Before**: 30+ files in root directory
- **After**: Organized by type and purpose

### 5. Code Quality
- **Before**: Global variables, procedural code
- **After**: ES6 modules, classes, encapsulation

## Breaking Changes

### None for Users
The HTML structure and user-facing functionality remain the same. All changes are internal.

### For Developers
1. All JavaScript files now use ES6 modules
2. Import paths changed (use relative imports)
3. Some global functions now namespaced under classes
4. File locations changed (see structure above)

## Rollback Plan

If needed, all original files are preserved in the `archive/` directory. Simply copy them back to restore the old structure.

## Testing Checklist

After migration, verify:
- [ ] Submit order page loads correctly
- [ ] Order submission works
- [ ] Check order page works
- [ ] Admin control menu functions
- [ ] Admin type order works
- [ ] Admin print page displays orders
- [ ] All CSS styling intact
- [ ] No console errors

## Next Steps

1. Test all pages in a local server
2. Update any server-side code if needed
3. Deploy to production
4. Monitor for any issues
5. Consider adding:
   - Build process (Vite/Webpack)
   - TypeScript
   - Unit tests
   - E2E tests
