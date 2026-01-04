import { PRODUCT_PRICES, SHIPPING_THRESHOLD, SHIPPING_FEE, PRODUCT_TYPES, BANK_INFO, CONTACT_PHONE } from '../config/constants.js';
import { apiService } from '../services/api.js';
import { formatCurrency, formatPhoneNumber, getYears } from '../utils/formatters.js';
import { toggleElement, toggleClass, copyToClipboard, startLoadingAnimation, stopLoadingAnimation } from '../utils/dom.js';
import { formatDate } from '../utils/formatters.js';


/**
 * Submit Order Page Controller
 */
class SubmitOrderPage {
    constructor() {
        this.currentProductType = PRODUCT_TYPES.GOTGAM; // or PRODUCT_TYPES.DURUP
        this.loadingInterval = null;

        this.init();
    }

    /**
     * Initialize the page
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupYears();
            this.setupMenuVisibility();
            this.setupEventListeners();
            this.updatePrice();

            if (this.currentProductType === PRODUCT_TYPES.GOTGAM) {
                this.loadAvailableDates();
            }
        });
    }

    /**
     * Set up current and next year displays
     */
    setupYears() {
        const { currentYear, nextYear } = getYears();

        document.querySelectorAll('#currentYear').forEach(el => {
            el.textContent = currentYear;
        });
        document.querySelectorAll('#nextYear').forEach(el => {
            el.textContent = nextYear;
        });
    }

