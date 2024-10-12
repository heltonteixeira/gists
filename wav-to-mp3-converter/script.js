const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const selectFileBtn = document.getElementById('selectFile');
const actionBtn = document.getElementById('actionBtn');
const fileInfo = document.getElementById('fileInfo');
const progressBar = document.querySelector('.progress');
const statusMessage = document.getElementById('statusMessage');

let selectedFile = null;
let convertedFileInfo = null;
let fakeProgressInterval;
let uploadProgress = 0;
let conversionProgress = 0;
let downloadProgress = 0;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

// Server URLs
const serverUrl = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5783'
    : 'https://festive-silk-danger.glitch.me';


console.log('Using server URL:', serverUrl);

// Event Listeners
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);
selectFileBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileInputChange);
actionBtn.addEventListener('click', handleActionClick);

// File Handling Functions
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('dragover');
}

function handleDragLeave() {
    dropZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
}

function handleFileInputChange(e) {
    handleFile(e.target.files[0]);
}

function handleFile(file) {
    if (file && file.type === 'audio/wav' && file.size <= MAX_FILE_SIZE) {
        selectedFile = file;
        fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
        actionBtn.textContent = 'Convert to MP3';
        actionBtn.disabled = false;
        convertedFileInfo = null;
        resetProgress();
    } else {
        let errorMessage = 'Please select a valid WAV file';
        if (file && file.size > MAX_FILE_SIZE) {
            errorMessage += ` (max size: ${formatFileSize(MAX_FILE_SIZE)})`;
        }
        alert(errorMessage);
        resetState();
    }
}

// Action Button Handler
function handleActionClick() {
    if (convertedFileInfo) {
        downloadConvertedFile();
    } else if (selectedFile) {
        convertToMp3(selectedFile);
    }
}

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateProgressBar(progress, operation) {
    const progressBar = document.querySelector('.progress');
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;

    let statusText = '';
    switch (operation) {
        case 'upload':
            statusText = `Uploading: ${Math.round(progress)}%`;
            break;
        case 'conversion':
            statusText = `Converting: ${Math.round(progress)}%`;
            break;
        case 'download':
            statusText = `Downloading: ${Math.round(progress)}%`;
            break;
        default:
            statusText = `Progress: ${Math.round(progress)}%`;
    }
    updateStatus(statusText);
}

function updateStatus(message) {
    statusMessage.textContent = message;
}

function startFakeConversionProgress() {
    conversionProgress = 0;
    const interval = setInterval(() => {
        if (conversionProgress < 90) {
            conversionProgress += Math.random() * 12;
            conversionProgress = Math.min(conversionProgress, 90);
            updateProgressBar(conversionProgress, 'conversion');
        } else {
            clearInterval(interval);
        }
    }, 1000);
    return interval;
}

// Conversion and Download Functions
function convertToMp3(file) {
    const formData = new FormData();
    formData.append('file', file);

    resetProgress();
    actionBtn.disabled = true;
    updateStatus('Uploading file...');

    console.log('Sending request to:', `${serverUrl}/convert`); // Add this line for debugging

    fetch(`${serverUrl}/convert`, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            console.log('Received response:', response); // Add this line for debugging
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data); // Add this line for debugging
            if (data.status === 'complete') {
                updateProgressBar(100, 'conversion');
                convertedFileInfo = data;
                actionBtn.textContent = 'Download MP3';
                actionBtn.disabled = false;
                fileInfo.textContent = `Converted: ${data.fileName} (${formatFileSize(data.fileSize)})`;
                updateStatus('Conversion complete. Ready for download.');
            } else {
                throw new Error(data.message || 'Conversion failed');
            }
        })
        .catch(error => {
            console.error('Conversion error:', error);
            alert(`An error occurred during the conversion process: ${error.message}`);
            resetState();
        });
}

function downloadConvertedFile() {
    if (!convertedFileInfo) {
        console.error('No converted file information available');
        return;
    }

    const downloadUrl = convertedFileInfo.downloadUrl;
    updateStatus('Preparing download...');

    fetch(downloadUrl)
        .then(response => {
            if (response.status === 410) {
                throw new Error('The download link has expired. Please convert the file again.');
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = convertedFileInfo.fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            updateStatus('Download complete.');
        })
        .catch(error => {
            console.error('Download error:', error);
            alert(`An error occurred during the download: ${error.message}`);
            updateStatus('Download failed. Please try converting the file again.');
            resetState();
        });
}

function resetProgress() {
    uploadProgress = 0;
    conversionProgress = 0;
    downloadProgress = 0;
    updateProgressBar(0);
    if (fakeProgressInterval) {
        clearInterval(fakeProgressInterval);
    }
}

function resetState() {
    selectedFile = null;
    convertedFileInfo = null;
    fileInfo.textContent = '';
    actionBtn.textContent = 'Convert to MP3';
    actionBtn.disabled = true;
    resetProgress();
    updateStatus('');
}
