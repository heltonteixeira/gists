// modalHandling.js

import { getElement } from './domElements.js';

export function openModal() {
    getElement('enlargedImageModal').classList.add("is-active");
}

export function closeModal() {
    getElement('enlargedImageModal').classList.remove("is-active");
}

export function handleModalClick(e) {
    const enlargedImageModal = getElement('enlargedImageModal');
    const enlargedImage = getElement('enlargedImage');
    if (e.target === enlargedImageModal || !enlargedImage.contains(e.target)) {
        closeModal();
    }
}