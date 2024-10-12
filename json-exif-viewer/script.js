// script.js
const fileInput = document.getElementById('fileInput');
const fileDisplay = document.getElementById('fileDisplay');
const paginationControls = document.getElementById('paginationControls');
const editButton = document.getElementById('editButton');
const saveButton = document.getElementById('saveButton');
const exportButton = document.getElementById('exportButton');
const filterInput = document.getElementById('filterInput');
const treeView = document.getElementById('treeView');

let jsonData = null;

fileInput.addEventListener('change', handleFileInput);
editButton.addEventListener('click', () => makeEditable(fileDisplay));
saveButton.addEventListener('click', () => saveChanges(fileDisplay));
exportButton.addEventListener('click', () => exportJSON('json'));
filterInput.addEventListener('input', handleFilterInput);

// Check for preloaded JSON file
function loadPreloadedJSON() {
    // Check index.html for a preloaded JSON file
    const preloadedScript = document.querySelector('script[type="application/json"]');
    if (preloadedScript) {
        try {
            jsonData = JSON.parse(preloadedScript.textContent);
            displayFileContent(jsonData);
            createTreeView(jsonData, treeView);
            initializeSearch(jsonData);
            return;
        } catch (error) {
            handleError('Error parsing preloaded JSON', error);
        }
    }

    // Check for metadata.json file in the current directory
    fetch('metadata.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            displayFileContent(jsonData);
            createTreeView(jsonData, treeView);
            initializeSearch(jsonData);
        })
        .catch(error => {
            // No preloaded JSON file found, keep existing behavior
            handleFileInput({ target: { files: [] } });
        });
}

loadPreloadedJSON();

function handleFileInput(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            jsonData = JSON.parse(event.target.result);
            displayFileContent(jsonData);
            createTreeView(jsonData, treeView);
            initializeSearch(jsonData);
        } catch (error) {
            handleError('Invalid JSON file', error);
        }
    };

    reader.onerror = (error) => {
        handleError('Error reading file', error);
    };

    reader.readAsText(file);
}

function displayFileContent(data) {
    fileDisplay.innerHTML = syntaxHighlight(JSON.stringify(data, null, 2));
}

function handleError(message, error) {
    fileDisplay.textContent = `${message}. Error: ${error.message}`;
    console.error(`${message}:`, error);
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function createTreeView(data, container) {
    container.innerHTML = '';
    const ul = document.createElement('ul');
    container.appendChild(ul);

    function createNode(key, value) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = key;
        li.appendChild(span);

        if (typeof value === 'object' && value !== null) {
            span.classList.add('caret');
            span.addEventListener('click', function () {
                this.classList.toggle('caret-down');
                this.parentElement.querySelector('.nested').classList.toggle('active');
            });
            const nestedUl = document.createElement('ul');
            nestedUl.classList.add('nested');
            li.appendChild(nestedUl);
            for (const [k, v] of Object.entries(value)) {
                createNode(k, v).forEach(child => nestedUl.appendChild(child));
            }
        } else {
            span.textContent += ': ' + JSON.stringify(value);
        }

        return [li];
    }

    for (const [key, value] of Object.entries(data)) {
        createNode(key, value).forEach(node => ul.appendChild(node));
    }
}

function makeEditable(element) {
    element.contentEditable = true;
    element.focus();
}

function saveChanges(element) {
    element.contentEditable = false;
    try {
        jsonData = JSON.parse(element.textContent);
        displayFileContent(jsonData);
        createTreeView(jsonData, treeView);
    } catch (error) {
        handleError('Invalid JSON', error);
    }
}

function exportJSON(format) {
    if (!jsonData) {
        alert('No JSON data to export');
        return;
    }

    let output;
    switch (format) {
        case 'json':
            output = JSON.stringify(jsonData, null, 2);
            break;
        case 'csv':
            output = convertJSONtoCSV(jsonData);
            break;
        case 'xml':
            output = convertJSONtoXML(jsonData);
            break;
        default:
            throw new Error('Unsupported format');
    }

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export.${format}`;
    a.click();
    URL.revokeObjectURL(url);
}

function convertJSONtoCSV(json) {
    const items = json;
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(items[0]);
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv = csv.join('\r\n');
    return csv;
}

function convertJSONtoXML(json) {
    let xml = '';
    for (const key in json) {
        xml += json[key] instanceof Array ? '' : "<" + key + ">";
        if (json[key] instanceof Array) {
            for (const array in json[key]) {
                xml += "<" + key + ">";
                xml += convertJSONtoXML(new Object(json[key][array]));
                xml += "</" + key + ">";
            }
        } else if (typeof json[key] == "object") {
            xml += convertJSONtoXML(new Object(json[key]));
        } else {
            xml += json[key];
        }
        xml += json[key] instanceof Array ? '' : "</" + key + ">";
    }
    return xml.replace(/<\/?[0-9]{1,}>/g, '');
}

function handleFilterInput(event) {
    const filterCriteria = event.target.value.trim().toLowerCase();
    if (filterCriteria === '') {
        displayFileContent(jsonData);
        createTreeView(jsonData, treeView);
        return;
    }

    const filteredData = filterJSON(jsonData, filterCriteria);
    displayFileContent(filteredData);
    createTreeView(filteredData, treeView);
}

function filterJSON(data, criteria) {
    if (typeof data !== 'object' || data === null) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => filterJSON(item, criteria)).filter(item => item !== undefined);
    }

    const result = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
            const filteredValue = filterJSON(value, criteria);
            if (Object.keys(filteredValue).length > 0) {
                result[key] = filteredValue;
            }
        } else if (String(value).toLowerCase().includes(criteria) || key.toLowerCase().includes(criteria)) {
            result[key] = value;
        }
    }

    return result;
}

// Initialize search functionality
function initializeSearch(data) {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const results = searchJSON(data, searchTerm);
        displaySearchResults(results);
    }, 300));
}

function searchJSON(data, term) {
    const results = [];

    function search(obj, path = []) {
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = [...path, key];
            if (typeof value === 'object' && value !== null) {
                search(value, currentPath);
            } else if (String(value).toLowerCase().includes(term) || key.toLowerCase().includes(term)) {
                results.push({ path: currentPath.join('.'), key, value });
            }
        }
    }

    search(data);
    return results;
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.textContent = 'No results found.';
        return;
    }

    const ul = document.createElement('ul');
    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = `${result.path}: ${result.key} = ${JSON.stringify(result.value)}`;
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