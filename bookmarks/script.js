// DOM Elements
const elements = {};
const elementIds = [
    'searchToggle', 'searchContainer', 'searchBar', 'searchButton', 'addToggle',
    'quickAddContainer', 'quickAddForm', 'bookmarkUrl', 'bookmarkTitle',
    'bookmarkCategory', 'bookmarkTags', 'bookmarks', 'editModal', 'editForm',
    'closeEditModal', 'categoriesToggle', 'recentToggle', 'categoriesSection',
    'categoriesList', 'recentSection', 'recentBookmarks', 'bookmarkList', 'homeLink'
];

// Storage module
const storage = {
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    load: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (error) {
            console.error('Error loading data from storage:', error);
            return [];
        }
    }
};

// Bookmarks array
let bookmarks = [];

// Helper functions
const saveBookmarks = () => storage.save('bookmarks', bookmarks);

const sanitizeUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    try {
        return new URL(url).href;
    } catch (error) {
        console.error('Invalid URL:', url);
        return null;
    }
};

const getTitleFromUrl = (url) => {
    try {
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
    } catch (error) {
        console.error('Error parsing URL:', error);
        return url;
    }
};

const toggleContainer = (container) => {
    container.classList.toggle('active');
    if (container.classList.contains('active')) {
        container.querySelector('input')?.focus();
    }
    if (container === elements.searchContainer && !container.classList.contains('active')) {
        clearSearchAndDisplayAll();
    }
};

const closeModal = (modal) => {
    modal.classList.remove('active');
    if (modal === elements.editModal) {
        elements.editForm.reset();
    }
    if (modal === elements.searchContainer || modal === elements.quickAddContainer) {
        modal.classList.remove('active');
    }
};

// Bookmark functions
const addBookmark = (e) => {
    e.preventDefault();
    const url = sanitizeUrl(elements.bookmarkUrl.value);
    if (!url) {
        alert('Please enter a valid URL');
        return;
    }

    const title = elements.bookmarkTitle.value.trim() || getTitleFromUrl(url);
    const category = elements.bookmarkCategory.value.trim();
    const tags = elements.bookmarkTags.value
        ? elements.bookmarkTags.value.split(',').map(tag => tag.trim())
        : [];

    bookmarks.push({ url, title, category, tags, dateAdded: new Date().toISOString() });
    saveBookmarks();
    elements.quickAddForm.reset();
    updateDisplay();
    closeModal(elements.quickAddContainer);
};

const createBookmarkElement = (bookmark, index) => `
    <li data-index="${index}">
        <div class="bookmark-content">
            <img src="https://www.google.com/s2/favicons?domain=${bookmark.url}" alt="Favicon" class="favicon">
            <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
            <span class="category">${bookmark.category || ''}</span>
            <span class="tags">${bookmark.tags ? bookmark.tags.join(', ') : ''}</span>
        </div>
        <div class="bookmark-actions">
            <button class="edit-bookmark" data-index="${index}">Edit</button>
            <button class="delete-bookmark" data-index="${index}">Delete</button>
        </div>
    </li>
`;

const renderBookmarks = (bookmarksToRender, container) => {
    container.innerHTML = bookmarksToRender.length === 0
        ? '<li class="no-bookmarks">No bookmarks found.</li>'
        : bookmarksToRender.map((bookmark, index) => createBookmarkElement(bookmark, index)).join('');
};

const displayBookmarks = () => {
    renderBookmarks(bookmarks, elements.bookmarks);
    initSortable();
};

const initSortable = () => {
    if (typeof Sortable !== 'undefined') {
        new Sortable(elements.bookmarks, {
            animation: 150,
            onEnd: function() {
                const newOrder = Array.from(elements.bookmarks.children).map(li => parseInt(li.dataset.index));
                bookmarks = newOrder.map(index => bookmarks[index]);
                saveBookmarks();
            }
        });
    } else {
        console.error('Sortable library is not loaded');
    }
};

const deleteBookmark = (index) => {
    bookmarks.splice(index, 1);
    saveBookmarks();
    updateDisplay();
};

const editBookmark = (index) => {
    const bookmark = bookmarks[index];
    const editForm = elements.editForm;

    editForm.elements.editUrl.value = bookmark.url;
    editForm.elements.editTitle.value = bookmark.title;
    editForm.elements.editCategory.value = bookmark.category;
    editForm.elements.editTags.value = bookmark.tags.join(', ');

    editForm.dataset.editIndex = index;
    elements.editModal.classList.add('active');
};

const saveEditedBookmark = (e) => {
    e.preventDefault();
    const index = parseInt(elements.editForm.dataset.editIndex, 10);
    const bookmark = bookmarks[index];
    const editForm = elements.editForm;

    const newUrl = sanitizeUrl(editForm.elements.editUrl.value);
    if (!newUrl) {
        alert('Please enter a valid URL');
        return;
    }

    bookmark.url = newUrl;
    bookmark.title = editForm.elements.editTitle.value.trim() || getTitleFromUrl(newUrl);
    bookmark.category = editForm.elements.editCategory.value.trim();
    bookmark.tags = editForm.elements.editTags.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

    saveBookmarks();
    updateDisplay();
    closeModal(elements.editModal);
};

const searchBookmarks = () => {
    const searchTerm = elements.searchBar.value.toLowerCase();
    const filteredBookmarks = bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.url.toLowerCase().includes(searchTerm) ||
        bookmark.category.toLowerCase().includes(searchTerm) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    showSection('bookmarkList');
    renderBookmarks(filteredBookmarks, elements.bookmarks);
};

const clearSearchAndDisplayAll = () => {
    elements.searchBar.value = '';
    showSection('bookmarkList');
    displayBookmarks();
};

