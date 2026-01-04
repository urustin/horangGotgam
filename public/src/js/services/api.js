import { API_BASE_URL } from '../config/constants.js';

/**
 * API Service for handling all HTTP requests
 */
class APIService {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    /**
     * Generic fetch wrapper with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * Load available order dates and product quantities for gotgam
     */
    async loadOrder() {
        return this.request('/load-order');
    }

    /**
     * Submit an order for gotgam
     */
    async submitGotgamOrder(orderData) {
        return this.request('/submit-order', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    /**
     * Submit an order for durup
     */
    async submitDurupOrder(orderData) {
        return this.request('/submit-order-durup', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    /**
     * Check existing orders by name and phone number
     */
    async checkOrder(name, phoneNumber) {
        const params = new URLSearchParams({
            name: name,
            phoneNumber: phoneNumber
        });
        return this.request(`/check-order?${params}`);
    }
}

// Export singleton instance
export const apiService = new APIService(API_BASE_URL);
