class PromptEnhancer {
    constructor() {
        this.styles = [
            {
                id: 'concise',
                name: 'Concise',
                icon: 'fa-compress-alt',
                pattern: 'Make it more concise while maintaining clarity',
                description: 'Creates a shorter, clearer version of your prompt'
            },
            {
                id: 'technical',
                name: 'Technical',
                icon: 'fa-cogs',
                pattern: 'Add technical precision and detail',
                description: 'Adds technical terminology and precise specifications'
            },
            {
                id: 'informative',
                name: 'Informative',
                icon: 'fa-info-circle',
                pattern: 'Make it more informative and comprehensive',
                description: 'Expands your prompt with additional relevant information'
            },
            {
                id: 'generic',
                name: 'Generic',
                icon: 'fa-random',
                pattern: 'Make it more generic and versatile',
                description: 'Makes your prompt more adaptable and widely applicable'
            }
        ];

        this.initElements();
        this.setupListeners();
        this.initStylesUI();
        this.updateCharCount();
    }

    initElements() {
        // Input elements
        this.promptInput = document.getElementById('promptInput');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.contextCheckbox = document.getElementById('extractContext');
        this.enhanceButton = document.getElementById('enhanceButton');

        // Tab containers
        this.styleCheckboxes = document.getElementById('styleCheckboxes');
        this.outputTabs = document.getElementById('outputTabs');
        this.enhancedOutputs = document.getElementById('enhancedOutputs');

        // Notification elements
        this.notification = document.querySelector('.notification-float');
        this.notificationMessage = document.querySelector('.notification-message');

        // Load saved API key
        const savedApiKey = localStorage.getItem('apiKey');
        if (savedApiKey) {
            this.apiKeyInput.value = savedApiKey;
        }
    }

