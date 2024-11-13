// copyFunctionality.js

import { showNotification } from './notification.js';

export function handleCopyClick(e) {
    e.preventDefault();
    copyPromptAndParameters();
}

function copyPromptAndParameters() {
    const promptElement = document.querySelector(".metadata-item:nth-child(6) .metadata-value");
    const parametersElement = document.querySelector(".metadata-item:nth-child(7) .metadata-value");

    if (promptElement && parametersElement) {
        const textToCopy = `${promptElement.textContent} ${parametersElement.textContent}`;
        copyToClipboard(textToCopy);
    } else {
        showNotification("Prompt or Parameters not found.", "warning");
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification("Prompt and Parameters copied to clipboard!", "success");
            })
            .catch((err) => {
                console.error("Failed to copy using Clipboard API: ", err);
                fallbackCopyTextToClipboard(text);
            });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
        const successful = document.execCommand("copy");
        const msg = successful ? "successful" : "unsuccessful";
        showNotification(`Clipboard: Copying text command was ${msg}`, successful ? "success" : "warning");
    } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
        showNotification("Failed to copy text to clipboard.", "error");
    }

    document.body.removeChild(textArea);
}