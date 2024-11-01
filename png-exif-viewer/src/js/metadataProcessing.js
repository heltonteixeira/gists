// metadataProcessing.js

import { getElement } from './domElements.js';
import { formatKey } from './utils.js';

export function displayMetadata(metadata, exifData) {
    const metadataElement = getElement('metadata');
    metadataElement.innerHTML = "";

    if (exifData.Description) {
        const { prompt, parameters, jobId } = parseDescription(exifData.Description);
        Object.assign(metadata, { prompt, parameters, jobId });
    }

    if (exifData.Author) {
        metadata.author = exifData.Author;
    }

    for (const [key, value] of Object.entries(metadata)) {
        if (value) {
            const item = createMetadataItem(key, value);
            metadataElement.appendChild(item);
        }
    }

    getElement('metadataColumn').style.display = "block";
}

function parseDescription(description) {
    if (!description) return { prompt: "", parameters: "", jobId: "" };

    const jobIdMatch = description.match(/Job ID: (.+)$/);
    const jobId = jobIdMatch ? jobIdMatch[1].trim() : "";

    let [promptAndParams] = description.split(" Job ID:");
    promptAndParams = promptAndParams.trim();

    const firstParamIndex = promptAndParams.indexOf(" --");
    if (firstParamIndex === -1) {
        return { prompt: promptAndParams, parameters: "", jobId };
    }

    const prompt = promptAndParams.substring(0, firstParamIndex).trim();
    const parameters = promptAndParams.substring(firstParamIndex).trim();

    return { prompt, parameters, jobId };
}

function createMetadataItem(key, value) {
    const item = document.createElement("div");
    item.className = "metadata-item";
    item.innerHTML = `
    <span class="metadata-key">${formatKey(key)}:</span>
    <span class="metadata-value">${value}</span>
  `;
    return item;
}