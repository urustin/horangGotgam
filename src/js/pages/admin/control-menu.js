import { API_BASE_URL } from '../../config/constants.js';

/**
 * Admin Control Menu Page Controller
 * Manages available dates and product quantities
 */
class ControlMenuPage {
    constructor() {
        this.availableDates = [];
        this.init();
    }

    /**
     * Initialize the page
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadOrder();
            this.setupEventListeners();
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        const dateList = document.getElementById('dateList');
        if (dateList) {
            dateList.addEventListener('click', (e) => {
                if (e.target && e.target.matches('button.delete')) {
                    const itemBox = e.target.parentNode;
                    const buttons = Array.from(document.querySelectorAll('.delete'));
                    const index = buttons.indexOf(e.target);
                    this.deleteDate(e, index);
                    itemBox.parentNode.removeChild(itemBox);
                }
            });
        }
    }

    /**
     * Load order configuration
     */
    async loadOrder() {
        try {
            const response = await fetch(`${API_BASE_URL}/load-order`);
            const data = await response.json();

            document.querySelector("#currentYear").value = data.currentYear;
            document.querySelector("#orderAvailable").value = data.orderAvailable === "true" ? "예" : "아니요";
            document.querySelector("#product1").value = data.product1;
            document.querySelector("#product2").value = data.product2;
            document.querySelector("#product3").value = data.product3;
            document.querySelector("#product4").value = data.product4;
            document.querySelector("#product5").value = data.product5;

            this.availableDates = data.availableDate ? [...data.availableDate] : [];
            this.populateDates(this.availableDates);
        } catch (error) {
            console.error('Error loading order:', error);
        }
    }

    /**
     * Populate date list in UI
     */
    populateDates(datesArray) {
        const dateListDiv = document.getElementById('dateList');
        if (!dateListDiv) return;

        dateListDiv.innerHTML = '';

        datesArray.forEach(date => {
            const itemBox = document.createElement('div');
            itemBox.className = 'itemBox';

            const dateDiv = document.createElement('div');
            dateDiv.className = 'date';
            dateDiv.textContent = date;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.textContent = 'x';

            itemBox.appendChild(dateDiv);
            itemBox.appendChild(deleteButton);
            dateListDiv.appendChild(itemBox);
        });
    }

    /**
     * Update order configuration
     */
    async updateOrder() {
        try {
            const updateOrder = {
                currentYear: document.querySelector("#currentYear").value,
                orderAvailable: document.querySelector("#orderAvailable").value === "예" ? "true" : "false",
                product1: document.querySelector("#product1").value,
                product2: document.querySelector("#product2").value,
                product3: document.querySelector("#product3").value,
                product4: document.querySelector("#product4").value,
                product5: document.querySelector("#product5").value,
            };

            const response = await fetch(`${API_BASE_URL}/update-order`, {
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
            alert("업데이트 완료!");
            window.location.reload();
            console.log(data);
        } catch (error) {
            console.error('Error updating order:', error);
            alert("업데이트 중 오류가 발생했습니다.");
        }
    }

    /**
     * Add a new date
     */
    async addDate() {
        const addInput = document.querySelector("#add");
        if (!addInput) return;

        const add = addInput.value;
        const dateFormatRegex = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/;

        if (!dateFormatRegex.test(add)) {
            alert("'월/일' 형식으로 입력해주세요!");
            return;
        }

        if (add) {
            this.availableDates.push(add);
            this.availableDates.sort((a, b) => new Date(a) - new Date(b));

            try {
                const response = await fetch(`${API_BASE_URL}/add-date`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ availableDate: this.availableDates }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);
                this.loadOrder();
            } catch (error) {
                console.error('Error adding date:', error);
                alert("날짜 추가 중 오류가 발생했습니다.");
            }
        }
    }

    /**
     * Delete a date
     */
    async deleteDate(e, index) {
        const value = e.target.parentNode.querySelector('.date').innerHTML;

        try {
            const response = await fetch(`${API_BASE_URL}/delete-date`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ availableDate: value }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error deleting date:', error);
            alert("날짜 삭제 중 오류가 발생했습니다.");
        }
    }
}

// Initialize the page
const controlMenuPage = new ControlMenuPage();

// Expose functions to global scope for HTML onclick handlers
window.updateOrder = () => controlMenuPage.updateOrder();
window.addDate = () => controlMenuPage.addDate();
