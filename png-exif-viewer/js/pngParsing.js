// pngParsing.js

import { PNG_SIGNATURE, CHUNK_TYPES } from './constants.js';
import { formatFileSize, formatDate } from './utils.js';

export function isPngFile(uint8Array) {
    return PNG_SIGNATURE.every((byte, index) => uint8Array[index] === byte);
}

export function parsePngChunks(uint8Array, file) {
    let offset = 8; // Skip PNG signature
    const metadata = initializeMetadata(file);
    const exifData = {};

    while (offset < uint8Array.length) {
        const { length, chunkType, chunkData } = readChunk(uint8Array, offset);
        offset += length + 12; // 4 (length) + 4 (type) + length + 4 (CRC)

        switch (chunkType) {
            case CHUNK_TYPES.HEADER:
                metadata.imageSize = parseImageSize(chunkData);
                break;
            case CHUNK_TYPES.TEXT:
            case CHUNK_TYPES.INTERNATIONAL_TEXT:
                parseTextChunk(chunkType, chunkData, exifData);
                break;
        }
    }

    return { metadata, exifData };
}

function initializeMetadata(file) {
    return {
        name: file.name,
        fileSize: formatFileSize(file.size),
        creationTime: formatDate(file.lastModified),
        imageSize: "",
        author: "",
        prompt: "",
        parameters: "",
        jobId: "",
    };
}

function readChunk(uint8Array, offset) {
    const length = new DataView(uint8Array.buffer).getUint32(offset);
    const chunkType = String.fromCharCode(...uint8Array.slice(offset + 4, offset + 8));
    const chunkData = uint8Array.slice(offset + 8, offset + 8 + length);
    return { length, chunkType, chunkData };
}

function parseImageSize(chunkData) {
    const width = new DataView(chunkData.buffer).getUint32(0);
    const height = new DataView(chunkData.buffer).getUint32(4);
    return `${width} x ${height}`;
}

function parseTextChunk(chunkType, chunkData, exifData) {
    const nullIndex = chunkData.indexOf(0);
    const key = String.fromCharCode(...chunkData.slice(0, nullIndex));
    let value = "";

    if (chunkType === CHUNK_TYPES.TEXT) {
        value = String.fromCharCode(...chunkData.slice(nullIndex + 1));
    } else {
        // iTXt
        const offset = chunkData.indexOf(0, nullIndex + 3) + 1; // Skip compression flag, method, and language tag
        value = new TextDecoder().decode(chunkData.slice(offset));
    }

    exifData[key] = value;
}