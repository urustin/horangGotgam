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
