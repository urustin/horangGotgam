import { PRODUCT_PRICES, SHIPPING_THRESHOLD, SHIPPING_FEE, PRODUCT_TYPES, BANK_INFO, CONTACT_PHONE, IS_AVAILABLE } from '../config/constants.js';
import { apiService } from '../services/api.js';
import { formatCurrency, formatPhoneNumber, getYears } from '../utils/formatters.js';
import { toggleElement, toggleClass, copyToClipboard, startLoadingAnimation, stopLoadingAnimation } from '../utils/dom.js';
import { formatDate } from '../utils/formatters.js';


/**
 * Submit Order Page Controller
 */
class SubmitOrderPage {
    constructor() {
        this.currentProductType = PRODUCT_TYPES; // or PRODUCT_TYPES.DURUP
        this.loadingInterval = null;

        this.init();
    }

    /**
     * Initialize the page
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            //유지보수
            alert("잠시 서버 유지보수를 위해 서비스가 일시정지됩니다! 조금 후에 시도해주세요! 1/17 밤 8시~9시")
            //
            this.renderIntroSection();
            this.setupYears();
            this.setupMenuVisibility();
            this.setupEventListeners();
            this.updatePrice();

            if (this.currentProductType === "gotgam") {
                this.loadAvailableDates();
            }
        });
    }

    /**
     * Render intro section based on product type
     */
    renderIntroSection() {
        const introDiv = document.getElementById('intro');
        if (!introDiv) return;

        if (this.currentProductType === "gotgam") {
            introDiv.innerHTML = `
                <div id="product_type_selector">
                    <h1>해청농원 주문하기</h1>
                </div>

                <!-- 곶감 소개 -->
                <div id="gotgam_intro" class="product_intro">
                    <div id="notify"></div>
                </div>

                <div class="box_description">
                    <!-- 곶감 설명 -->
                    <div id="gotgam_desc" class="product_desc">
                        <h4 style="font-weight: 700;">상세한 상품 설명과 안내사항을<br>꼭꼭꼭! 먼저 확인해주세요!<br>
                            <button id="btn_detail"><a href="https://blog.naver.com/sanzalag/222162521584">상세보기</a></button>
                        </h4>
                        <br>
                        <h4>
                            입금 후 다음날부터 주문내역을 조회하실 수 있습니다!
                            <button><a href="./checkOrder.html">주문 확인</a></button>
                        </h4>
                    </div>

                    <!-- 공통 설명 -->
                    <h3>
                        대량 주문이나 기타 문의사항은 카톡으로 연락주세요!
                        <button><a href="https://pf.kakao.com/_INxgzxb">해청농원 카카오톡</a></button>
                    </h3>
                    <h3>
                        입금 계좌를 확인/복사하시려면 눌러주세요!
                        <button><a href="./bankAccount.html">입금계좌 확인/복사하기</a></button>
                    </h3>
                </div>
            `;
        } else if (this.currentProductType === "durup") {
            introDiv.innerHTML = `
                <div id="product_type_selector">
                    <h1>해청농원 주문하기</h1>
                </div>

                <!-- 두릅 소개 -->
                <div id="durup_intro" class="product_intro">
                    <p style="line-height: 1.5; width: 90%; margin: 10px auto; font-size: 1.2rem;">
                        지리산 골짜기 산자락<br>
                        맑은 공기 머금고 자라난 산두릅.<br>
                    </p>
                </div>

                <div class="box_description">
                    <!-- 두릅 설명 -->
                    <div id="durup_desc" class="product_desc">
                        <img class="img1" src="./images/durup/1_1.jpg" alt="">
                        <p class="dsc">
                            가장 부드럽고 맛있는 때를 놓치지 않기 위해<br>
                            농장주가 직접 온종일 산기슭 오르내리며<br>
                            하나하나 소중히 채취한 귀한 참두릅을 소개합니다.<br>
                        </p>
                        <img class="img2" src="./images/durup/1_2.jpg" alt="">
                        <p class="dsc">
                            산기슭에서 자생하던 두릅이라<br>
                            다양한 품종이 섞여있고 모양이 불규칙합니다.<br>
                            시중의 밭에서 비료로 키운 두릅과 비교 불가!<br>
                            어디서도 드셔보시지 못한 향을 자부합니다.<br>
                        </p>
                    </div>

                    <!-- 공통 설명 -->
                    <h3>
                        대량 주문이나 기타 문의사항은 카톡으로 연락주세요!
                        <button><a href="https://pf.kakao.com/_INxgzxb">해청농원 카카오톡</a></button>
                    </h3>
                    <h3>
                        입금 계좌를 확인/복사하시려면 눌러주세요!
                        <button><a href="./bankAccount.html">입금계좌 확인/복사하기</a></button>
                    </h3>
                </div>
            `;
        }
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
        const isGotgam = this.currentProductType === "gotgam";

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
        if (this.currentProductType === "gotgam") {
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

        if (this.currentProductType === "gotgam") {
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

        if (this.currentProductType === "gotgam") {
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
        const descriptionElement = document.querySelector(".box_description");
        // Check if orders are not available
        if (!IS_AVAILABLE && notifyElement) {
            notifyElement.innerHTML = `
                <h4 style="margin-bottom: 10px;">안녕하세요! <span id="currentYear"></span>년 곶감 주문은 마감되었습니다!</h4>
                <h4 style="margin-bottom: 30px;"><span id="nextYear"></span>년 설날에 다시한번 뵈어요!</h4>
                <h4 style="margin-bottom: 10px;">내년 곶감 주문이 궁금하시다면</h4>
                <h4 style="margin-bottom: 30px;">카카오톡 플러스친구를 추가하시면 알람을 보내드립니다!</h4>
                <button><a href="https://pf.kakao.com/_INxgzxb">해청농원 카톡 플러스친구</a></button>
            `;
            descriptionElement.innerHTML=``
            
            // Re-apply year spans after adding the HTML
            this.setupYears();
            return;
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

            if (this.currentProductType === "gotgam") {
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
            sheetName: this.currentProductType === "gotgam" ? '응답' : '설문지 응답',
            orderDate: new Date().toISOString(),
            reserveDate: this.currentProductType === "gotgam"
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

        if (this.currentProductType === "gotgam") {
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
        if (this.currentProductType === "gotgam") {
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
