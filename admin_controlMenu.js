
let availableDates = [];

async function loadOrder() {

    try {
        // const response = await fetch(`https://ec2.flaresolution.com/load-order`);
        const response = await fetch(`http://localhost:5008/load-order`);
        const data = await response.json();
        console.log(data);

        document.querySelector("#currentYear").value = data.currentYear;
        document.querySelector("#orderAvailable").value = data.orderAvailable;
        // document.querySelector("#startDate").value = data.startDate;
        // document.querySelector("#lastDate").value = data.lastDate;
        document.querySelector("#product1").value = data.product1;
        document.querySelector("#product2").value = data.product2;
        document.querySelector("#product3").value = data.product3;
        document.querySelector("#product4").value = data.product4;
        document.querySelector("#product5").value = data.product5;
    
        availableDates = data.availableDate ? [...data.availableDate] : [];
        populateDates(availableDates);
    }
    catch(error){
        // console.error('Error:', error);
        console.log(`Error: ${error.message}`);
    }
}


function populateDates(datesArray) {
    const dateListDiv = document.getElementById('dateList');
    dateListDiv.innerHTML = ''; // Clear existing content

    datesArray.forEach(date => {
        // Create the container div
        const itemBox = document.createElement('div');
        itemBox.className = 'itemBox';

        // Create the date div
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.textContent = date;

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'x';
        // Optionally, add an event listener to the delete button here

        // Append the date div and delete button to the itemBox
        itemBox.appendChild(dateDiv);
        itemBox.appendChild(deleteButton);

        // Append the itemBox to the dateListDiv
        dateListDiv.appendChild(itemBox);
    });
}

// initial load
loadOrder();


async function updateOrder() {
    try {

        const updateOrder = {
            currentYear: document.querySelector("#currentYear").value,
            orderAvailable: document.querySelector("#orderAvailable").value,
            
            product1: document.querySelector("#product1").value,
            product2: document.querySelector("#product2").value,
            product3: document.querySelector("#product3").value,
            product4: document.querySelector("#product4").value,
            product5: document.querySelector("#product5").value,

        };    
        // global
        // const response = await fetch('https://ec2.flaresolution.com/update-order', {
        // local
        const response = await fetch('http://localhost:5008/update-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateOrder),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);


    } catch (error) {

        console.log(`Error: ${error.message}`);
    }
}
async function addDate() {
    let add = document.querySelector("#add").value; // Get the value to add

    // Validate the date format using a regular expression
    // This regex matches strings like "1/31", "12/1", etc.
    let dateFormatRegex = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/;

    if (!dateFormatRegex.test(add)) {
        alert("'월/일' 형식으로 입력해주세요!");
        return; // Abort the function
    }

    if(add) {
        // Add the new date to the array and sort
        availableDates.push(add);
        availableDates.sort((a, b) => new Date(a) - new Date(b)); // Sort assuming 'MM/DD' format, adjust if format differs
        
        // Here you might update the frontend list to reflect the new sorted dates
        // For example, re-render the list of dates in the UI
        
        // Then, send the updated list back to the server
        try {
            const response = await fetch('http://localhost:5008/add-date', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({availableDate: availableDates}), // Adjust based on how the server expects the data
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            loadOrder();
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }
}

async function deleteDate(e,index) {
    // console.log(e);

    let value = (e.target.parentNode.querySelector('.date').innerHTML);
    // console.log(index);
    let date = [value,index];
    // 
    const response = await fetch('http://localhost:5008/delete-date', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ availableDate: date[0] }),
        });

    //error
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    //return value
    const data = await response.json();
    console.log(data);

}

// const btn_delete = document.querySelectorAll(".delete");
// for(let i=0;i<btn_delete.length;i++){
//     btn_delete[i].addEventListener("click", (e) => {deleteDate(e, i)});
// }


document.getElementById('dateList').addEventListener('click', function(e) {
    // console.log(e.target.matches('.delete'));
    if (e.target && e.target.matches('button.delete')) {
        const itemBox = e.target.parentNode;
        const buttons = Array.from(document.querySelectorAll('.delete'));
        const index = buttons.indexOf(e.target);
        deleteDate(e,index);
        itemBox.parentNode.removeChild(itemBox);
        // console.log(index);
        
    }
});