// Modules
const TagManager = (function() {
    let tags = new Set();

    function addTag(tag) {
        tags.add(tag);
    }

    function removeTag(tag) {
        tags.delete(tag);
    }

    function getAllTags() {
        return Array.from(tags);
    }

    function getSuggestions(input) {
        const inputLower = input.toLowerCase();
        return getAllTags().filter(tag => tag.toLowerCase().includes(inputLower));
    }

    return { addTag, removeTag, getAllTags, getSuggestions };
})();

const FolderManager = (function() {
    let folders = new Map();

    function addFolder(folderPath) {
        const parts = folderPath.split('/').filter(Boolean);
        let currentLevel = folders;
        parts.forEach((part, index) => {
            if (!currentLevel.has(part)) {
                currentLevel.set(part, new Map());
            }
            if (index === parts.length - 1) {
                currentLevel.get(part).set('__bookmarks', []);
            }
            currentLevel = currentLevel.get(part);
        });
    }

    function removeFolder(folderPath) {
        const parts = folderPath.split('/').filter(Boolean);
        let currentLevel = folders;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!currentLevel.has(parts[i])) return;
            currentLevel = currentLevel.get(parts[i]);
        }
        currentLevel.delete(parts[parts.length - 1]);
    }

    function getAllFolders() {
        function traverse(node, path = '') {
            let result = [];
            for (let [key, value] of node.entries()) {
                if (key !== '__bookmarks') {
                    const newPath = path ? `${path}/${key}` : key;
                    result.push(newPath);
                    result = result.concat(traverse(value, newPath));
                }
            }
            return result;
        }
        return traverse(folders);
    }

    function getSuggestions(input) {
        const inputLower = input.toLowerCase();
        return getAllFolders().filter(folder => folder.toLowerCase().includes(inputLower));
    }

    function addBookmarkToFolder(folderPath, bookmarkId) {
        const parts = folderPath.split('/').filter(Boolean);
        let currentLevel = folders;
        parts.forEach((part, index) => {
            if (!currentLevel.has(part)) {
                currentLevel.set(part, new Map());
            }
            currentLevel = currentLevel.get(part);
        });
        if (!currentLevel.has('__bookmarks')) {
            currentLevel.set('__bookmarks', []);
        }
        currentLevel.get('__bookmarks').push(bookmarkId);
    }

    function removeBookmarkFromFolder(folderPath, bookmarkId) {
        const parts = folderPath.split('/').filter(Boolean);
        let currentLevel = folders;
        parts.forEach(part => {
            if (!currentLevel.has(part)) return;
            currentLevel = currentLevel.get(part);
        });
        if (currentLevel.has('__bookmarks')) {
            const bookmarks = currentLevel.get('__bookmarks');
            const index = bookmarks.indexOf(bookmarkId);
            if (index > -1) {
                bookmarks.splice(index, 1);
            }
        }
    }

    return { addFolder, removeFolder, getAllFolders, getSuggestions, addBookmarkToFolder, removeBookmarkFromFolder };
})();

// Main application
let bookmarks = [];
let editingIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
    loadBookmarks();
    displayBookmarks();
    updateFolderFilter();
    setupEventListeners();
    createToastContainer();
});

function setupEventListeners() {
    document.getElementById('addBookmark').addEventListener('click', () => openModal());
    document.getElementById('bookmarkForm').addEventListener('submit', saveBookmark);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('searchInput').addEventListener('input', filterBookmarks);
    document.getElementById('folderFilter').addEventListener('change', filterBookmarks);
    setupTagsAndFolders();
}

async function loadBookmarks() {
    try {
        const savedBookmarks = localStorage.getItem('bookmarks');
        if (savedBookmarks) {
            bookmarks = JSON.parse(savedBookmarks);
            bookmarks.forEach(bookmark => {
                bookmark.tags.forEach(tag => TagManager.addTag(tag));
                if (bookmark.folder) FolderManager.addFolder(bookmark.folder);
            });
        }
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        showToast('Error loading bookmarks. Please try again.', 'error');
    }
}

function saveBookmarksToStorage() {
    try {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        updateFolderFilter();
    } catch (error) {
        console.error('Error saving bookmarks:', error);
        showToast('Error saving bookmarks. Please try again.', 'error');
    }
}

function displayBookmarks(filteredBookmarks = bookmarks) {
    const bookmarkList = document.getElementById('bookmarkList');
    bookmarkList.innerHTML = '';

    filteredBookmarks.forEach((bookmark, index) => {
        const bookmarkElement = createBookmarkElement(bookmark, index);
        bookmarkList.appendChild(bookmarkElement);

        if (!bookmark.title || bookmark.title === cleanUpUrl(bookmark.url)) {
            fetchSiteTitle(bookmark.url).then(fetchedTitle => {
                bookmark.title = fetchedTitle;
                bookmarkElement.querySelector('.bookmark-title').textContent = fetchedTitle;
                saveBookmarksToStorage();
            });
        }
    });
}

