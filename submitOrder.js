// fetch

// const searchBtn = document.querySelector("#searchBtn");
// const searchDate = document.querySelector("#searchDate");
// set date as today
// searchDate.valueAsDate = new Date();

// Product prices and configuration
const PRODUCT_PRICES = {
    gotgam: {
        product1: 32000,
        product2: 43000,
        product3: 63000,
        product4: 85000,
        product5: 110000
    },
    durup: {
        durup1: 25000,
        durup2: 15000
    }
};

const SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 4000;

const current = 'gotgam'; // Current product type ('gotgam' or 'durup')
// const current = 'durup';

const develop = false; // Set to false for production
// const develop = true;

// Get base URL based on environment
function getBaseUrl() {
    return develop ? 'http://localhost:5008' : 'https://ec2seoul.flaresolution.com/horang';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set current year
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    const currentYearElements = document.querySelectorAll('#currentYear');
    const nextYearElements = document.querySelectorAll('#nextYear');
    
    currentYearElements.forEach(el => el.textContent = currentYear);
    nextYearElements.forEach(el => el.textContent = nextYear);

    // Initialize menu based on current value
    ['intro', 'desc', 'products','outro'].forEach(section => {
        document.getElementById(`gotgam_${section}`).style.display = current === 'gotgam' ? 'block' : 'none';
        document.getElementById(`durup_${section}`).style.display = current === 'durup' ? 'block' : 'none';
    });
    
    // Show/hide date selector (only for gotgam)
    document.getElementById('gotgam_date').style.display = current === 'gotgam' ? 'block' : 'none';
    
    // Update required fields
    const reserveDateSelect = document.getElementById('reserve_date');
    if (reserveDateSelect) {
        reserveDateSelect.required = current === 'gotgam';
    }

    // Initial price update
    update_price();
    
    // Load available dates for gotgam
    if (current === 'gotgam') {
        loadOrder();
    }
});

// Calculate total price
function calculate_total() {
    let total = 0;
    
    if (current === 'gotgam') {
        // Calculate gotgam products
        for (let i = 1; i <= 5; i++) {
            const select = document.getElementById(`product${i}`);
            if (select && select.value) {
                total += PRODUCT_PRICES.gotgam[`product${i}`] * parseInt(select.value);
            }
        }
    } else {
        // Calculate durup products
        for (let i = 1; i <= 2; i++) {
            const select = document.getElementById(`durup${i}`);
            if (select && select.value) {
                total += PRODUCT_PRICES.durup[`durup${i}`] * parseInt(select.value);
            }
        }
    }
    
    // Add shipping fee if total is below threshold
    if (total > 0 && total < SHIPPING_THRESHOLD) {
        total += SHIPPING_FEE;
    }
    
    return total;
}

// Update price display
function update_price() {
    const total = calculate_total();
    const priceTag = document.getElementById('priceTag');
    
    if (total > 0) {
        priceTag.classList.remove('none');
        priceTag.innerHTML = `현재 금액 : ${total.toLocaleString()}원<br>` +
            (total < SHIPPING_THRESHOLD ? `(${SHIPPING_THRESHOLD.toLocaleString()}원 이하<br>택배비 ${SHIPPING_FEE.toLocaleString()}원)` : '');
    } else {
        priceTag.classList.add('none');
    }
    
    update_summary();
}

// Update order summary
function update_summary() {
    const summaryDiv = document.querySelector('.summary_order');
    let summary = '';
    
    if (current === 'gotgam') {
        // Gotgam summary
        for (let i = 1; i <= 5; i++) {
            const select = document.getElementById(`product${i}`);
            if (select && select.value && select.value !== '0') {
                summary += `${i}호 : ${select.value}개<br>`;
            }
        }
    } else {
        // Durup summary
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
        const total = calculate_total();
        summary += `<br>총 금액: ${total.toLocaleString()}원`;
        if (total < SHIPPING_THRESHOLD) {
            summary += `<br>(배송비 ${SHIPPING_FEE.toLocaleString()}원 포함)`;
        }
    }
    
    summaryDiv.innerHTML = summary;
}

