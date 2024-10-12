const dropZone = document.getElementById('dropZone');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'audio/wav';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

const selectFileBtn = dropZone.querySelector('button') || dropZone.lastElementChild;
const convertBtn = document.querySelector('.action-wrapper button') || document.querySelector('.action-wrapper').lastElementChild;
const fileInfo = document.getElementById('fileInfo');
const statusMessage = document.getElementById('statusMessage');
const progressBar = document.querySelector('.progress');

// Determine the environment and set the server URL
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const serverUrl = isLocalhost
    ? 'http://localhost:3000'
    : 'https://festive-silk-danger.glitch.me';

console.log(`Running in ${isLocalhost ? 'development' : 'production'} mode`);
console.log(`Using server URL: ${serverUrl}`);

let selectedFile = null;

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
});

selectFileBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

convertBtn.addEventListener('click', () => {
    if (selectedFile) {
        convertToMp3(selectedFile);
    }
});

function handleFile(file) {
    if (file && file.type === 'audio/wav') {
        selectedFile = file;
        fileInfo.textContent = `Selected: ${file.name}`;
        convertBtn.disabled = false;
        console.log(`File selected: ${file.name}`);
    } else {
        alert('Please select a valid WAV file.');
        resetState();
    }
}

function convertToMp3(file) {
    const formData = new FormData();
    formData.append('file', file);

    statusMessage.textContent = 'Converting...';
    convertBtn.disabled = true;
    updateProgress(0);

    console.log(`Starting conversion for file: ${file.name}`);

    fetch(`${serverUrl}/convert`, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            console.log(`Received response with status: ${response.status}`);
            if (!response.ok) throw new Error(`Conversion failed with status: ${response.status}`);
            return response.blob();
        })
        .then(blob => {
            console.log(`Conversion successful, blob size: ${blob.size} bytes`);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'converted.mp3';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            statusMessage.textContent = 'Conversion complete. Download started.';
            updateProgress(100);
        })
        .catch(error => {
            console.error('Conversion error:', error);
            statusMessage.textContent = 'Conversion failed. Please try again.';
        })
        .finally(() => {
            convertBtn.disabled = false;
        });
}

function updateProgress(percent) {
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
}

function resetState() {
    selectedFile = null;
    fileInfo.textContent = '';
    statusMessage.textContent = '';
    convertBtn.disabled = true;
    updateProgress(0);
    console.log('State reset');
}

// Initialize the state
resetState();

console.log('Script initialized');