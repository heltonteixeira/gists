# PNG EXIF Viewer

## Overview

PNG EXIF Viewer is a web-based tool that allows users to view EXIF (Exchangeable Image File Format) data from PNG image files specially generated with Midjourney platform. This application provides a simple and user-friendly interface to inspect metadata embedded in PNG images, which can be particularly useful to visualize and copy prompts, parameters, and ID of Midjourney images.

## Features

- Upload and analyze PNG image files
- Display EXIF metadata in a clear, readable format
- Support for EXIF tags found in PNG files generated with Midjourney
- Responsive design for use on desktop and mobile devices

## Getting Started

To use the PNG EXIF Viewer:

1. Clone this repository or download the files.
2. Open `index.html` in a modern web browser.
3. Click the "Choose File" button to select a PNG image from your device.
4. The EXIF data will be displayed automatically after the file is selected.

## File Structure

- `index.html`: The main HTML file that provides the structure of the web application.
- `script.js`: Contains the JavaScript code that handles file reading, EXIF data extraction, and display logic.
- `styles.css`: Defines the styles and layout for the application.

## Requirements

- A modern web browser with JavaScript enabled
- PNG image files with EXIF data

## Limitations

- This viewer is specifically designed for PNG files generated with Midjourney and may not work other PNG files.
- The accuracy of the displayed information depends on the EXIF data present in the image file.

## Future Improvements

- Add support to view exif of multiple files.
- Improve layout, theme and responsibility.

## Contributing

Contributions to improve PNG EXIF Viewer are welcome. Please feel free to submit pull requests or open issues to suggest improvements or report bugs.

## License

This project is open-source and available under the [MIT License](../LICENSE).

## Acknowledgements

This project uses [ExifReader](https://github.com/mattiasw/ExifReader) (or similar library - please confirm the actual library used) for parsing EXIF data from PNG files.