# WAV to MP3 Converter API

This project provides a simple API for converting WAV audio files to MP3 format. It's designed to work in conjunction with a separate frontend interface.

## Server Information

- **Platform:** Node.js
- **Main Framework:** Express.js
- **File Handling:** Multer
- **Audio Processing:** fluent-ffmpeg

## API Endpoints

### POST /convert

Converts a WAV file to MP3 format.

- **Input:** WAV file (multipart/form-data)
- **Output:** MP3 file
- **Max File Size:** 50MB

## Environment Variables

The server uses the following environment variables:

- `PORT`: The port on which the server will run (default: 3000)
- `CLIENT_DOMAIN`: Allowed origin for CORS (required in production)
- `NODE_ENV`: Set to 'production' for production environment

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Run the server: `npm start`

## Deployment on Glitch

1. Create a new project on Glitch
2. Import this repository
3. Set up the necessary environment variables in the Glitch project settings
4. The project should automatically deploy and run

## Frontend Integration

This API is designed to work with a separate frontend application. The frontend code is hosted at:
[https://heltonteixeira.github.io/gists/wav-to-mp3-converter/](https://heltonteixeira.github.io/gists/wav-to-mp3-converter/)

## Important Notes

- Ensure ffmpeg is properly set up in the Glitch environment
- The `/uploads` directory must be writable by the application
- CORS is configured to allow requests from the specified `CLIENT_DOMAIN`

## Troubleshooting

If you encounter issues:
1. Check the Glitch logs for error messages
2. Verify that all environment variables are correctly set
3. Ensure the `uploads` directory exists and is writable
4. Confirm that ffmpeg is properly installed and accessible

For more detailed information or support, please refer to the project documentation or open an issue in the GitHub repository.