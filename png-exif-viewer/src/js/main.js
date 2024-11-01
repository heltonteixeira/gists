// main.js

import { initializeEventListeners } from './eventHandlers.js';
import { initializeDOMElements } from './domElements.js';
import { showNotification } from './notification.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    initializeEventListeners();

    // Test the new notification system
    showNotification('PNG EXIF Viewer is ready!', 'info');
});