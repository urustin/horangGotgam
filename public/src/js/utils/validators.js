/**
 * Utility functions for form validation
 */

/**
 * Validate Korean phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid
 */
export function validatePhoneNumber(phoneNumber) {
    const regex = /^01(?:0|1|[6-9])[.-]?(\d{3}|\d{4})[.-]?(\d{4})$/;
    return regex.test(phoneNumber);
}

/**
 * Validate that at least one product is selected
 * @param {Object} products - Object containing product quantities
 * @returns {boolean} True if at least one product has quantity > 0
 */
export function validateProductSelection(products) {
    return Object.values(products).some(qty => qty && parseInt(qty) > 0);
}

/**
 * Check if phone number length is within limit
 * @param {string} value - Phone number value
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if valid length
 */
export function checkPhoneNumberLength(value, maxLength = 4) {
    return value.length <= maxLength;
}