// Form submission
async function submitOrder() {
    const form = document.getElementById('orderForm');
    const loading = document.getElementById('loading');
    
    if (!form.checkValidity()) {
        return;
    }
    
    // Add confirmation dialog
    const confirmed = window.confirm("주문을 제출하시겠습니까?");
    if (!confirmed) {
        return;
    }
    
    loading.style.display = 'block';
    
    try {
        const formData = {
            productType: current,
            sheetName: current === 'gotgam' ? '응답' : '설문지 응답',
            orderDate: new Date().toISOString(),
            reserveDate: current === 'gotgam' ? document.getElementById('reserve_date').value : '즉시배송',
            send_name: document.getElementById('send_name').value,
            send_contact: document.getElementById('send_contact').value.replaceAll("-", ""),
            rcv_name: document.getElementById('rcv_name').value,
            rcv_contact: document.getElementById('rcv_contact').value.replaceAll("-", ""),
            rcv_address: document.getElementById('rcv_address').value,
            request_etc: document.getElementById('request_etc').value,
            request_delivery: document.getElementById('request_delivery').value
        };
        
        // Add product quantities based on product type
        if (current === 'gotgam') {
            for (let i = 1; i <= 5; i++) {
                formData[`product${i}`] = document.getElementById(`product${i}`).value === "0" ? "" : document.getElementById(`product${i}`).value;
            }
        } else {
            for (let i = 1; i <= 2; i++) {
                formData[`durup${i}`] = document.getElementById(`durup${i}`).value === "0" ? "" : document.getElementById(`durup${i}`).value;
            }
        }
        
        formData.totalAmount = calculate_total();
        
        // Choose the appropriate endpoint based on product type and environment
        const endpoint = `${getBaseUrl()}${current === 'gotgam' ? '/submit-order' : '/submit-order-durup'}`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        showOrderResult(formData);
    } catch (error) {
        console.error('Error:', error);
        alert('주문 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        loading.style.display = 'none';
    }
}

// Show order result
function showOrderResult(formData) {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('orderBox').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    
    document.getElementById('totalFee').textContent = 
        `입금하실 금액 : ${formData.totalAmount.toLocaleString()}원`;
    
    let orderDetails = '';
    if (current === 'gotgam') {
        for (let i = 1; i <= 5; i++) {
            if (formData[`product${i}`]) {
                orderDetails += `${i}호 : ${formData[`product${i}`]}개<br>`;
            }
        }
        orderDetails += `<br>발송일 : ${formData.reserveDate}`;
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
    
    orderDetails += `<br>받는분 : ${formData.rcv_name}<br>`;
    orderDetails += `연락처 : ${formData.rcv_contact}<br>`;
    orderDetails += `주소 : ${formData.rcv_address}<br>`;
    
    if (formData.request_etc) {
        orderDetails += `<br>해청농원 요청사항 : ${formData.request_etc}<br>`;
    }
    if (formData.request_delivery) {
        orderDetails += `택배사 요청사항 : ${formData.request_delivery}`;
    }
    
    document.querySelector('.orderReview').innerHTML = orderDetails;
}

// Helper functions
function copy_bankInfo() {
    const bankInfo = "농협 352-1386-3306-83 이광호";
    navigator.clipboard.writeText(bankInfo)
        .then(() => alert('계좌번호가 복사되었습니다!'))
        .catch(err => console.error('복사 실패:', err));
}

function copy_phone() {
    const phone = "01090609281";
    navigator.clipboard.writeText(phone)
        .then(() => alert('전화번호가 복사되었습니다!'))
        .catch(err => console.error('복사 실패:', err));
}

function newOrder() {
    document.getElementById('orderBox').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('orderForm').reset();
    update_price();
}

// Load available dates and product quantities for gotgam
async function loadOrder() {
    document.querySelector("#notify").innerHTML = "";
    try {
        const response = await fetch(`${getBaseUrl()}/load-order`);
        const data = await response.json();
        
        // Update available dates
        const reserveDateSelect = document.getElementById('reserve_date');
        if (reserveDateSelect && data.availableDate) {
            // Clear existing options except the first one
            reserveDateSelect.length = 2;
            
            // Add new date options
            data.availableDate.forEach(date => {
                const option = new Option(date, date);
                reserveDateSelect.add(option);
            });
        }
        
        // Update product quantities
        if (data) {
            for (let i = 1; i <= 5; i++) {
                const select = document.getElementById(`product${i}`);
                if (select) {
                    if (data[`product${i}`] !== "0") {
                        select.innerHTML = '<option value="0" disabled selected>갯수</option><option value="0">0개</option>';
                        const length = parseInt(data[`product${i}`]);
                        for (let j = 1; j <= length; j++) {
                            select.innerHTML += `<option value=${j}>${j}개</option>`;
                        }
                    } else {
                        select.innerHTML = '<option value="0" disabled selected>품절</option>';
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error loading order data:', error);
    }
}

function reviewOrder(){
    const orderReview = document.querySelector(".orderReview");
    const product1 = document.querySelector("#product1").value;
    const product2 = document.querySelector("#product2").value;
    const product3 = document.querySelector("#product3").value;
    const product4 = document.querySelector("#product4").value;
    const product5 = document.querySelector("#product5").value;
    let price = calculate_price(product1,product2,product3,product4,product5);

    const orderList = [product1,product2,product3,product4,product5];
    let orderListString ="";

    orderList.map((item,idx)=>{
        if(item!=="0"){
            orderListString+= `${idx + 1}번 선물세트 : ${item}개<br>`;
        }
        return orderListString;
    })
    
    const order = {
        send_name: document.querySelector("#send_name").value,
        send_contact: document.querySelector("#send_contact").value,
        rcv_name: document.querySelector("#rcv_name").value,
        rcv_contact: document.querySelector("#rcv_contact").value,
        rcv_address: document.querySelector("#rcv_address").value,
        reserve_date: document.querySelector("#reserve_date").value,
        request_etc: document.querySelector("#request_etc").value,
        request_delivery: document.querySelector("#request_delivery").value
    };
    const orderInfo = `
            <div>
                <p>주문자 성함: ${order.send_name}</p>
                <p>휴대폰 번호: ${order.send_contact}</p>
                <p id="expected_date">출고 예정일 : ${order.reserve_date}<br>
                    (택배 도착일이 아닌 <strong>"발송일"</strong>지정 예약입니다.)<br>- 보통 영업일 기준 1~2일 후 도착합니다.
                </p>
                <p>받는 분 성함: ${order.rcv_name}</p>
                <p>받는 분 연락처: ${order.rcv_contact}</p>
                <p>받는 분 주소: ${order.rcv_address}</p>
                <p>주문 내역:<br> ${orderListString}</p>
                <p>총 금액(배송비 포함): ${price.toLocaleString('ko-KR')+"원"}</p>
            </div>
        `;
        orderReview.innerHTML += orderInfo;

    const totalFee = document.querySelector("#totalFee");
    totalFee.innerHTML = "입금하실 금액 : "+ price.toLocaleString('ko-KR')+"원";
    
}

function calculate_price(item1,item2,item3,item4,item5){
    let price =0;
    price = (item1*32000)+(item2*43000)+(item3*63000)+(item4*85000)+(item5*110000);
    if(price<=50000){
        price+=4000;
    }
    return price;
}

// submit-> reset
function hiddenOrder(){

    reviewOrder();

    const orderBox = document.querySelector("#orderBox");
    const descriptionBox = document.querySelector(".box_description");
    
    orderBox.innerHTML = "";
    orderBox.style.marginBottom="0";
    descriptionBox.innerHTML ="";

    

}

let product1 = document.querySelector("#product1");
let product2 = document.querySelector("#product2");
let product3 = document.querySelector("#product3");
let product4 = document.querySelector("#product4");
let product5 = document.querySelector("#product5");

product1.addEventListener("oninput",update_price);
product2.addEventListener("oninput",update_price);
product3.addEventListener("oninput",update_price);
product4.addEventListener("oninput",update_price);

// loading

function startLoadingAnimation() {
    let loadingInterval = "";
    const loadingElement = document.getElementById('loading');
    let dots = 0;
    loadingElement.innerText = `주문 접수중`;
    
    loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4; // Cycle from 0 to 3
        loadingElement.innerText = "주문 접수중" + '.'.repeat(dots);
    }, 200); // Update every 200 milliseconds
}

function stopLoadingAnimation() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) { // 요소가 존재하는 경우에만 실행
        loadingElement.innerText = "";
        loadingElement.style.display = 'none';
    }
}

// newOrder

function newOrder(){
    let answer = window.confirm("새 주문을 시작하시겠습니까? 기존 주문 정보는 다음 날부터 조회가능합니다!")
    if(answer){
        location.reload();
    }else{

    }
}

function validate_form(){
    
    const reserve_date = document.querySelector("#reserve_date");
    console.log(reserve_date.value);
    if(reserve_date.value === ""){
        alert("배송날짜가 누락되었습니다!");
    }
    
}

function formatDate(dateString) {
    // 현재 연도를 가져옵니다.
    if(dateString ==="가능한 빨리(1월초 순차배송)"){
        return "가능한빨리";
    }
    const currentYear = 2025;

    // 주어진 날짜 문자열에 현재 연도를 추가하여 Date 객체 생성
    const date = new Date(`${dateString}/${currentYear}`);

    // 요일을 한글로 변환하는 배열
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    // 월, 일, 요일 포매팅
    const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일(${weekdays[date.getDay()]})`;

    return formattedDate;
}