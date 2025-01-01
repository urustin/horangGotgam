// fetch

// const searchBtn = document.querySelector("#searchBtn");
// const searchDate = document.querySelector("#searchDate");
// set date as today
// searchDate.valueAsDate = new Date();

async function submitOrder() {
    console.log(validate_form());

    try {
        startLoadingAnimation();
        const orderData = {
            sheetName: "응답",
            product1: document.querySelector("#product1").value==="0"?"":document.querySelector("#product1").value,
            product2: document.querySelector("#product2").value==="0"?"":document.querySelector("#product2").value,
            product3: document.querySelector("#product3").value==="0"?"":document.querySelector("#product3").value,
            product4: document.querySelector("#product4").value==="0"?"":document.querySelector("#product4").value,
            product5: document.querySelector("#product5").value==="0"?"":document.querySelector("#product5").value,
            productEtc: "",
            send_name: document.querySelector("#send_name").value,
            send_contact: document.querySelector("#send_contact").value.replaceAll("-",""),
            rcv_name: document.querySelector("#rcv_name").value,
            rcv_contact: document.querySelector("#rcv_contact").value.replaceAll("-",""),
            rcv_address: document.querySelector("#rcv_address").value,
            reserve_date: formatDate(document.querySelector("#reserve_date").value),
            request_etc: document.querySelector("#request_etc").value,
            request_delivery: document.querySelector("#request_delivery").value,
        };
        console.log(orderData);        
        // global
        const response = await fetch('https://ec2seoul.flaresolution.com/horang/submit-order', {
        // local
        // const response = await fetch('http://localhost:5008/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();
        console.log(data);

        hiddenOrder()
        const result = document.querySelector("#result");
        result.style.display = "block";
        stopLoadingAnimation();
    } catch (error) {
        stopLoadingAnimation();
        console.error('Error:', error);
    }
}


// copy bank info
function copy_bankInfo() {

    const copyText = "농협 352-1386-3306-83";
    navigator.clipboard.writeText(copyText).then(function(){
        alert( copyText +  "\n가 복사되었습니다!");
    })
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




// update price
function update_price(){
    
    let product1 = document.querySelector("#product1").value;
    let product2 = document.querySelector("#product2").value;
    let product3 = document.querySelector("#product3").value;
    let product4 = document.querySelector("#product4").value;
    let product5 = document.querySelector("#product5").value;
    const priceTag = document.querySelector("#priceTag");
    if(priceTag.classList.contains("none")){
        priceTag.classList.remove("none");
    }
    priceTag.innerHTML = "현재 금액 = "+ calculate_price(product1,product2,product3,product4,product5).toLocaleString() +"원<br>(50000원 이하<br>택배비 4000원)";
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




// load order


async function loadOrder() {
    document.querySelector("#notify").innerHTML="";
    try {
        const response = await fetch(`https://ec2seoul.flaresolution.com/horang/load-order`);
        // const response = await fetch(`http://localhost:5008/load-order`);
        const data = await response.json();
        console.log(data);
        

        const reserveDateSelect = document.getElementById('reserve_date');
        
        // Clear existing options, except for the first disabled "날짜 선택하기" option
        reserveDateSelect.length = 2; // Keep only the first option and remove the rest

        // Populate the select with new options from availableDate array
        data.availableDate.forEach(date => {
            const option = new Option(date, date); // Creating new option element with text and value set to 'date'
            reserveDateSelect.add(option);

        });
       
        // document.querySelector("#currentYear").innerHTML = data.currentYear;
        // document.querySelector("#nextYear").innerHTML = parseInt(data.currentYear)+1;


        // 마감 체크기능 임시삭제
        // console.log("data="+data);
        // if(data.orderAvailable==="true"){
        //     document.querySelector("#notify").innerHTML="";
        // }else{
        //     document.querySelector(".box_description").innerHTML="";
        //     document.querySelector("#orderBox").innerHTML="";
        //     document.querySelector(".result").innerHTML="";
        // };
        
        
        // document.querySelector("#startDate").value = data.startDate;
        // document.querySelector("#lastDate").value = data.lastDate;





        // product quantity
        for(let j=1;j<6;j++){
            let number = "product"+j;

            if(data[number]!=="0"){
                document.querySelector(`#product${j}`).innerHTML = `<option value="0" disabled selected>갯수</option><option value="0">0개</option>`;
                let length = parseInt(data[number]);
                for(let i=1;i<=length;i++){
                    console.log(i);
                    document.querySelector(`#product${j}`).innerHTML+=(`<option value=${i}>${i}개</option>`);
                }
            }else{
                document.querySelector(`#product${j}`).innerHTML = `<option value="0" disabled selected>품절</option>`;
            };
        }


        

        
        // document.querySelector("#product2").value = data.product2;
        // document.querySelector("#product3").value = data.product3;
        // document.querySelector("#product4").value = data.product4;
        // document.querySelector("#product5").value = data.product5;
    
        
    }
    catch(error){
        // console.error('Error:', error);
        console.log(`Error: ${error.message}`);
    }
}

loadOrder();