    setupListeners() {
        // Main navigation tabs - Settings and Styles
        const mainTabsContainer = document.querySelector('.tabs:not(#outputTabs)');
        const mainTabs = mainTabsContainer.querySelectorAll('li');
        const stylesTab = document.getElementById('stylesTab');
        const settingsTab = document.getElementById('settingsTab');

        mainTabsContainer.addEventListener('click', (e) => {
            e.preventDefault();

            // Find the clicked tab element
            const clickedTab = e.target.closest('a');
            if (!clickedTab) return;

            const tabType = clickedTab.getAttribute('data-tab');
            if (!tabType) return;

            // Update active tab state
            mainTabs.forEach(tab => tab.classList.remove('is-active'));
            clickedTab.closest('li').classList.add('is-active');

            // Show/hide appropriate content
            if (tabType === 'styles') {
                stylesTab.classList.remove('is-hidden');
                settingsTab.classList.add('is-hidden');
            } else if (tabType === 'settings') {
                settingsTab.classList.remove('is-hidden');
                stylesTab.classList.add('is-hidden');
            }
        });

        // Enhance button
        this.enhanceButton.addEventListener('click', () => this.enhancePrompt());

        // API Key storage
        document.getElementById('saveSettings').addEventListener('click', () => {
            localStorage.setItem('apiKey', this.apiKeyInput.value);
            this.showNotification('Settings saved successfully', 'is-success');
        });

        // Character count
        this.promptInput.addEventListener('input', () => this.updateCharCount());

        // Style checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.matches('#styleCheckboxes input[type="checkbox"]')) {
                this.updateOutputTabs();
            }
        });

        // Notification close button
        this.notification.querySelector('.delete').addEventListener('click', () => {
            this.notification.style.display = 'none';
        });
    }

    updateCharCount() {
        const count = this.promptInput.value.length;
        document.querySelector('.char-count').textContent = `${count} characters`;
    }

    initStylesUI() {
        // Create style checkboxes with cards
        this.styleCheckboxes.innerHTML = this.styles.map(style => `

                <div class="control p-3">
                    <label class="checkbox">
                        <input type="checkbox" value="${style.id}" checked>
                        <span class="icon-text ml-2">
                            <span class="icon">
                                <i class="fas ${style.icon}"></i>
                            </span>
                            <span class="has-text-weight-medium">${style.name}</span>
                        </span>
                    </label>
                    <p class="style-description">${style.description}</p>
                </div>
        `).join('');

        // Initialize output tabs
        this.updateOutputTabs();
    }

    getSelectedStyles() {
        const checkboxes = this.styleCheckboxes.querySelectorAll('input[type="checkbox"]');
        return Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => this.styles.find(style => style.id === cb.value))
            .filter(Boolean);
    }

    updateOutputTabs() {
        const selectedStyles = this.getSelectedStyles();

        // Update tabs
        this.outputTabs.innerHTML = `
            <ul>
                ${selectedStyles.map((style, index) => `
                    <li class="${index === 0 ? 'is-active' : ''}">
                        <a>
                            <span class="icon">
                                <i class="fas ${style.icon}"></i>
                            </span>
                            <span>${style.name}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;

        // Update output containers
        this.enhancedOutputs.innerHTML = selectedStyles.map((style, index) => `
            <div class="content ${index === 0 ? '' : 'is-hidden'}" data-style="${style.id}">
                <div class="field">
                    <div class="control">
                        <textarea class="textarea" readonly placeholder="Enhanced ${style.name} version will appear here..." rows="12"></textarea>
                    </div>
                    <button class="button is-small is-info mt-2 is-pulled-right copy-button">
                        <span class="icon">
                            <i class="fas fa-copy"></i>
                        </span>
                        <span>Copy</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Add tab click listeners
        this.outputTabs.querySelectorAll('li').forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Update tabs
                this.outputTabs.querySelectorAll('li').forEach(t => t.classList.remove('is-active'));
                tab.classList.add('is-active');

                // Update panels
                this.enhancedOutputs.querySelectorAll('.content').forEach(panel => panel.classList.add('is-hidden'));
                this.enhancedOutputs.querySelectorAll('.content')[index].classList.remove('is-hidden');
            });
        });

        // Add copy button listeners
        this.enhancedOutputs.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', (e) => this.copyToClipboard(e));
        });
    }

    showNotification(message, type = 'is-success') {
        // Remove existing type classes
        this.notification.classList.remove('is-success', 'is-danger', 'is-warning', 'is-info');
        // Add new type class
        this.notification.classList.add(type);

        this.notificationMessage.textContent = message;
        this.notification.style.display = 'block';

        // Hide after 3 seconds
        setTimeout(() => {
            this.notification.style.display = 'none';
        }, 3000);
    }

    async copyToClipboard(event) {
        const button = event.currentTarget;
        const textarea = button.parentElement.querySelector('textarea');

        try {
            await navigator.clipboard.writeText(textarea.value);

            // Show success feedback
            const originalHTML = button.innerHTML;
            button.classList.remove('is-info');
            button.classList.add('is-success');
            button.innerHTML = `
                <span class="icon">
                    <i class="fas fa-check"></i>
                </span>
                <span>Copied!</span>
            `;

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('is-success');
                button.classList.add('is-info');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showNotification('Failed to copy text to clipboard', 'is-danger');
        }
    }

    // Add this new method to your PromptEnhancer class
    extractContextFromPrompt(prompt) {
        // Extract potential context markers
        const contextPatterns = [
            // Role/persona definitions
            /(?:as a|you are|act as|assuming the role of) (.+?)(?:\.|,|\n|$)/i,
            // Given/context statements
            /(?:given that|considering that|in the context of|assuming) (.+?)(?:\.|,|\n|$)/i,
            // Background information
            /(?:background:|context:|scenario:) (.+?)(?:\n|$)/i,
            // Requirements or constraints
            /(?:requirements:|constraints:|must|should|needs to) (.+?)(?:\.|,|\n|$)/i
        ];

        let extractedContext = [];

        // Apply each pattern and collect matches
        for (const pattern of contextPatterns) {
            const match = prompt.match(pattern);
            if (match && match[1]) {
                extractedContext.push(match[1].trim());
            }
        }

        // If no context was found through patterns, take the first sentence as context
        if (extractedContext.length === 0) {
            const firstSentence = prompt.split(/[.!?]\s+/)[0];
            if (firstSentence && firstSentence.length < prompt.length) {
                extractedContext.push(firstSentence);
            }
        }

        return extractedContext.join(' ');
    }

    async enhancePrompt() {
        const prompt = this.promptInput.value.trim();
        const apiKey = this.apiKeyInput.value.trim();
        const preserveContext = this.contextCheckbox.checked;

        // Validation
        if (!prompt) {
            this.showNotification('Please enter a prompt to enhance', 'is-warning');
            return;
        }
        if (!apiKey) {
            this.showNotification('Please enter your API key', 'is-warning');
            return;
        }

        const selectedStyles = this.getSelectedStyles();
        if (selectedStyles.length === 0) {
            this.showNotification('Please select at least one enhancement style', 'is-warning');
            return;
        }

        // Extract context if enabled
        let context = '';
        if (preserveContext) {
            context = this.extractContextFromPrompt(prompt);
        }

        // Show loading state
        this.enhanceButton.classList.add('is-loading');

        try {
            // Process each selected style
            for (const style of selectedStyles) {
                try {
                    const messages = [
                        {
                            role: 'system',
                            content: `You are a prompt enhancement assistant. Enhance the following prompt according to this style: ${style.pattern}. Only respond with the enhanced prompt, nothing else.`
                        }
                    ];

                    // Add context preservation instruction if enabled
                    if (preserveContext && context) {
                        messages[0].content += `\n\nIMPORTANT: Preserve this context in your enhancement: "${context}"`
                    }

                    messages.push({
                        role: 'user',
                        content: prompt
                    });

                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4o-mini',
                            messages: messages,
                            temperature: 0.7
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`API Error: ${response.status}`);
                    }

                    const data = await response.json();
                    const enhancedPrompt = data.choices[0].message.content;

                    // Update corresponding output area
                    const outputArea = this.enhancedOutputs
                        .querySelector(`[data-style="${style.id}"] textarea`);
                    if (outputArea) {
                        outputArea.value = enhancedPrompt;
                    }
                } catch (error) {
                    console.error(`Error generating ${style.name} prompt:`, error);
                    this.showNotification(`Error generating ${style.name} version: ${error.message}`, 'is-danger');
                }
            }
        } finally {
            this.enhanceButton.classList.remove('is-loading');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PromptEnhancer();
});