function createBookmarkElement(bookmark, index) {
    const bookmarkElement = document.createElement('div');
    bookmarkElement.classList.add('bookmark');

    const infoElement = document.createElement('div');
    infoElement.classList.add('bookmark-info');

    const titleElement = document.createElement('a');
    titleElement.classList.add('bookmark-title');
    titleElement.href = bookmark.url;
    titleElement.textContent = bookmark.title;
    titleElement.target = '_blank';
    titleElement.rel = 'noopener noreferrer';
    titleElement.dataset.index = index;
    titleElement.addEventListener('click', (event) => {
        event.preventDefault();
        openBookmark(bookmark, index);
    });

    const detailsElement = document.createElement('p');
    detailsElement.classList.add('bookmark-details');
    detailsElement.textContent = `${bookmark.folder} | ${bookmark.tags.join(', ')} | Views: ${bookmark.views}`;

    infoElement.appendChild(titleElement);
    infoElement.appendChild(detailsElement);

    const actionsElement = document.createElement('div');
    actionsElement.classList.add('bookmark-actions');

    const editIcon = createActionIcon('fas fa-edit edit-icon', () => openModal(index));
    const deleteIcon = createActionIcon('fas fa-trash-alt delete-icon', () => deleteBookmark(index));

    actionsElement.appendChild(editIcon);
    actionsElement.appendChild(deleteIcon);

    bookmarkElement.appendChild(infoElement);
    bookmarkElement.appendChild(actionsElement);

    return bookmarkElement;
}

function createActionIcon(classes, clickHandler) {
    const icon = document.createElement('i');
    icon.className = classes;
    icon.addEventListener('click', clickHandler);
    return icon;
}

function openModal(index = -1) {
    editingIndex = index;
    const modal = document.getElementById('modal');
    const form = document.getElementById('bookmarkForm');
    const modalTitle = document.getElementById('modalTitle');
    const selectedTagsContainer = document.getElementById('selectedTags');

    form.reset();
    selectedTagsContainer.innerHTML = '';

    if (index === -1) {
        modalTitle.textContent = 'Add Bookmark';
    } else {
        modalTitle.textContent = 'Edit Bookmark';
        const bookmark = bookmarks[index];
        document.getElementById('url').value = bookmark.url;
        document.getElementById('title').value = bookmark.title;
        document.getElementById('folder').value = bookmark.folder;
        bookmark.tags.forEach(tag => addSelectedTag(tag));
    }

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    editingIndex = -1;
}

async function saveBookmark(event) {
    event.preventDefault();

    const url = sanitizeUrl(document.getElementById('url').value);
    const title = document.getElementById('title').value;
    const folder = document.getElementById('folder').value;
    const selectedTags = Array.from(document.getElementById('selectedTags').children).map(tag => tag.querySelector('.tag-text').textContent.trim());

    try {
        let fetchedTitle = title;
        if (!title) {
            fetchedTitle = await fetchSiteTitle(url);
        }

        const bookmark = {
            url,
            title: fetchedTitle,
            folder,
            tags: selectedTags,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            views: 0
        };

        if (editingIndex === -1) {
            bookmarks.push(bookmark);
            FolderManager.addBookmarkToFolder(folder, bookmarks.length - 1);
        } else {
            const oldBookmark = bookmarks[editingIndex];
            if (oldBookmark.folder !== folder) {
                FolderManager.removeBookmarkFromFolder(oldBookmark.folder, editingIndex);
                FolderManager.addBookmarkToFolder(folder, editingIndex);
            }
            bookmark.createdAt = oldBookmark.createdAt;
            bookmark.views = oldBookmark.views;
            bookmarks[editingIndex] = bookmark;
        }

        // Add tags to TagManager
        selectedTags.forEach(tag => TagManager.addTag(tag));

        // Add folder to FolderManager
        if (folder) {
            FolderManager.addFolder(folder);
        }

        saveBookmarksToStorage();
        displayBookmarks();
        closeModal();
        showToast('Bookmark saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving bookmark:', error);
        showToast('Error saving bookmark. Please try again.', 'error');
    }
}

function sanitizeUrl(url) {
    url = url.trim();
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
        url = 'https://' + url;
    }
    try {
        return new URL(url).toString();
    } catch (error) {
        console.error('Invalid URL:', error);
        return 'https://' + url;
    }
}

async function fetchSiteTitle(url) {
    try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + url;
        const response = await fetch(proxyUrl);
        const html = await response.text();
        const match = html.match(/<title>(.*?)<\/title>/i);
        return match ? match[1] : cleanUpUrl(url);
    } catch (error) {
        console.error('Error fetching site title:', error);
        return cleanUpUrl(url);
    }
}

