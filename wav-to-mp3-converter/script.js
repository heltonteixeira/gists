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

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateProgressBar(progress) {
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}

function startFakeProgress() {
    let progress = 0;
    updateProgressBar(progress);

    fakeProgressInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 10;
            progress = Math.min(progress, 90);
            updateProgressBar(progress);
        }
    }, 500);
}

// Conversion and Download Functions
function handleActionClick() {
    if (convertedFileInfo) {
        downloadConvertedFile();
    } else if (selectedFile) {
        convertToMp3(selectedFile);
    }
}

function updateStatus(message) {
    statusMessage.textContent = message;
}

function updateTotalProgress() {
    const totalProgress = (uploadProgress + conversionProgress) / 2;
    updateProgressBar(totalProgress);
}

function convertToMp3(file) {
    const formData = new FormData();
    formData.append('file', file);

    resetProgress();
    actionBtn.disabled = true;
    updateStatus('Uploading file...');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${serverUrl}/convert`, true);
    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            uploadProgress = (event.loaded / event.total) * 100;
            updateTotalProgress();
        }
    };
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.status === 'complete') {
                clearInterval(fakeProgressInterval);
                updateProgressBar(100);
                convertedFileInfo = response;
                actionBtn.textContent = 'Download MP3';
                actionBtn.disabled = false;
                fileInfo.textContent = `Converted: ${response.fileName} (${formatFileSize(response.fileSize)})`;
                updateStatus('Conversion complete. Ready for download.');
            } else {
                throw new Error(response.message || 'Conversion failed');
            }
        } else {
            throw new Error(`HTTP error! status: ${xhr.status}`);
        }
    };
    xhr.onerror = function () {
        console.error('Conversion error:', xhr.statusText);
        alert(`An error occurred during the conversion process: ${xhr.statusText}`);
        resetState();
    };
    xhr.send(formData);

    // Start fake conversion progress after upload is complete
    xhr.upload.onload = () => {
        updateStatus('Converting file...');
        startFakeProgress();
    };
}

function downloadConvertedFile() {
    if (!convertedFileInfo) {
        console.error('No converted file information available');
        return;
    }

    const downloadUrl = convertedFileInfo.downloadUrl;
    console.log('Initiating download from:', downloadUrl);
    updateStatus('Preparing download...');

    fetch(downloadUrl)
        .then(response => {
            if (response.status === 410) {
                throw new Error('The download link has expired. Please convert the file again.');
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentLength = response.headers.get('Content-Length');
            const total = parseInt(contentLength, 10);
            let loaded = 0;

            updateStatus('Downloading file...');

            const reader = response.body.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    function push() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            loaded += value.length;
                            updateProgressBar((loaded / total) * 100);
                            controller.enqueue(value);
                            push();
                        });
                    }
                    push();
                }
            });
            return new Response(stream);
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = convertedFileInfo.fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Download error:', error);
            alert(`An error occurred during the download: ${error.message}`);
            updateStatus('Download failed.');
            if (error.message.includes('expired')) {
                updateStatus('Download period expired. Please convert the file again.');
                resetState();
            }
        })
        .finally(() => {
            // Only reset if download was successful
            if (convertedFileInfo) {
                updateStatus('Download complete.');
                // Don't reset progress here, keep it at 100%
            }
        });
}

function resetProgress() {
    uploadProgress = 0;
    conversionProgress = 0;
    updateProgressBar(0);
    clearInterval(fakeProgressInterval);
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
