// fileProcessing.js

import { isPngFile, parsePngChunks } from './pngParsing.js';
import { displayMetadata } from './metadataProcessing.js';
import { displayImagePreview } from './imagePreview.js';
import { showNotification } from './notification.js';

export async function handleFile(file) {
    if (file.type !== "image/png") {
        showNotification("Please select a PNG file.", "error");
        return;
    }

    try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const uint8Array = new Uint8Array(arrayBuffer);

        if (!isPngFile(uint8Array)) {
            showNotification("Invalid PNG file.", "error");
            return;
        }

        const { metadata, exifData } = parsePngChunks(uint8Array, file);
        displayMetadata(metadata, exifData);
        await displayImagePreview(file);
        showNotification("File processed successfully.", "success");
    } catch (error) {
        console.error("Error processing file:", error);
        if (error.name === 'NotReadableError') {
            if (file.name.endsWith('.zip') || file.type === 'application/zip') {
                showNotification("Cannot read files within ZIP archives. Please extract the PNG file and try again.", "error");
            } else {
                showNotification("The file could not be read. This may be due to permission issues or the file being in use by another program.", "error");
            }
        } else {
            showNotification("An unexpected error occurred while processing the file.", "error");
        }
    }
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => {
            console.error("FileReader error:", error);
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}