// hover

let cell = document.querySelectorAll(".flex-cell");

const hoverColor = "rgba(0,0,0,0.8)";
const clickColor = "rgba(255,255,255,0.4)";

function hover(e){
    // e.target
    if(e.target.parentNode.className === "flex-subrow"){
        // 
        e.target.parentNode.parentNode.parentNode.parentNode.style.backgroundColor = hoverColor;
        e.target.parentNode.parentNode.parentNode.parentNode.style.color = "white";
        // for-notshow
        e.target.parentNode.parentNode.parentNode.parentNode.children[1].style.color = "white";
        
    }else{
        // 
        e.target.parentNode.parentNode.style.backgroundColor = hoverColor;
        e.target.parentNode.parentNode.style.color = "white";
        //for not-showing
        e.target.parentNode.parentNode.children[1].style.backgroundColor = hoverColor;
        e.target.parentNode.parentNode.children[1].style.color = "white";
        
        
    }
    // console.log(e.target.parentNode.className);
}
function release(e){

    if(e.target.parentNode.className === "flex-subrow" && !e.target.parentNode.parentNode.parentNode.parentNode.classList.contains("clicked")){
        e.target.parentNode.parentNode.parentNode.parentNode.style.backgroundColor = "white";
        e.target.parentNode.parentNode.parentNode.parentNode.style.color = hoverColor;
        // for not-showing
        
        e.target.parentNode.parentNode.parentNode.parentNode.children[1].style.color = hoverColor;
        
    }else
    if(e.target.parentNode.parentNode.classList.contains("flex-row") && !e.target.parentNode.parentNode.classList.contains("clicked")){
        e.target.parentNode.parentNode.style.backgroundColor = "white";
        e.target.parentNode.parentNode.style.color = hoverColor;
        // for not-showing
        e.target.parentNode.parentNode.children[1].style.backgroundColor = "white";
        e.target.parentNode.parentNode.children[1].style.color = hoverColor;
    }
}

function click(e){

    if(e.target.parentNode.className === "flex-subrow"){
        if(e.target.parentNode.parentNode.parentNode.parentNode.classList.contains("clicked")){
            e.target.parentNode.parentNode.parentNode.parentNode.classList.remove("clicked");
            release(e);
        }else{
            e.target.parentNode.parentNode.parentNode.parentNode.classList.add("clicked");
        }
    }else{
        if(e.target.parentNode.parentNode.classList.contains("clicked")){
            e.target.parentNode.parentNode.classList.remove("clicked");
            release(e);
        }else{
            e.target.parentNode.parentNode.classList.add("clicked");
        }
    }
}



// fetch

const searchBtn = document.querySelector("#searchBtn");
const searchDate = document.querySelector("#searchDate");
// set date as today
searchDate.valueAsDate = new Date();

async function fetchData() {

    const table = document.querySelector(".flex-table");
    const header = document.querySelector(".flex-header");
    const dateBox = document.querySelector("#date");
    console.log(header);
    table.innerHTML="";
    table.append(header);

    let formattedDate = formatDate(searchDate.value);
    
    console.log(formattedDate);
    
    try {
        startLoadingAnimation();
        dateBox.innerHTML = "현재 보고계시는 날짜 : "+searchDate.value;
        // local
        // const response = await fetch(`http://localhost:5008/get-all-data?formattedDate=${encodeURIComponent(formattedDate)}`);

        // global
        const response = await fetch(`https://ec2.flaresolution.com/get-all-data?formattedDate=${encodeURIComponent(formattedDate)}`);        
        const data = await response.json();

        // console.log(data);
        
        data.map((item,index)=>{
            // console.log(item);

            let temp = document.createElement("div");
            temp.classList.add("flex-row");
            temp.innerHTML= 
            `
            <div class="showing">
                <div class="flex-cell">${item[6].includes(item[8])||item[8].includes(item[6])? "" : item[6]}</div>
                <div class="flex-cell">${item[8]}</div>
                <div class="flex-cell">${item[14]}</div>
                <div class="flex-cell">${item[15]}</div>
                <div class="flex-cell">${item[16]}</div>
                <div class="flex-cell">${item[17]}</div>
                <div class="flex-cell">${item[18]}</div>
                <div class="flex-cell">${item[19]}</div>
                <div class="flex-cell">${item[24]}</div>

            </div>
            <div class="not-showing"> 
                <div class="flex-cell">${item[1]}</div>
                <div class="flex-cell">${item[2]}</div>
                <div class="flex-cell">${item[3]}</div>
                <div class="flex-cell">${item[4]}</div>
                <div class="flex-cell">${item[5]}</div>
                <div class="flex-cell">${item[6]}</div>
                <div class="flex-cell">${item[7]}</div>
                <div class="flex-cell">${item[8]}</div>
                <div class="flex-cell">${item[9]}</div>
                <div class="flex-cell">${item[10]}</div>
                <div class="flex-cell">${item[11]}</div>
                <div class="flex-cell">${item[12]}</div>
                <div class="flex-cell">${item[13]}</div>
                <div class="flex-cell">${item[14]}</div>
                <div class="flex-cell">${item[15]}</div>
                <div class="flex-cell">${item[16]}</div>
                <div class="flex-cell">${item[17]}</div>
                <div class="flex-cell">${item[18]}</div>
                <div class="flex-cell">${item[19]}</div>
                <div class="flex-cell">${item[20]}</div>
                <div class="flex-cell">${item[21]}</div>
                <div class="flex-cell">${item[22]}</div>
                <div class="flex-cell">${item[23]}</div>
                <div class="flex-cell">${item[24]}</div>
            </div>
            `
        
            // console.log(table);
            table.append(temp);

            cell = document.querySelectorAll(".flex-cell");
            for(let i=47;i<cell.length;i++){
                cell[i].addEventListener("mouseover",hover);
                cell[i].addEventListener("mouseout",release);
                cell[i].addEventListener("click",click);
            }
            stopLoadingAnimation();
        })
        
        // 보낸 이 : data[0][6]
        // 받는 이 : data[0][8]
        // fill in
        // document.querySelector()

    } catch (error) {
        stopLoadingAnimation();
        console.error('Error fetching data:', error);
        
    }
}

function formatDate(dateString) {
    let dateParts = dateString.split("-");
    // let year = dateParts[0];
    let month = parseInt(dateParts[1], 10); // Convert to integer and remove leading zeros
    let day = parseInt(dateParts[2], 10); // Convert to integer and remove leading zeros

    return `${month}/${day}`;
}


searchBtn.addEventListener("click",fetchData);



// lock orientation
function lock(){
    console.log("lock");
    screen.orientation.lock('landscape');
}
window.addEventListener("load", lock);




// loading interval


function startLoadingAnimation() {
    const loadingElement = document.getElementById('loading');
    loadingElement.innerHTML = "";
    document.getElementById('loading').style.display = 'block';
    let loadingInterval = "";
    
    let dots = 0;
    let date = searchDate.value;
    console.log(date);
    loadingElement.innerHTML = date+ `조회중`;
    
    loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4; // Cycle from 0 to 3
        loadingElement.innerText = date + "조회중" + '.'.repeat(dots);
    }, 200); // Update every 200 milliseconds
}

function stopLoadingAnimation() {
    const loadingElement = document.getElementById('loading');
    loadingElement.innerText ="";
    document.getElementById('loading').style.display = 'none';
}