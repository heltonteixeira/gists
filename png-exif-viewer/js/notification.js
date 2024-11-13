// notification.js

export function showNotification(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = createToastElement(message, type);
    toastContainer.appendChild(toast);

    // Trigger reflow to enable transition
    toast.offsetHeight;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = getIconForType(type);

    const messageElement = document.createElement('span');
    messageElement.className = 'toast-message';
    messageElement.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.parentElement.removeChild(toast);
        }, 300);
    });

    toast.appendChild(icon);
    toast.appendChild(messageElement);
    toast.appendChild(closeButton);

    return toast;
}

function getIconForType(type) {
    switch (type) {
        case 'success': return '✔';
        case 'error': return '✖';
        case 'warning': return '⚠';
        case 'info':
        default: return 'ℹ';
    }
}