function convertToHtml() {
  const markdownInput = document.getElementById('markdownInput');
  const previewContent = document.getElementById('previewContent');
  const rawHtmlContent = document.getElementById('rawHtmlContent');
  
  // Add pretty print styles
  const prettyPrintStyles = `
    .preview-content {
      font-family: 'Montserrat', sans-serif;
      line-height: 1.6;
      color: #22223b;
    }
    .preview-content h1, .preview-content h2, .preview-content h3 {
      color: #4a4e69;
      page-break-after: avoid;
      font-family: 'Playfair Display', serif;
    }
    .preview-content p {
      margin-bottom: 15px;
    }
    .preview-content ul, .preview-content ol {
      margin-bottom: 15px;
      padding-left: 30px;
    }
    .preview-content img {
      max-width: 100%;
      height: auto;
    }
    .preview-content table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 15px;
    }
    .preview-content th, .preview-content td {
      border: 1px solid #9a8c98;
      padding: 8px;
      text-align: left;
    }
    .preview-content th {
      background-color: #f2e9e4;
    }
    @media print {
      .preview-content {
        font-size: 12pt;
      }
      .preview-content a {
        text-decoration: none;
        color: #000;
      }
      .preview-content a[href]:after {
        content: " (" attr(href) ")";
      }
    }
  `;

  // Convert Markdown to HTML using the marked library
  const htmlContent = marked(markdownInput.value);
  
  // Display the HTML content in the preview
  previewContent.innerHTML = `<style>${prettyPrintStyles}</style><div class="preview-content">${htmlContent}</div>`;
  
  // Update the raw HTML content
  rawHtmlContent.textContent = `<style>${prettyPrintStyles}</style><div class="preview-content">${htmlContent}</div>`;
}

function showTab(event, tabName) {
  const tabs = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none';
  }
  document.getElementById(tabName).style.display = 'block';

  const buttons = document.getElementsByClassName('tab-button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }
  if (event.target) {
    event.target.classList.add('active');
  } else {
    document.querySelector(`[onclick="showTab(event, '${tabName}')"]`).classList.add('active');
  }
}

function copyRawHtml() {
  const rawHtmlContent = document.getElementById('rawHtmlContent');
  const textArea = document.createElement('textarea');
  textArea.value = rawHtmlContent.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);

  // Show a temporary message
  const copyButton = document.getElementById('copyHtmlButton');
  const originalText = copyButton.innerHTML;
  copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
  setTimeout(() => {
    copyButton.innerHTML = originalText;
  }, 2000);
}

// Add some example Markdown content
document.getElementById('markdownInput').value = `# Welcome to PrintFriend.ly

This is a sample markdown that you can edit and see in real-time preview.

## Features

* Intuitive interface
* Real-time markdown preview
* Supports styles and links
* Export to pretty PDF functionality
* Print-friendly formatting

## How to Use

1. Edit the markdown in the text area
2. See the changes in real-time on the right
3. Click "Generate Pretty PDF" to open print options
4. Adjust settings and save as PDF

Try adding some **bold text**, *italic text*, or even a [hyperlink](https://example.com)!

### Table Example

| Column 1 | Column 2 |
|----------|----------|
| Row 1, Cell 1 | Row 1, Cell 2 |
| Row 2, Cell 1 | Row 2, Cell 2 |

Click the "Generate Pretty HTML" button to create a stunning HTML of this content!
`;

// Add event listener for real-time conversion
document.getElementById('markdownInput').addEventListener('input', convertToHtml);

// Initial conversion on page load
convertToHtml();

// Show the preview tab by default
document.addEventListener('DOMContentLoaded', function() {
  showTab({ target: document.querySelector('.tab-button') }, 'preview');
});