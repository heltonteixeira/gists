
// Suppress Mermaid console logging
mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        logLevel: 1,  // Set to lowest level
        securityLevel: 'strict',
        htmlLabels: true,
        fontSize: 16,
        suppressErrors: true,
        errorHandler: (error) => {
                // Custom error handler that prevents errors from reaching the console
                return;
        }
});

// Additional error suppression for Mermaid
window.addEventListener('error', function (e) {
        if (e.message.includes('Mermaid')) {
                e.preventDefault();
        }
});

// DOM Elements
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const copyBtn = document.getElementById('copyBtn');
const notification = document.querySelector('.notification-float');
const notificationMessage = notification.querySelector('.notification-message');
const charCount = document.querySelector('.char-count');
const tabs = document.querySelector('.tabs ul');
const tabContents = document.querySelectorAll('.content');

// Function to update diagram
async function updateDiagram() {
        try {
                preview.innerHTML = '';
                const diagramDiv = document.createElement('div');
                diagramDiv.className = 'mermaid';
                diagramDiv.textContent = editor.value;
                preview.appendChild(diagramDiv);
                await mermaid.init(undefined, '.mermaid');
        } catch (error) {
                preview.innerHTML = `<div class="notification is-danger is-light">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Please check your diagram syntax
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>`;
        }
}

// Function to show notification
function showNotification(message, type = 'is-success') {
        notification.classList.remove('is-success', 'is-danger', 'is-warning', 'is-info');
        notification.classList.add(type);
        notificationMessage.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
                notification.style.display = 'none';
        }, 3000);
}

// Function to copy to clipboard
async function copyToClipboard() {
        try {
                await navigator.clipboard.writeText(editor.value);
                const originalHTML = copyBtn.innerHTML;
                copyBtn.classList.remove('is-info');
                copyBtn.classList.add('is-success');
                copyBtn.innerHTML = `
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="icon">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <i class="fas fa-check"></i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span>Copied!</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        `;
                setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.classList.remove('is-success');
                        copyBtn.classList.add('is-info');
                }, 2000);
        } catch (err) {
                console.error('Failed to copy:', err);
                showNotification('Failed to copy text to clipboard', 'is-danger');
        }
}

// Function to update character count
function updateCharCount() {
        const count = editor.value.length;
        charCount.textContent = `${count} characters`;
}

// Debounce function
function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
                const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
        };
}

// Create debounced update function
const debouncedUpdate = debounce(() => {
        updateDiagram();
        updateCharCount();
}, 500);

// Tab switching functionality
function switchTab(tabName) {
        // Update tab active states
        tabs.querySelectorAll('li').forEach(tab => {
                if (tab.dataset.tab === tabName) {
                        tab.classList.add('is-active');
                } else {
                        tab.classList.remove('is-active');
                }
        });

        // Update content visibility
        tabContents.forEach(content => {
                if (content.id === `${tabName}Tab`) {
                        content.classList.remove('is-hidden');
                        if (tabName === 'preview') {
                                updateDiagram();
                        }
                } else {
                        content.classList.add('is-hidden');
                }
        });
}

// Event Listeners
editor.addEventListener('input', debouncedUpdate);
copyBtn.addEventListener('click', copyToClipboard);

tabs.addEventListener('click', (e) => {
        const tab = e.target.closest('li');
        if (tab) {
                switchTab(tab.dataset.tab);
        }
});

notification.querySelector('.delete').addEventListener('click', () => {
        notification.style.display = 'none';
});

// Initial render
updateDiagram();
updateCharCount();
