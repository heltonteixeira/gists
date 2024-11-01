# PNG EMetadata and XIF VData iewer

## Overview

PNG Metadata and EXIF Data Viewer is a web-based tool that allows users to view metadata and EXIF (Exchangeable Image File Format) data from PNG image files, with special support for images generated with the Midjourney platform. This application provides a simple and user-friendly interface to inspect metadata embedded in PNG images, which can be particularly useful to visualize and copy prompts, parameters, and Job IDs of Midjourney images.

## Features

- Drag and drop or select PNG image files for analysis
- Display image preview and metadata in a clear, readable format
- Support for metadata and EXIF tags found in PNG files, including those generated with Midjourney
- Copy prompt and parameters with a single click
- Responsive design for use on desktop and mobile devices
- Enlarged image preview in a modal window

## Getting Started

To use the PNG Metadata and EXIF Data Viewer:

1. Clone this repository or download the files.
2. Open `src/index.html` in a modern web browser.
3. Drag and drop a PNG image onto the designated area or click to select a file from your device.
4. The image preview and metadata will be displayed automatically after the file is selected.

## Project Structure

```medusa
/
├── src/
│   ├── index.html
│   ├── js/
│   │   ├── main.js
│   │   ├── constants.js
│   │   ├── domElements.js
│   │   ├── eventHandlers.js
│   │   ├── fileProcessing.js
│   │   ├── pngParsing.js
│   │   ├── metadataProcessing.js
│   │   ├── imagePreview.js
│   │   ├── modalHandling.js
│   │   ├── copyFunctionality.js
│   │   └── utils.js
│   ├── css/
│   │   └── style.css
│   └── assets/
│       └── favicon.ico
├── README.md
└── PROJECT_OVERVIEW.md
```

## Requirements

- A modern web browser with JavaScript enabled
- PNG image files (with special support for Midjourney-generated images)

## Limitations

- This viewer is optimized for PNG files, especially those generated with Midjourney, and may not work as expected with other image formats.
- The accuracy of the displayed information depends on the metadata present in the image file.

## Future Improvements

- Add support for viewing metadata of multiple files simultaneously.
- Implement a dark mode theme option.
- Add the ability to edit and save metadata back to the image file.
- Expand support for additional image formats (e.g., JPEG, WebP).

## Contributing

Contributions to improve the PNG Metadata and EXIF Data Viewer are welcome. Please feel free to submit pull requests or open issues to suggest improvements or report bugs. For more detailed information about the project structure and refactoring plans, please refer to the PROJECT_OVERVIEW.md file.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgements

This project uses the following libraries and frameworks:

- [Bulma](https://bulma.io/) for CSS styling
- [Font Awesome](https://fontawesome.com/) for icons
- [pako](https://github.com/nodeca/pako) for zlib inflation/deflation
