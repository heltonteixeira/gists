function renderHTML() {
  const htmlInput = document.getElementById('htmlInput').value;
  const preview = document.getElementById('previewFrame');

  // Update the iframe content
  preview.srcdoc = htmlInput;
}

function printToPDF() {
  const htmlInput = document.getElementById('htmlInput').value;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');

  // Add pretty print styles
  const prettyPrintStyles = `
      <style>
        body {
          font-family: 'Montserrat', sans-serif;
          line-height: 1.6;
          color: #22223b;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #4a4e69;
          page-break-after: avoid;
          font-family: 'Playfair Display', serif;
        }
        p {
          margin-bottom: 15px;
        }
        ul, ol {
          margin-bottom: 15px;
          padding-left: 30px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 15px;
        }
        th, td {
          border: 1px solid #9a8c98;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2e9e4;
        }
        @media print {
          body {
            font-size: 12pt;
          }
          a {
            text-decoration: none;
            color: #000;
          }
          a[href]:after {
            content: " (" attr(href) ")";
          }
        }
      </style>
    `;

  printWindow.document.write('<!DOCTYPE html><html><head><title>PrintFriend.ly Export</title>' + prettyPrintStyles + '</head><body>' + htmlInput + '</body></html>');
  printWindow.document.close();

  // Show confirmation message
  const confirmationMessage = document.getElementById('confirmationMessage');
  confirmationMessage.style.display = 'block';
  setTimeout(() => {
    confirmationMessage.style.display = 'none';
  }, 5000);

  // Open the print dialog
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// Add some example HTML content
document.getElementById('htmlInput').value = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sample HTML</title>
</head>
<body>
<h1>Welcome to PrintFriend.ly</h1>
<p>This is a sample HTML that you can edit and see in real-time preview.</p>
<h2>Features</h2>
<ul>
  <li>Intuitive interface</li>
  <li>Real-time HTML preview</li>
  <li>Supports styles and scripts</li>
  <li>Export to pretty PDF functionality</li>
  <li>Print-friendly formatting</li>
</ul>
<h2>How to Use</h2>
<ol>
  <li>Edit the HTML in the text area</li>
  <li>See the changes in real-time on the right</li>
  <li>Click "Generate Pretty PDF" to open print options</li>
  <li>Adjust settings and save as PDF</li>
</ol>
<p>Try adding some <strong>bold text</strong>, <em>italic text</em>, or even a <a href="https://example.com">hyperlink</a>!</p>
<table>
  <tr>
    <th>Column 1</th>
    <th>Column 2</th>
  </tr>
  <tr>
    <td>Row 1, Cell 1</td>
    <td>Row 1, Cell 2</td>
  </tr>
  <tr>
    <td>Row 2, Cell 1</td>
    <td>Row 2, Cell 2</td>
  </tr>
</table>
<p>Click the "Generate Pretty PDF" button to create a stunning PDF of this content!</p>
</body>
</html>`;

// Implement real-time preview
const htmlInput = document.getElementById('htmlInput');

function updatePreview() {
  renderHTML();
}

htmlInput.addEventListener('input', updatePreview);

// Initial render
updatePreview();