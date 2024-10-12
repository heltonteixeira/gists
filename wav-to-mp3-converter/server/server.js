const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');

const app = express();
const port = process.env.PORT || 3000;
const maxFileSize = 50 * 1024 * 1024; // 50 MB

ffmpeg.setFfmpegPath(ffmpegPath);

// Simplified CORS configuration
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
    storage: storage,
    limits: { fileSize: maxFileSize }
});

app.post('/convert', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join('uploads', `${Date.now()}.mp3`);

    ffmpeg(inputPath)
        .toFormat('mp3')
        .on('end', () => {
            res.download(outputPath, 'converted.mp3', (err) => {
                if (err) {
                    console.error('Download error:', err);
                }
                // Clean up files
                fs.unlink(inputPath, () => { });
                fs.unlink(outputPath, () => { });
            });
        })
        .on('error', (err) => {
            console.error('Conversion error:', err);
            res.status(500).json({ error: 'Conversion failed' });
            fs.unlink(inputPath, () => { });
        })
        .save(outputPath);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});