import { apiService } from '../services/api.js';
import { validatePhoneNumber, checkPhoneNumberLength } from '../utils/validators.js';
import { startLoadingAnimation, stopLoadingAnimation, toggleElement } from '../utils/dom.js';

/**
 * Check Order Page Controller
 */
class CheckOrderPage {
    constructor() {
        this.loadingInterval = null;
        this.init();
    }

    /**
     * Initialize the page
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        const phoneNumberInput = document.querySelector("#phoneNumber");
        if (phoneNumberInput) {
            phoneNumberInput.addEventListener('input', () => this.validatePhoneInput());
        }
    }

    /**
     * Validate phone number input
     */
    validatePhoneInput() {
        const phoneNumberInput = document.querySelector("#phoneNumber");
        if (!phoneNumberInput) return;

        if (!checkPhoneNumberLength(phoneNumberInput.value, 4)) {
            alert("휴대폰 번호 마지막 4자리를 입력해주세요!");
            phoneNumberInput.value = "";
        }
    }

    /**
     * Validate form before submission
     */
    validateForm() {
        const phoneNumberInput = document.querySelector("#phoneNumber");
        if (!phoneNumberInput) return false;

        const phoneNumber = phoneNumberInput.value;

        if (!validatePhoneNumber(phoneNumber)) {
            alert('Invalid phone number format');
            return false;
        }

        return true;
    }

    /**
     * Check order
     */
    async checkOrder() {
        const nameInput = document.getElementById('name');
        const phoneNumberInput = document.getElementById('phoneNumber');
        const loadingElement = document.getElementById('loading');
        const resultElement = document.getElementById('result');

        if (!nameInput || !phoneNumberInput) {
            alert('필수 입력 항목이 누락되었습니다.');
            return;
        }

        const name = nameInput.value;
        const phoneNumber = phoneNumberInput.value;

        if (!name || !phoneNumber) {
            alert('이름과 전화번호를 입력해주세요.');
            return;
        }

        this.loadingInterval = startLoadingAnimation(loadingElement, 'Loading');

        try {
            const orders = await apiService.checkOrder(name, phoneNumber);

            stopLoadingAnimation(loadingElement, this.loadingInterval);

            if (orders.error) {
                resultElement.textContent = orders.error;
                toggleElement(resultElement, true);
            } else {
                this.displayOrders(orders);
            }
        } catch (error) {
            stopLoadingAnimation(loadingElement, this.loadingInterval);
            console.error('Error checking order:', error);
            resultElement.textContent = '오류가 발생하였습니다! 번호를 다시한번 확인해주세요!';
            toggleElement(resultElement, true);
        }
    }

    /**
     * Display orders
     */
    displayOrders(orders) {
        const resultDiv = document.getElementById('result');
        if (!resultDiv) return;

        resultDiv.innerHTML = `<h2>조회하신 결과, 총 ${orders.length}건의 주문이 확인되었습니다!</h2>`;
        toggleElement(resultDiv, true);

        orders.forEach((order, index) => {
            let orderListString = "";

            order.orderList.forEach((item, idx) => {
                if (item !== "") {
                    orderListString += `${idx + 1}번 선물세트 : ${item}개<br>`;
                }
            });

            const orderInfo = `
                <div>
                    <h4 class="orderHeader">주문 ${index + 1}</h4>
                    <p>주문자 성함: ${order.send_name}</p>
                    <p>휴대폰 번호: ${order.send_contact}</p>
                    <p id="expected_date">출고 예정일 : ${order.expected_date}<br>
                        (택배 도착일이 아닌 <strong>"발송일"</strong>지정 예약입니다.)<br>- 보통 영업일 기준 1~2일 후 도착합니다.
                    </p>
                    <p>받는 분 성함: ${order.rcv_name}</p>
                    <p>받는 분 연락처: ${order.rcv_contact}</p>
                    <p>받는 분 주소: ${order.rcv_address}</p>
                    <p>주문 내역:<br> ${orderListString}</p>
                    <p>총 금액(배송비 포함): ${order.totalFee}</p>
                </div>
            `;
            resultDiv.innerHTML += orderInfo;
        });
    }
}

// Initialize the page
const checkOrderPage = new CheckOrderPage();

// Expose function to global scope for HTML onclick handlers
window.checkOrder = () => checkOrderPage.checkOrder();
