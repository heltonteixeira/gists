// utils.js

export function formatFileSize(bytes) {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
}

export function formatKey(key) {
    return key
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
}