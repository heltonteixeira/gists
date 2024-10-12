const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const ffmpegPath = require('ffmpeg-static');
const crypto = require('crypto');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
const port = process.env.PORT || 3000;
const maxFileSize = process.env.MAX_FILE_SIZE || 50 * 1024 * 1024; // 50 MB

console.log('Starting server with configuration:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: port,
    MAX_FILE_SIZE: maxFileSize,
    CLIENT_DOMAIN: process.env.CLIENT_DOMAIN,
    GITHUB_PAGES_DOMAIN: process.env.GITHUB_PAGES_DOMAIN
});

ffmpeg.setFfmpegPath(ffmpegPath);
console.log('FFmpeg path:', ffmpegPath);

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [process.env.CLIENT_DOMAIN, process.env.GITHUB_PAGES_DOMAIN];
        console.log('Received request from origin:', origin);
        console.log('Allowed origins:', allowedOrigins);

        if (process.env.NODE_ENV !== 'production') {
            // In development, allow all origins
            callback(null, true);
        } else if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// Debugging middleware
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await ensureUploadsDir();
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'audio/wav') {
            return cb(new Error('Only WAV files are allowed'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: maxFileSize
    }
});

async function ensureUploadsDir() {
    const uploadDir = path.join(__dirname, 'uploads');
    try {
        await fsPromises.access(uploadDir);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fsPromises.mkdir(uploadDir, { recursive: true });
        } else {
            throw error;
        }
    }
}

async function checkFFmpeg() {
    return new Promise((resolve, reject) => {
        ffmpeg.getAvailableFormats((err, formats) => {
            if (err) {
                console.error('Error checking FFmpeg:', err);
                reject(new Error('FFmpeg is not installed or not working properly'));
            } else {
                console.log('FFmpeg is installed and working');
                resolve(true);
            }
        });
    });
}

function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('mp3')
            .audioBitrate('192k')
            .on('start', (commandLine) => {
                console.log('FFmpeg process started:', commandLine);
            })
            .on('progress', (progress) => {
                console.log('Processing: ' + progress.percent + '% done');
            })
            .on('end', () => {
                console.log('Conversion completed');
                resolve();
            })
            .on('error', (err, stdout, stderr) => {
                console.error('FFmpeg error:', err.message);
                console.error('FFmpeg stdout:', stdout);
                console.error('FFmpeg stderr:', stderr);
                reject(new Error(`FFmpeg error: ${err.message}\nStdout: ${stdout}\nStderr: ${stderr}`));
            })
            .save(outputPath);
    });
}

const fileCleanupMap = new Map();

function scheduleFileCleanup(filePath, timeout = 5 * 60 * 1000) {
    const timeoutId = setTimeout(async () => {
        try {
            await deleteFile(filePath);
        } catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
        }
    }, timeout);

    fileCleanupMap.set(filePath, timeoutId);
}

async function deleteFile(filePath) {
    try {
        await fsPromises.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
        const timeoutId = fileCleanupMap.get(filePath);
        if (timeoutId) {
            clearTimeout(timeoutId);
            fileCleanupMap.delete(filePath);
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(`Error deleting file ${filePath}:`, error);
        }
    }
}

app.post('/convert', upload.single('file'), async (req, res) => {
    console.log('Received conversion request');
    console.log('Request headers:', req.headers);

    if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    console.log('File received:', req.file);

    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    const outputFileName = `${originalName}-${Date.now()}.mp3`;
    const outputPath = path.join('uploads', outputFileName);

    console.log('Input path:', inputPath);
    console.log('Output path:', outputPath);

    try {
        await fsPromises.access(inputPath, fs.constants.R_OK);
        console.log('Input file is readable');

        await convertToMp3(inputPath, outputPath);
        console.log('Conversion completed');

        const stats = await fsPromises.stat(outputPath);
        console.log('Output file stats:', stats);

        const protocol = req.secure || (req.headers['x-forwarded-proto'] === 'https') ? 'https' : 'http';
        const host = req.get('host');

        scheduleFileCleanup(outputPath);

        res.json({
            status: 'complete',
            fileName: outputFileName,
            fileSize: stats.size,
            downloadUrl: `https://${host}/download/${encodeURIComponent(outputFileName)}`
        });
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Conversion failed',
            details: error.message
        });
    } finally {
        await deleteFile(inputPath);
    }
});

app.get('/download/:filename', async (req, res) => {
    const encodedFilename = req.params.filename;
    const decodedFilename = decodeURIComponent(encodedFilename);
    const filePath = path.join(__dirname, 'uploads', decodedFilename);

    try {
        await fsPromises.access(filePath, fs.constants.R_OK);
        const stats = await fsPromises.stat(filePath);
        const fileSize = stats.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': `attachment; filename="${decodedFilename}"`
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': `attachment; filename="${decodedFilename}"`
            };
            res.writeHead(200, head);
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            fileStream.on('close', async () => {
                await deleteFile(filePath);
            });
        }
    } catch (error) {
        console.error('Error accessing file:', error);
        if (error.code === 'ENOENT') {
            res.status(410).json({ error: 'File has expired or does not exist' });
        } else {
            res.status(500).json({ error: 'An error occurred while accessing the file', details: error.message });
        }
    }
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

async function startServer() {
    try {
        await ensureUploadsDir();
        await checkFFmpeg();

        app.listen(port, () => {
            console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
            console.log('FFmpeg path:', ffmpegPath);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();