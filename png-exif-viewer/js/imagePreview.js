// imagePreview.js

import { getElement } from './domElements.js';

export async function displayImagePreview(file) {
    const dataUrl = await readFileAsDataURL(file);
    const imagePreview = getElement('imagePreview');
    const enlargedImage = getElement('enlargedImage');

    imagePreview.src = dataUrl;
    enlargedImage.src = dataUrl;
    getElement('imagePreviewColumn').style.display = "block";
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}