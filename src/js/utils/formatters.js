/**
 * Utility functions for formatting data
 */

/**
 * Format a number as Korean currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    return `${amount.toLocaleString()}원`;
}

/**
 * Format phone number by removing hyphens
 * @param {string} phoneNumber - Phone number with or without hyphens
 * @returns {string} Phone number without hyphens
 */
export function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replaceAll("-", "");
}

/**
 * Format date string to Korean format
 * @param {string} dateString - Date string (e.g., "1/5")
 * @returns {string} Formatted date (e.g., "1월 5일(수)")
 */
export function formatDate(dateString) {
    if (dateString === "가능한 빨리(1월초 순차배송)") {
        return "가능한빨리";
    }

    const currentYear = new Date().getFullYear();
    const date = new Date(`${dateString}/${currentYear}`);
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    return `${date.getMonth() + 1}월 ${date.getDate()}일(${weekdays[date.getDay()]})`;
}

/**
 * Get current and next year
 * @returns {{currentYear: number, nextYear: number}}
 */
export function getYears() {
    const currentYear = new Date().getFullYear();
    return {
        currentYear,
        nextYear: currentYear + 1
    };
}
