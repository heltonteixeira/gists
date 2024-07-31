// Constants
const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
const CHUNK_TYPES = {
  HEADER: 'IHDR',
  TEXT: 'tEXt',
  INTERNATIONAL_TEXT: 'iTXt'
};

// DOM Elements
const elements = {
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

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  elements.imagePreview.addEventListener("click", openModal);
  elements.closeModal.addEventListener("click", closeModal);
  elements.dropZone.addEventListener("click", () => elements.fileInput.click());
  elements.dropZone.addEventListener("dragover", handleDragOver);
  elements.dropZone.addEventListener("dragleave", handleDragLeave);
  elements.dropZone.addEventListener("drop", handleFileDrop);
  elements.fileInput.addEventListener("change", handleFileSelect);
  elements.enlargedImageModal.addEventListener("click", handleModalClick);
  elements.copyButton.addEventListener("click", handleCopyClick);
});

// Event Handlers
const handleDragOver = (e) => {
  e.preventDefault();
  elements.dropZone.classList.add("is-hovered");
};

const handleDragLeave = () => {
  elements.dropZone.classList.remove("is-hovered");
};

const handleFileDrop = (e) => {
  e.preventDefault();
  elements.dropZone.classList.remove("is-hovered");
  const file = e.dataTransfer.files[0];
  handleFile(file);
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  handleFile(file);
};

// File Processing
const handleFile = async (file) => {
  if (file.type !== "image/png") {
    showError("Please select a PNG file.");
    return;
  }

  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(arrayBuffer);

    if (!isPngFile(uint8Array)) {
      showError("Invalid PNG file.");
      return;
    }

    const { metadata, exifData } = parsePngChunks(uint8Array, file);
    displayMetadata(metadata, exifData);
    await displayImagePreview(file);
    hideError();
  } catch (error) {
    console.error("Error processing file:", error);
    showError("An error occurred while processing the file.");
  }
};

// Utility Functions
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const isPngFile = (uint8Array) => {
  return PNG_SIGNATURE.every((byte, index) => uint8Array[index] === byte);
};

// PNG Parsing
const parsePngChunks = (uint8Array, file) => {
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
};

const initializeMetadata = (file) => ({
  name: file.name,
  fileSize: formatFileSize(file.size),
  creationTime: formatDate(file.lastModified),
  imageSize: "",
  author: "",
  prompt: "",
  parameters: "",
  jobId: "",
});

const readChunk = (uint8Array, offset) => {
  const length = new DataView(uint8Array.buffer).getUint32(offset);
  const chunkType = String.fromCharCode(...uint8Array.slice(offset + 4, offset + 8));
  const chunkData = uint8Array.slice(offset + 8, offset + 8 + length);
  return { length, chunkType, chunkData };
};

const parseImageSize = (chunkData) => {
  const width = new DataView(chunkData.buffer).getUint32(0);
  const height = new DataView(chunkData.buffer).getUint32(4);
  return `${width} x ${height}`;
};

const parseTextChunk = (chunkType, chunkData, exifData) => {
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
};

// Metadata Processing
const parseDescription = (description) => {
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
};

const displayMetadata = (metadata, exifData) => {
  elements.metadata.innerHTML = "";

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
      elements.metadata.appendChild(item);
    }
  }

  elements.metadataColumn.style.display = "block";
};

const createMetadataItem = (key, value) => {
  const item = document.createElement("div");
  item.className = "metadata-item";
  item.innerHTML = `
    <span class="metadata-key">${formatKey(key)}:</span>
    <span class="metadata-value">${value}</span>
  `;
  return item;
};

// Image Preview
const displayImagePreview = async (file) => {
  const dataUrl = await readFileAsDataURL(file);
  elements.imagePreview.src = dataUrl;
  elements.enlargedImage.src = dataUrl;
  elements.imagePreviewColumn.style.display = "block";
};

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Modal Handling
const openModal = () => {
  elements.enlargedImageModal.classList.add("is-active");
};

const closeModal = () => {
  elements.enlargedImageModal.classList.remove("is-active");
};

const handleModalClick = (e) => {
  if (e.target === elements.enlargedImageModal || !elements.enlargedImage.contains(e.target)) {
    closeModal();
  }
};

// Copy Functionality
const handleCopyClick = (e) => {
  e.preventDefault();
  copyPromptAndParameters();
};

const copyPromptAndParameters = () => {
  const promptElement = document.querySelector(".metadata-item:nth-child(6) .metadata-value");
  const parametersElement = document.querySelector(".metadata-item:nth-child(7) .metadata-value");

  if (promptElement && parametersElement) {
    const textToCopy = `${promptElement.textContent} ${parametersElement.textContent}`;
    copyToClipboard(textToCopy);
  } else {
    showNotification("Prompt or Parameters not found.", "is-warning");
  }
};

const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showNotification("Prompt and Parameters copied to clipboard!", "is-success");
    } else {
      fallbackCopyTextToClipboard(text);
    }
  } catch (err) {
    console.error("Failed to copy: ", err);
    fallbackCopyTextToClipboard(text);
  }
};

const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    showNotification(`Fallback: Copying text command was ${msg}`, successful ? "is-success" : "is-warning");
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
    showNotification("Failed to copy text to clipboard.", "is-danger");
  }

  document.body.removeChild(textArea);
};

// Utility Functions
const showError = (message) => {
  showNotification(message, "is-danger");
};

const hideError = () => {
  elements.errorAlert.style.display = "none";
};

const showNotification = (message, className) => {
  elements.errorAlert.textContent = message;
  elements.errorAlert.className = `notification ${className}`;
  elements.errorAlert.style.display = "block";

  setTimeout(() => {
    elements.errorAlert.style.display = "none";
  }, 3000);
};

const formatFileSize = (bytes) => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const formatKey = (key) => {
  return key
    .split(/(?=[A-Z])/)
    .join(" ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};