/**
 * DOM utility functions
 */

/**
 * Show or hide an element
 * @param {string|HTMLElement} element - Element ID or element itself
 * @param {boolean} show - Whether to show the element
 */
export function toggleElement(element, show) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) {
        el.style.display = show ? 'block' : 'none';
    }
}

/**
 * Add or remove a class from an element
 * @param {string|HTMLElement} element - Element ID or element itself
 * @param {string} className - Class name to toggle
 * @param {boolean} add - Whether to add the class
 */
export function toggleClass(element, className, add) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) {
        if (add) {
            el.classList.add(className);
        } else {
            el.classList.remove(className);
        }
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @param {string} successMessage - Message to show on success
 */
export async function copyToClipboard(text, successMessage = '복사되었습니다!') {
    try {
        await navigator.clipboard.writeText(text);
        alert(successMessage);
    } catch (err) {
        console.error('복사 실패:', err);
        alert('복사에 실패했습니다.');
    }
}

/**
 * Create a loading animation
 * @param {string|HTMLElement} element - Element to show loading in
 * @param {string} message - Loading message
 * @returns {number} Interval ID for cleanup
 */
export function startLoadingAnimation(element, message = 'Loading') {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (!el) return null;

    let dots = 0;
    el.textContent = message;
    el.style.display = 'block';

    return setInterval(() => {
        dots = (dots + 1) % 4;
        el.textContent = message + '.'.repeat(dots);
    }, 200);
}

/**
 * Stop loading animation
 * @param {string|HTMLElement} element - Element to hide
 * @param {number} intervalId - Interval ID to clear
 */
export function stopLoadingAnimation(element, intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
    }
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) {
        el.textContent = '';
        el.style.display = 'none';
    }
}

/**
 * Show loading overlay covering the entire screen
 * Displays a semi-transparent dark background with a centered spinner
 */
export function showLoadingOverlay() {
    // Remove existing overlay if present
    const existing = document.getElementById('loading-overlay');
    if (existing) {
        existing.remove();
    }

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    // Create container for spinner and text
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    `;

    // Create spinner
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 60px;
        height: 60px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-top: 5px solid #ffffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

    // Create loading text
    const loadingText = document.createElement('div');
    loadingText.style.cssText = `
        color: #ffffff;
        text-align: center;
        font-size: 16px;
        line-height: 1.6;
    `;
    loadingText.textContent = '로딩중입니다...\n잠시만 기다려주세요.';
    loadingText.innerHTML = '로딩중입니다...<br>잠시만 기다려주세요.';

    // Add CSS animation
    if (!document.getElementById('loading-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'loading-spinner-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    container.appendChild(spinner);
    container.appendChild(loadingText);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

/**
 * Hide loading overlay
 */
export function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}
