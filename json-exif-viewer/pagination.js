// pagination.js

let jsonData = null;
let currentPage = 1;
let itemsPerPage = 10;

function displayJson(data) {
    jsonData = data;
    currentPage = 1;
    displayPage(currentPage);
    createPaginationControls();
}

function displayPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = jsonData.slice(startIndex, endIndex);
    fileDisplay.textContent = JSON.stringify(pageData, null, 2);
}

function createPaginationControls() {
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(jsonData.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
        });
        paginationControls.appendChild(pageButton);
    }
}