import { API_BASE_URL } from '../../config/constants.js';
import { startLoadingAnimation, stopLoadingAnimation } from '../../utils/dom.js';

/**
 * Admin Print Page Controller
 * For viewing and printing orders
 */
class PrintPage {
    constructor() {
        this.hoverColor = "rgba(0,0,0,0.8)";
        this.clickColor = "rgba(255,255,255,0.4)";
        this.loadingInterval = null;
        this.init();
    }

    /**
     * Initialize the page
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupInitialDate();
            this.setupEventListeners();
        });

        window.addEventListener("load", () => this.lockOrientation());
    }

    /**
     * Set up initial date
     */
    setupInitialDate() {
        const searchDate = document.querySelector("#searchDate");
        if (searchDate) {
            searchDate.valueAsDate = new Date();
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        const searchBtn = document.querySelector("#searchBtn");
        if (searchBtn) {
            searchBtn.addEventListener("click", () => this.fetchData());
        }
    }

    /**
     * Lock screen orientation to landscape
     */
    lockOrientation() {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch((error) => {
                console.log('Orientation lock not supported:', error);
            });
        }
    }

    /**
     * Handle row hover
     */
    hover(e) {
        const target = e.target;
        let row;

        if (target.parentNode.className === "flex-subrow") {
            row = target.parentNode.parentNode.parentNode.parentNode;
            row.style.backgroundColor = this.hoverColor;
            row.style.color = "white";
            if (row.children[1]) {
                row.children[1].style.color = "white";
            }
        } else {
            row = target.parentNode.parentNode;
            row.style.backgroundColor = this.hoverColor;
            row.style.color = "white";
            if (row.children[1]) {
                row.children[1].style.backgroundColor = this.hoverColor;
                row.children[1].style.color = "white";
            }
        }
    }

    /**
     * Handle row release (mouse out)
     */
    release(e) {
        const target = e.target;
        let row;

        if (target.parentNode.className === "flex-subrow") {
            row = target.parentNode.parentNode.parentNode.parentNode;
            if (!row.classList.contains("clicked")) {
                row.style.backgroundColor = "white";
                row.style.color = this.hoverColor;
                if (row.children[1]) {
                    row.children[1].style.color = this.hoverColor;
                }
            }
        } else if (target.parentNode.parentNode.classList.contains("flex-row")) {
            row = target.parentNode.parentNode;
            if (!row.classList.contains("clicked")) {
                row.style.backgroundColor = "white";
                row.style.color = this.hoverColor;
                if (row.children[1]) {
                    row.children[1].style.backgroundColor = "white";
                    row.children[1].style.color = this.hoverColor;
                }
            }
        }
    }

    /**
     * Handle row click
     */
    click(e) {
        const target = e.target;
        let row;

        if (target.parentNode.className === "flex-subrow") {
            row = target.parentNode.parentNode.parentNode.parentNode;
        } else {
            row = target.parentNode.parentNode;
        }

        if (row.classList.contains("clicked")) {
            row.classList.remove("clicked");
            this.release(e);
        } else {
            row.classList.add("clicked");
        }
    }

    /**
     * Fetch and display order data
     */
    async fetchData() {
        const searchDate = document.querySelector("#searchDate");
        const table = document.querySelector(".flex-table");
        const header = document.querySelector(".flex-header");
        const dateBox = document.querySelector("#date");
        const loadingElement = document.getElementById('loading');

        if (!searchDate || !table || !header) return;

        table.innerHTML = "";
        table.append(header);

        // console.log(searchDate.value)
        const formattedDate = this.formatDate(searchDate.value);
        // console.log(formattedDate)

        try {
            this.loadingInterval = startLoadingAnimation(loadingElement, searchDate.value + " 조회중");

            if (dateBox) {
                dateBox.innerHTML = "현재 보고계시는 날짜 : " + searchDate.value;
            }
            
            const response = await fetch(
                `${API_BASE_URL}/get-all-data?formattedDate=${(formattedDate)}`
            );
            const data = await response.json();

            data.forEach((item, index) => {
                const temp = document.createElement("div");
                temp.classList.add("flex-row");
                temp.innerHTML = `
                    <div class="showing">
                        <div class="flex-cell">${item[6].includes(item[8]) || item[8].includes(item[6]) ? "" : item[6]}</div>
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
                `;

                table.append(temp);

                const cells = temp.querySelectorAll(".flex-cell");
                cells.forEach(cell => {
                    cell.addEventListener("mouseover", (e) => this.hover(e));
                    cell.addEventListener("mouseout", (e) => this.release(e));
                    cell.addEventListener("click", (e) => this.click(e));
                });
            });

            stopLoadingAnimation(loadingElement, this.loadingInterval);
        } catch (error) {
            stopLoadingAnimation(loadingElement, this.loadingInterval);
            console.error('Error fetching data:', error);
        }
    }

    /**
     * Format date from YYYY-MM-DD to M/D
     */
    formatDate(dateString) {
        const dateParts = dateString.split("-");
        const month = parseInt(dateParts[1], 10);
        const day = parseInt(dateParts[2], 10);
        return `${month}/${day}`;
    }
}

// Initialize the page
new PrintPage();