// Categories functions
const displayCategories = () => {
    const categories = bookmarks.reduce((acc, bookmark) => {
        const category = bookmark.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(bookmark);
        return acc;
    }, {});

    const categoriesHtml = Object.entries(categories).map(([category, categoryBookmarks]) => `
        <li class="category-item">
            <span class="category-name">${category} (${categoryBookmarks.length})</span>
            <ul class="category-bookmarks">
                ${categoryBookmarks.map((bookmark, index) => createBookmarkElement(bookmark, bookmarks.indexOf(bookmark))).join('')}
            </ul>
        </li>
    `).join('');

    elements.categoriesList.innerHTML = categoriesHtml || '<li class="no-bookmarks">No categories found.</li>';

    // Add click event listeners to toggle category bookmarks
    document.querySelectorAll('.category-item').forEach(item => {
        item.querySelector('.category-name').addEventListener('click', function(e) {
            e.stopPropagation();
            this.closest('.category-item').querySelector('.category-bookmarks').classList.toggle('active');
        });
    });
};

// Recent bookmarks functions
const displayRecentBookmarks = () => {
    const sortedBookmarks = [...bookmarks].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    const groupedBookmarks = groupBookmarksByTimePeriod(sortedBookmarks);

    const recentHtml = Object.entries(groupedBookmarks)
        .filter(([_, periodBookmarks]) => periodBookmarks.length > 0)
        .map(([period, periodBookmarks]) => `
            <div class="time-period">
                <h3>${period}</h3>
                <ul>
                    ${periodBookmarks.map((bookmark, index) => createBookmarkElement(bookmark, bookmarks.indexOf(bookmark))).join('')}
                </ul>
            </div>
        `).join('');

    elements.recentBookmarks.innerHTML = recentHtml || '<p class="no-bookmarks">No recent bookmarks found.</p>';
};

const groupBookmarksByTimePeriod = (bookmarks) => {
    const now = new Date();
    const groups = {
        'Today': [],
        'Yesterday': [],
        'This Week': [],
        'This Month': [],
        'Older': []
    };

    bookmarks.forEach(bookmark => {
        const date = new Date(bookmark.dateAdded);
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            groups['Today'].push(bookmark);
        } else if (diffDays === 1) {
            groups['Yesterday'].push(bookmark);
        } else if (diffDays <= 7) {
            groups['This Week'].push(bookmark);
        } else if (diffDays <= 30) {
            groups['This Month'].push(bookmark);
        } else {
            groups['Older'].push(bookmark);
        }
    });

    return groups;
};

// Event Listeners
const addListener = (element, event, handler) => {
    if (element) {
        element.addEventListener(event, handler);
    }
};

const setupEventListeners = () => {
    addListener(elements.quickAddForm, 'submit', addBookmark);
    addListener(elements.searchButton, 'click', searchBookmarks);
    addListener(elements.searchBar, 'input', searchBookmarks);
    addListener(elements.searchToggle, 'click', (e) => {
        e.preventDefault();
        toggleContainer(elements.searchContainer);
    });
    addListener(elements.addToggle, 'click', (e) => {
        e.preventDefault();
        toggleContainer(elements.quickAddContainer);
    });
    addListener(elements.editForm, 'submit', saveEditedBookmark);
    addListener(elements.closeEditModal, 'click', () => closeModal(elements.editModal));

    // Handle navigation links
    addListener(elements.homeLink, 'click', (e) => {
        e.preventDefault();
        showSection('bookmarkList');
    });

    addListener(elements.categoriesToggle, 'click', (e) => {
        e.preventDefault();
        showSection('categoriesSection');
    });

    addListener(elements.recentToggle, 'click', (e) => {
        e.preventDefault();
        showSection('recentSection');
    });

    // Event delegation for edit and delete buttons
    const handleBookmarkActions = (e) => {
        if (e.target.classList.contains('delete-bookmark')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            deleteBookmark(index);
        } else if (e.target.classList.contains('edit-bookmark')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            editBookmark(index);
        }
    };

    addListener(elements.bookmarks, 'click', handleBookmarkActions);
    addListener(elements.categoriesList, 'click', handleBookmarkActions);
    addListener(elements.recentBookmarks, 'click', handleBookmarkActions);

    // Close modals when clicking outside
    addListener(window, 'click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
        if (!elements.searchContainer.contains(e.target) && !elements.searchToggle.contains(e.target)) {
            closeModal(elements.searchContainer);
        }
        if (!elements.quickAddContainer.contains(e.target) && !elements.addToggle.contains(e.target)) {
            closeModal(elements.quickAddContainer);
        }
    });

    // Prevent closing containers when clicking inside
    [elements.searchContainer, elements.quickAddContainer, elements.editModal].forEach(modal => {
        addListener(modal.querySelector('.modal-content') || modal, 'click', (e) => {
            e.stopPropagation();
        });
    });
};

// Show section
const showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.remove('hidden');
    activeSection.classList.add('active');
    updateDisplay(sectionId);
};

// Update display
const updateDisplay = (sectionId) => {
    switch(sectionId) {
        case 'bookmarkList':
            displayBookmarks();
            break;
        case 'categoriesSection':
            displayCategories();
            break;
        case 'recentSection':
            displayRecentBookmarks();
            break;
        default:
            displayBookmarks();
    }
};

// Initialize app
const initApp = () => {
    elementIds.forEach(id => {
        elements[id] = document.getElementById(id);
        if (!elements[id]) {
            console.error(`Element not found: ${id}`);
        }
    });

    bookmarks = storage.load('bookmarks');
    setupEventListeners();
    showSection('bookmarkList');
};

// Run the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);