function cleanUpUrl(url) {
    let cleanUrl = url.replace(/(https?:\/\/)?(www\.)?/, '');
    cleanUrl = cleanUrl.split('/')[0];
    return cleanUrl.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function setupTagsAndFolders() {
    setupInputSuggestions('tags', TagManager.getSuggestions, addSelectedTag);
    setupInputSuggestions('folder', FolderManager.getSuggestions, (folder) => {
        document.getElementById('folder').value = folder;
        document.getElementById('folderSuggestions').innerHTML = '';
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#tagSuggestions')) {
            document.getElementById('tagSuggestions').innerHTML = '';
        }
        if (!event.target.closest('#folderSuggestions')) {
            document.getElementById('folderSuggestions').innerHTML = '';
        }
    });

    // Prevent form submission on Enter key press in folder and tags inputs
    ['folder', 'tags'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
    });
}

function setupInputSuggestions(inputId, getSuggestions, onSelect) {
    const input = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(`${inputId}Suggestions`);
    let selectedIndex = -1;

    input.addEventListener('input', () => {
        const inputValue = input.value.trim().toLowerCase();
        if (inputValue) {
            const suggestions = getSuggestions(inputValue);
            displaySuggestions(suggestionsContainer, suggestions, onSelect);
        } else {
            suggestionsContainer.innerHTML = '';
        }
        selectedIndex = -1;
    });

    input.addEventListener('keydown', (event) => {
        const suggestions = suggestionsContainer.children;
        if (suggestions.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            selectedIndex = (selectedIndex + 1) % suggestions.length;
            updateSelectedSuggestion(suggestions, selectedIndex);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
            updateSelectedSuggestion(suggestions, selectedIndex);
        } else if (event.key === 'Enter' && selectedIndex !== -1) {
            event.preventDefault();
            onSelect(suggestions[selectedIndex].textContent);
            suggestionsContainer.innerHTML = '';
            selectedIndex = -1;
        }
    });

    // Handle tag input with comma separator
    if (inputId === 'tags') {
        input.addEventListener('keydown', (event) => {
            if (event.key === ',' || event.key === 'Enter') {
                event.preventDefault();
                const tagValue = input.value.trim();
                if (tagValue) {
                    addSelectedTag(tagValue);
                    input.value = '';
                }
            }
        });
    }
}

function updateSelectedSuggestion(suggestions, selectedIndex) {
    Array.from(suggestions).forEach((suggestion, index) => {
        suggestion.classList.toggle('selected', index === selectedIndex);
    });
}

function displaySuggestions(container, items, onSelect) {
    container.innerHTML = '';
    items.forEach(item => {
        const suggestionElement = document.createElement('div');
        suggestionElement.classList.add('suggestion');
        suggestionElement.textContent = item;
        suggestionElement.addEventListener('click', () => {
            onSelect(item);
            container.innerHTML = '';
        });
        container.appendChild(suggestionElement);
    });
}

function addSelectedTag(tag) {
    const selectedTagsContainer = document.getElementById('selectedTags');
    const tagElement = document.createElement('span');
    tagElement.classList.add('selected-tag');

    const tagText = document.createElement('span');
    tagText.classList.add('tag-text');
    tagText.textContent = tag;

    const removeButton = document.createElement('span');
    removeButton.classList.add('remove-tag');
    removeButton.textContent = '×';
    removeButton.addEventListener('click', () => {
        selectedTagsContainer.removeChild(tagElement);
    });

    tagElement.appendChild(tagText);
    tagElement.appendChild(removeButton);
    selectedTagsContainer.appendChild(tagElement);

    document.getElementById('tags').value = '';
    document.getElementById('tagSuggestions').innerHTML = '';
    TagManager.addTag(tag);
}

function deleteBookmark(index) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
        const bookmark = bookmarks[index];
        FolderManager.removeBookmarkFromFolder(bookmark.folder, index);
        bookmarks.splice(index, 1);
        saveBookmarksToStorage();
        displayBookmarks();
        showToast('Bookmark deleted successfully!', 'success');
    }
}

function filterBookmarks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedFolder = document.getElementById('folderFilter').value;

    const filteredBookmarks = bookmarks.filter(bookmark => {
        const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm) ||
                              bookmark.url.toLowerCase().includes(searchTerm) ||
                              bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        const matchesFolder = selectedFolder === '' || bookmark.folder.startsWith(selectedFolder);
        return matchesSearch && matchesFolder;
    });

    displayBookmarks(filteredBookmarks);
}

function updateFolderFilter() {
    const folderFilter = document.getElementById('folderFilter');
    const uniqueFolders = FolderManager.getAllFolders();
    const currentValue = folderFilter.value;
    
    folderFilter.innerHTML = '<option value="">All Folders</option>';
    uniqueFolders.forEach(folder => {
        if (folder) {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = folder;
            folderFilter.appendChild(option);
        }
    });

    // Restore the previously selected folder
    if (currentValue) {
        folderFilter.value = currentValue;
    }
}

function createToastContainer() {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '1000';
    document.body.appendChild(toastContainer);
}

function showToast(message, type) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Fade in
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);

    // Fade out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

function openBookmark(bookmark, index) {
    bookmark.views++;
    bookmarks[index] = bookmark;
    saveBookmarksToStorage();
    displayBookmarks();
    window.open(bookmark.url, '_blank');
}