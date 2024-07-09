document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        input: document.getElementById('input'),
        preview: document.getElementById('preview'),
        convertBtn: document.getElementById('convert'),
        copyBtn: document.getElementById('copy'),
        downloadBtn: document.getElementById('download'),
        errorMessage: document.getElementById('error-message'),
        errorText: document.querySelector('.error-text'),
        closeErrorBtn: document.querySelector('.close-error')
    };

    function convertWikiTextToMarkdown(wikiText) {
        const lines = wikiText.split('\n');
        let inCodeBlock = false;
        let codeBlockType = '';
        let codeContent = '';
        let listContext = { inList: false, level: 0 };

        const processedLines = lines.map((line, index) => {
            // Handle code blocks
            if (isCodeBlockStart(line)) {
                inCodeBlock = true;
                codeBlockType = getCodeBlockType(line);
                codeContent = '';
                return '```' + codeBlockType;
            }
            if (isCodeBlockEnd(line)) {
                inCodeBlock = false;
                const processedCode = codeContent.trimEnd();
                codeContent = '';
                return processedCode + '\n```';
            }
            if (inCodeBlock) {
                codeContent += line + '\n';
                return null;
            }

            // Handle headers
            const headerLine = processHeader(line);
            if (headerLine) return headerLine;

            // Handle lists
            const listLine = processList(line, listContext);
            if (listLine) return listLine;

            listContext.inList = false;
            listContext.level = 0;

            // Process inline elements
            return processInlineElements(line);
        });

        return processedLines.filter(line => line !== null).join('\n');
    }

    function isCodeBlockStart(line) {
        const trimmedLine = line.trim();
        return trimmedLine.startsWith('<syntaxhighlight') ||
               trimmedLine.startsWith('<source') ||
               trimmedLine === '<nowiki>' ||
               trimmedLine === '<pre>' ||
               trimmedLine === '<code>';
    }

    function isCodeBlockEnd(line) {
        const trimmedLine = line.trim();
        return trimmedLine === '</syntaxhighlight>' ||
               trimmedLine === '</source>' ||
               trimmedLine === '</nowiki>' ||
               trimmedLine === '</pre>' ||
               trimmedLine === '</code>';
    }

    function getCodeBlockType(line) {
        const match = line.match(/lang(?:uage)?="(\w+)"/);
        return match ? match[1] : '';
    }

    function processHeader(line) {
        const headerMatch = line.match(/^(={1,6})\s*(.*?)\s*\1$/);
        if (headerMatch) {
            return '#'.repeat(headerMatch[1].length) + ' ' + headerMatch[2];
        }
        return null;
    }

    function processList(line, context) {
        const listMatch = line.match(/^([*#:;]+)\s*(.*)/);
        if (!listMatch) return null;

        const [, listType, content] = listMatch;
        if (!context.inList || listType.length !== context.level) {
            context.inList = true;
            context.level = listType.length;
        }

        const indent = '  '.repeat(listType.length - 1);
        const lastChar = listType[listType.length - 1];

        switch (lastChar) {
            case '*': return `${indent}- ${content}`;
            case '#': return `${indent}1. ${content}`;
            case ':': return `${indent}> ${content}`;
            case ';': return processDefinitionList(indent, content);
        }
    }

    function processDefinitionList(indent, content) {
        const parts = content.split(':');
        let result = `${indent}**${parts[0].trim()}**`;
        if (parts.length > 1) {
            result += `\n${indent}: ${parts[1].trim()}`;
        }
        return result;
    }

    function processInlineElements(line) {
        return line
            .replace(/'''''(.*?)'''''/g, '***$1***')
            .replace(/'''(.*?)'''/g, '**$1**')
            .replace(/''(.*?)''/g, '*$1*')
            .replace(/<code>(.*?)<\/code>/g, '`$1`')
            .replace(/<nowiki>(.*?)<\/nowiki>/g, '`$1`')
            .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '[$2]($1)')
            .replace(/\[\[([^\]]+)\]\]/g, '[$1]($1)')
            .replace(/\[(\S+)\s([^\]]+)\]/g, '[$2]($1)')
            .replace(/^----$/, '---');
    }

    function updatePreview() {
        if (!elements.input || !elements.preview) {
            showError("Input or preview element not found.");
            return;
        }

        const inputText = elements.input.value.trim();
        if (inputText === '') {
            elements.preview.textContent = '';
            showError("Input is empty. Please enter some WikiText to convert.");
            return;
        }

        try {
            const markdown = convertWikiTextToMarkdown(inputText);
            elements.preview.textContent = markdown;
            clearError();
        } catch (error) {
            showError(`Conversion error: ${error.message}`);
        }
    }

    function copyToClipboard() {
        if (!elements.preview) {
            showError('Preview element not found');
            return;
        }

        const markdownText = elements.preview.textContent.trim();
        if (markdownText === '') {
            showError("Nothing to copy. Please convert some text first.");
            return;
        }

        navigator.clipboard.writeText(markdownText)
            .then(() => updateButtonText(elements.copyBtn, 'Copied!'))
            .catch(err => showError(`Failed to copy: ${err.message}`));
    }

    function downloadMarkdown() {
        if (!elements.preview) {
            showError('Preview element not found');
            return;
        }

        const markdown = elements.preview.textContent.trim();
        if (!markdown) {
            showError("No content to download. Please convert some text first.");
            return;
        }

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_markdown.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        updateButtonText(elements.downloadBtn, 'Downloaded!');
    }

    function updateButtonText(button, text) {
        if (button) {
            const originalText = button.textContent;
            button.textContent = text;
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }
    }

    function showError(message) {
        if (elements.errorMessage && elements.errorText) {
            elements.errorText.textContent = message;
            elements.errorMessage.style.display = 'block';
        } else {
            console.error('Error:', message);
        }
    }

    function clearError() {
        if (elements.errorMessage) {
            elements.errorMessage.style.display = 'none';
            if (elements.errorText) {
                elements.errorText.textContent = '';
            }
        }
    }

    function setupEventListeners() {
        if (elements.input) elements.input.addEventListener('input', updatePreview);
        if (elements.convertBtn) elements.convertBtn.addEventListener('click', updatePreview);
        if (elements.copyBtn) elements.copyBtn.addEventListener('click', copyToClipboard);
        if (elements.downloadBtn) elements.downloadBtn.addEventListener('click', downloadMarkdown);
        if (elements.closeErrorBtn) elements.closeErrorBtn.addEventListener('click', clearError);
    }

    function init() {
        const requiredElements = ['input', 'preview', 'convertBtn', 'copyBtn', 'downloadBtn'];
        const missingElements = requiredElements.filter(el => !elements[el]);
        
        if (missingElements.length === 0) {
            setupEventListeners();
            updatePreview(); // Initial conversion
        } else {
            console.error('Some required elements are missing:', missingElements);
        }
        clearError(); // Ensure error message is hidden initially
    }

    let currentScenario = 0;

    function runNextScenario() {
        if (currentScenario < errorScenarios.length) {
            const scenario = errorScenarios[currentScenario];
            console.log(`Testing error scenario: ${scenario.name}`);
            scenario.test();
            currentScenario++;
        setTimeout(runNextScenario, 2000); // Wait 2 seconds before next scenario
    } else {
        console.log('All error scenarios tested');
    }

    runNextScenario();
    }

    // Run initialization
    init();

});
        