    /**
     * Set up menu visibility based on product type
     */
    setupMenuVisibility() {
        const isGotgam = this.currentProductType === PRODUCT_TYPES.GOTGAM;

        ['intro', 'desc', 'products', 'outro'].forEach(section => {
            toggleElement(`gotgam_${section}`, isGotgam);
            toggleElement(`durup_${section}`, !isGotgam);
        });

        toggleElement('gotgam_date', isGotgam);

        const reserveDateSelect = document.getElementById('reserve_date');
        if (reserveDateSelect) {
            reserveDateSelect.required = isGotgam;
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Product quantity change listeners
        if (this.currentProductType === PRODUCT_TYPES.GOTGAM) {
            for (let i = 1; i <= 5; i++) {
                const select = document.getElementById(`product${i}`);
                if (select) {
                    select.addEventListener('change', () => this.updatePrice());
                }
            }
        } else {
            for (let i = 1; i <= 2; i++) {
                const select = document.getElementById(`durup${i}`);
                if (select) {
                    select.addEventListener('change', () => this.updatePrice());
                }
            }
        }

        // Contact number validation - allow only numbers
        this.setupContactValidation('send_contact');
        this.setupContactValidation('rcv_contact');
    }

    /**
     * Set up contact field to accept only numbers
     */
    setupContactValidation(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', (e) => {
                // Remove all non-numeric characters in real-time
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    }

    /**
     * Calculate total price
     */
    calculateTotal() {
        let total = 0;

        if (this.currentProductType === PRODUCT_TYPES.GOTGAM) {
            for (let i = 1; i <= 5; i++) {
                const select = document.getElementById(`product${i}`);
                if (select && select.value) {
                    total += PRODUCT_PRICES.gotgam[`product${i}`] * parseInt(select.value);
                }
            }
        } else {
            for (let i = 1; i <= 2; i++) {
                const select = document.getElementById(`durup${i}`);
                if (select && select.value) {
                    total += PRODUCT_PRICES.durup[`durup${i}`] * parseInt(select.value);
                }
            }
        }

        if (total > 0 && total < SHIPPING_THRESHOLD) {
            total += SHIPPING_FEE;
        }

        return total;
    }

    /**
     * Update price display
     */
    updatePrice() {
        const total = this.calculateTotal();
        const priceTag = document.getElementById('priceTag');

        if (!priceTag) return;

        if (total > 0) {
            toggleClass(priceTag, 'none', false);
            priceTag.innerHTML = `현재 금액 : ${formatCurrency(total)}<br>` +
                (total < SHIPPING_THRESHOLD
                    ? `(${formatCurrency(SHIPPING_THRESHOLD)} 이하<br>택배비 ${formatCurrency(SHIPPING_FEE)})`
                    : '');
        } else {
            toggleClass(priceTag, 'none', true);
        }

        this.updateSummary();
    }

    /**
     * Update order summary
     */
    updateSummary() {
        const summaryDiv = document.querySelector('.summary_order');
        if (!summaryDiv) return;

        let summary = '';

        if (this.currentProductType === PRODUCT_TYPES.GOTGAM) {
            for (let i = 1; i <= 5; i++) {
                const select = document.getElementById(`product${i}`);
                if (select && select.value && select.value !== '0') {
                    summary += `${i}호 : ${select.value}개<br>`;
                }
            }
        } else {
            const durupTypes = {
                durup1: '산두릅(참두릅)',
                durup2: '곁순두릅(장아찌용)'
            };

            for (let i = 1; i <= 2; i++) {
                const select = document.getElementById(`durup${i}`);
                if (select && select.value && select.value !== '0') {
                    summary += `${durupTypes[`durup${i}`]} : ${select.value}kg<br>`;
                }
            }
        }

        if (summary) {
            const total = this.calculateTotal();
            summary += `<br>총 금액: ${formatCurrency(total)}`;
            if (total < SHIPPING_THRESHOLD) {
                summary += `<br>(배송비 ${formatCurrency(SHIPPING_FEE)} 포함)`;
            }
        }

        summaryDiv.innerHTML = summary;
    }

    /**
     * Load available dates and product quantities
     */
    async loadAvailableDates() {
        const notifyElement = document.querySelector("#notify");
        if (notifyElement) {
            notifyElement.innerHTML = "";
        }

        try {
            const data = await apiService.loadOrder();

            const reserveDateSelect = document.getElementById('reserve_date');
            if (reserveDateSelect && data.availableDate) {
                reserveDateSelect.length = 2;

                data.availableDate.forEach(date => {
                    const option = new Option(formatDate(date), formatDate(date));
                    console.log(reserveDateSelect)
                    console.log(formatDate(date))
                    reserveDateSelect.add(option);
                });
            }

            for (let i = 1; i <= 5; i++) {
                const select = document.getElementById(`product${i}`);
                if (select) {
                    if (data[`product${i}`] !== "0") {
                        select.innerHTML = '<option value="0" disabled selected>갯수</option><option value="0">0개</option>';
                        const length = parseInt(data[`product${i}`]);
                        for (let j = 1; j <= length; j++) {
                            select.innerHTML += `<option value="${j}">${j}개</option>`;
                        }
                    } else {
                        select.innerHTML = '<option value="0" disabled selected>품절</option>';
                    }
                }
            }
        } catch (error) {
            console.error('Error loading order data:', error);
        }
    }

    /**
     * Submit order
     */
    async submitOrder() {
        const form = document.getElementById('orderForm');
        const loading = document.getElementById('loading');

        if (!form || !form.checkValidity()) {
            return;
        }

        const confirmed = window.confirm("주문을 제출하시겠습니까?");
        if (!confirmed) {
            return;
        }

        this.loadingInterval = startLoadingAnimation(loading, '주문 접수중');

        try {
            const formData = this.buildFormData();

            if (this.currentProductType === PRODUCT_TYPES.GOTGAM) {
                await apiService.submitGotgamOrder(formData);
            } else {
                await apiService.submitDurupOrder(formData);
            }

            this.showOrderResult(formData);
        } catch (error) {
            console.error('Error:', error);
            alert('주문 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            stopLoadingAnimation(loading, this.loadingInterval);
        }
    }

    /**
     * Build form data object
     */
    buildFormData() {
        const formData = {
            productType: this.currentProductType,
            sheetName: this.currentProductType === PRODUCT_TYPES.GOTGAM ? '응답' : '설문지 응답',
            orderDate: new Date().toISOString(),
            reserveDate: this.currentProductType === PRODUCT_TYPES.GOTGAM
                ? document.getElementById('reserve_date').value
                : '즉시배송',
            send_name: document.getElementById('send_name').value,
            send_contact: formatPhoneNumber(document.getElementById('send_contact').value),
            rcv_name: document.getElementById('rcv_name').value,
            rcv_contact: formatPhoneNumber(document.getElementById('rcv_contact').value),
            rcv_address: document.getElementById('rcv_address').value,
            request_etc: document.getElementById('request_etc').value,
            request_delivery: document.getElementById('request_delivery').value
        };

        if (this.currentProductType === PRODUCT_TYPES.GOTGAM) {
            for (let i = 1; i <= 5; i++) {
                const value = document.getElementById(`product${i}`).value;
                formData[`product${i}`] = value === "0" ? "" : value;
            }
        } else {
            for (let i = 1; i <= 2; i++) {
                const value = document.getElementById(`durup${i}`).value;
                formData[`durup${i}`] = value === "0" ? "" : value;
            }
        }

        formData.totalAmount = this.calculateTotal();

        return formData;
    }

    /**
     * Show order result
     */
    showOrderResult(formData) {
        toggleElement('intro', false);
        toggleElement('orderBox', false);
        toggleElement('result', true);

        document.getElementById('totalFee').textContent =
            `입금하실 금액 : ${formatCurrency(formData.totalAmount)}`;

        let orderDetails = '';

        // Show product details
        orderDetails += `<strong>주문 내역</strong><br>`;
        if (this.currentProductType === PRODUCT_TYPES.GOTGAM) {
            for (let i = 1; i <= 5; i++) {
                if (formData[`product${i}`]) {
                    orderDetails += `${i}호 : ${formData[`product${i}`]}개<br>`;
                }
            }
            orderDetails += `<br>발송일 : ${formData.reserveDate}<br>`;
        } else {
            const durupTypes = {
                durup1: '산두릅(참두릅)',
                durup2: '곁순두릅(장아찌용)'
            };
            for (let i = 1; i <= 2; i++) {
                if (formData[`durup${i}`]) {
                    orderDetails += `${durupTypes[`durup${i}`]} : ${formData[`durup${i}`]}kg<br>`;
                }
            }
        }

        // Show submitter information
        orderDetails += `<strong>주문자 정보</strong><br>`;
        orderDetails += `성함 : ${formData.send_name}<br>`;
        orderDetails += `연락처 : ${formData.send_contact}<br>`;

        // Show receiver information
        orderDetails += `<strong>받는 분 정보</strong><br>`;
        orderDetails += `성함 : ${formData.rcv_name}<br>`;
        orderDetails += `연락처 : ${formData.rcv_contact}<br>`;
        orderDetails += `주소 : ${formData.rcv_address}<br>`;

        // Show additional requests
        if (formData.request_etc) {
            orderDetails += `해청농원 요청사항 : ${formData.request_etc}<br>`;
        }
        if (formData.request_delivery) {
            orderDetails += `택배사 요청사항 : ${formData.request_delivery}<br><br>`;
        }

        document.querySelector('.orderReview').innerHTML = orderDetails;
    }

    /**
     * Start a new order
     */
    newOrder() {
        const answer = window.confirm("새 주문을 시작하시겠습니까? 기존 주문 정보는 다음 날부터 조회가능합니다!");
        if (answer) {
            location.reload();
        }
    }
}

// Initialize the page
const submitOrderPage = new SubmitOrderPage();

// Expose functions to global scope for HTML onclick handlers
window.submitOrder = () => submitOrderPage.submitOrder();
window.newOrder = () => submitOrderPage.newOrder();
window.copy_bankInfo = () => copyToClipboard(BANK_INFO, '계좌번호가 복사되었습니다!');
window.copy_phone = () => copyToClipboard(CONTACT_PHONE, '전화번호가 복사되었습니다!');
