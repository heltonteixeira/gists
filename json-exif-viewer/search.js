// search.js
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function initializeSearch(data) {
    searchInput.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.trim();
        const isRegex = /^\/.*\/[a-z]*$/.test(searchTerm);
        const searchPattern = isRegex ? new RegExp(searchTerm.slice(1, -1), searchTerm.slice(-1) || 'i') : searchTerm.toLowerCase();
        const results = searchJSON(data, searchPattern, isRegex);
        displaySearchResults(results);
    }, 300));
}

function searchJSON(data, pattern, isRegex = false) {
    const results = [];

    function search(obj, path = []) {
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = [...path, key];
            if (typeof value === 'object' && value !== null) {
                search(value, currentPath);
            } else {
                const keyMatch = isRegex ? pattern.test(key) : key.toLowerCase().includes(pattern);
                const valueMatch = isRegex ? pattern.test(String(value)) : String(value).toLowerCase().includes(pattern);
                if (keyMatch || valueMatch) {
                    results.push({ path: currentPath.join('.'), key, value });
                }
            }
        }
    }

    search(data);
    return results;
}

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.textContent = 'No results found.';
        return;
    }

    const ul = document.createElement('ul');
    results.forEach(result => {
        const li = document.createElement('li');
        li.innerHTML = highlightSearchTerm(`${result.path}: ${result.key} = ${JSON.stringify(result.value)}`, searchInput.value.trim());
        ul.appendChild(li);
    });
    searchResults.appendChild(ul);
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}