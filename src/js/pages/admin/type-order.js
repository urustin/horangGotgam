import { API_BASE_URL } from '../../config/constants.js';
import { formatPhoneNumber, formatDate } from '../../utils/formatters.js';
import { startLoadingAnimation, stopLoadingAnimation } from '../../utils/dom.js';

/**
 * Admin Type Order Page Controller
 * For manually typing orders
 */
class TypeOrderPage {
    constructor() {
        this.loadingInterval = null;
        this.init();
    }

    /**
     * Initialize the page
     */
    init() {
        // Page is ready when DOM loads
    }

    /**
     * Submit order
     */
    async submitOrder() {
        const loadingElement = document.getElementById('loading');
        this.loadingInterval = startLoadingAnimation(loadingElement, '전송중');

        try {
            const orderData = {
                sheetName: "응답",
                product1: document.querySelector("#product1").value,
                product2: document.querySelector("#product2").value,
                product3: document.querySelector("#product3").value,
                product4: document.querySelector("#product4").value,
                product5: document.querySelector("#product5").value,
                productEtc: document.querySelector("#productEtc").value,
                send_name: document.querySelector("#send_name").value,
                send_contact: formatPhoneNumber(document.querySelector("#send_contact").value),
                rcv_name: document.querySelector("#rcv_name").value,
                rcv_contact: formatPhoneNumber(document.querySelector("#rcv_contact").value),
                rcv_address: document.querySelector("#rcv_address").value,
                reserve_date: formatDate(document.querySelector("#reserve_date").value),
                request_etc: document.querySelector("#request_etc").value,
                request_delivery: document.querySelector("#request_delivery").value,
            };

            const response = await fetch(`${API_BASE_URL}/submit-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            const newOrder = document.querySelector("#newOrder");
            if (newOrder) {
                newOrder.style.display = "block";
            }

            stopLoadingAnimation(loadingElement, this.loadingInterval);
            this.resetOrder();
        } catch (error) {
            stopLoadingAnimation(loadingElement, this.loadingInterval);
            console.error('Error:', error);
            alert("오류가 발생하였습니다! 입력값을 확인해주세요!");
        }
    }

    /**
     * Reset order form
     */
    resetOrder() {
        const answer = window.confirm("새 주문을 시작합니다! 발송인이 같은 분이실까요?");

        const fieldsToReset = [
            "#product1", "#product2", "#product3", "#product4", "#product5",
            "#productEtc", "#rcv_name", "#rcv_contact", "#rcv_address",
            "#reserve_date", "#request_etc", "#request_delivery"
        ];

        fieldsToReset.forEach(field => {
            const element = document.querySelector(field);
            if (element) element.value = "";
        });

        if (!answer) {
            const senderFields = ["#send_name", "#send_contact"];
            senderFields.forEach(field => {
                const element = document.querySelector(field);
                if (element) element.value = "";
            });
        }
    }

    /**
     * Process image with OCR
     */
    async imageText() {
        const fileInput = document.querySelector('#imageUpload');
        if (!fileInput || fileInput.files.length === 0) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            const response = await fetch(`${API_BASE_URL}/image-text`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            console.log(data);

            const tempText = document.querySelector("#tempText");
            if (tempText) {
                tempText.innerHTML = data;
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to analyze the image.");
        }
    }
}

// Initialize the page
const typeOrderPage = new TypeOrderPage();

// Expose functions to global scope for HTML onclick handlers
window.submitOrder = () => typeOrderPage.submitOrder();
window.imageText = () => typeOrderPage.imageText();
