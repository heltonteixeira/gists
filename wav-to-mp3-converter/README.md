# WAV to MP3 Converter

## Description

This project is a web-based WAV to MP3 converter. It allows users to upload WAV files, convert them to MP3 format, and download the converted files. The application features a user-friendly interface with drag-and-drop functionality, progress tracking for both upload and download processes, and efficient file handling using streaming techniques.

## Features

- WAV to MP3 conversion
- Drag-and-drop file upload
- Real-time progress tracking for upload and conversion
- Streaming download of converted files
- Responsive web design
- Server-side file cleanup after download

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- Backend:
  - Node.js
  - Express.js
- Libraries:
  - FFmpeg for audio conversion
  - Multer for file upload handling

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/wav-to-mp3-converter.git
   cd wav-to-mp3-converter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Ensure FFmpeg is installed on your system. If not, you can install it using:
   - On macOS: `brew install ffmpeg`
   - On Ubuntu: `sudo apt-get install ffmpeg`
   - On Windows: Download from [FFmpeg official website](https://ffmpeg.org/download.html)

4. Create a `.env` file in the root directory and add the following:

   ```bash
   PORT=5783
   ```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. Open a web browser and navigate to `http://localhost:5783` (or the port you specified in the .env file).

3. Use the interface to upload a WAV file:
   - Click the "Select File" button or drag and drop a WAV file onto the designated area.

4. Once the file is uploaded, click the "Convert to MP3" button.

5. After conversion, the button will change to "Download MP3". Click it to download your converted file.

## Development

To run the server in development mode with auto-restart on file changes:

```bash
npm run dev
```

## File Structure

```NGUTree
wav-to-mp3-converter/
├── server/
│   ├── server.js
│   └── uploads/ (created at runtime)
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── package.json
├── .env
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- FFmpeg for providing the audio conversion capabilities
- The Node.js community for creating and maintaining the libraries used in this project
