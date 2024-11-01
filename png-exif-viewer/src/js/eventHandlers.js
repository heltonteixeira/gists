// eventHandlers.js

import { getElement } from './domElements.js';
import { handleFile } from './fileProcessing.js';
import { openModal, closeModal, handleModalClick } from './modalHandling.js';
import { handleCopyClick } from './copyFunctionality.js';

export function initializeEventListeners() {
    const elements = {
        imagePreview: getElement('imagePreview'),
        closeModal: getElement('closeModal'),
        dropZone: getElement('dropZone'),
        fileInput: getElement('fileInput'),
        enlargedImageModal: getElement('enlargedImageModal'),
        copyButton: getElement('copyButton')
    };

    elements.imagePreview.addEventListener("click", openModal);
    elements.closeModal.addEventListener("click", closeModal);
    elements.dropZone.addEventListener("click", () => elements.fileInput.click());
    elements.dropZone.addEventListener("dragover", handleDragOver);
    elements.dropZone.addEventListener("dragleave", handleDragLeave);
    elements.dropZone.addEventListener("drop", handleFileDrop);
    elements.fileInput.addEventListener("change", handleFileSelect);
    elements.enlargedImageModal.addEventListener("click", handleModalClick);
    elements.copyButton.addEventListener("click", handleCopyClick);
    document.addEventListener('paste', handlePaste);
}

function handleDragOver(e) {
    e.preventDefault();
    getElement('dropZone').classList.add("is-hovered");
}

function handleDragLeave() {
    getElement('dropZone').classList.remove("is-hovered");
}

function handleFileDrop(e) {
    e.preventDefault();
    getElement('dropZone').classList.remove("is-hovered");
    const file = e.dataTransfer.files[0];
    handleFile(file);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    handleFile(file);
}

function handlePaste(e) {
    e.preventDefault();
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            handleFile(blob);
            break;  // Only handle the first image if multiple are pasted
        }
    }
}