// domElements.js

let elements = {};

export function initializeDOMElements() {
    elements = {
        dropZone: document.getElementById("dropZone"),
        fileInput: document.getElementById("fileInput"),
        errorAlert: document.getElementById("errorAlert"),
        imagePreviewColumn: document.getElementById("imagePreviewColumn"),
        metadataColumn: document.getElementById("metadataColumn"),
        enlargedImageModal: document.getElementById("enlargedImageModal"),
        enlargedImage: document.getElementById("enlargedImage"),
        closeModal: document.getElementById("closeModal"),
        imagePreview: document.getElementById("imagePreview"),
        copyButton: document.getElementById("copyButton"),
        metadata: document.getElementById("metadata")
    };
}

export function getElement(elementName) {
    return elements[elementName];
}

export function getAllElements() {
    return elements;
}