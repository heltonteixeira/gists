// Constants
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini'; // Using GPT-4 Turbo as specified

class PromptEnhancer {
    constructor() {
        this.form = document.getElementById('promptForm');
        this.originalPrompt = document.getElementById('originalPrompt');
        this.variations = {
            1: document.getElementById('variation1'),
            2: document.getElementById('variation2'),
            3: document.getElementById('variation3')
        };

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async generateEnhancedPrompt(originalPrompt, style) {
        try {
            const response = await fetch(OPENAI_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer <API-KEY>` // Replace with actual API key
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert prompt engineering assistant specialized in prompt enhancement. Your task is to analyze and reconstruct the given prompt following this enhancement pattern: ${style}. 

    Guidelines:
    - Maintain the original intent and core meaning
    - Follow the specified style pattern exactly
    - Preserve any technical requirements or constraints
    - Ensure the enhanced prompt is self-contained
    - Structure the prompt logically
    
    Enhancement Style: ${style}
    
    Only output the enhanced prompt without explanations or meta-commentary.`
                        },
                        {
                            role: 'user',
                            content: originalPrompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const prompt = this.originalPrompt.value.trim();

        if (!prompt) return;

        // Clear previous results
        Object.values(this.variations).forEach(textarea => {
            if (textarea) {  // Add null check
                textarea.value = 'Generating...';
            }
        });

        try {
            // Generate three variations simultaneously
            const variations = await Promise.all([
                this.generateEnhancedPrompt(prompt, `DETAILED & SPECIFIC, Expand core concepts with explicit parameters, Add relevant context and constraints, Include specific examples where helpful, Define success criteria and edge cases, Break down complex requirements into clear steps`),
                this.generateEnhancedPrompt(prompt, `CONCISE & POWERFUL, Distill the prompt to its essential elements, Use precise, impactful language, Remove redundancies while preserving meaning, Maintain clarity through strategic word choice, Focus on actionable instructions`),
                this.generateEnhancedPrompt(prompt, `TECHNICAL & STRUCTURED, Incorporate domain-specific terminology, Add technical parameters and constraints, Structure the prompt using clear hierarchies, Include input/output specifications, Define technical success criteria`)
            ]);

            // Update textareas with results
            variations.forEach((variation, index) => {
                const textarea = this.variations[index + 1];
                if (textarea) {  // Add null check
                    textarea.value = variation;
                }
            });
        } catch (error) {
            console.error('Error generating prompts:', error);
            Object.values(this.variations).forEach(textarea => {
                if (textarea) {  // Add null check
                    textarea.value = 'Error generating prompt. Please try again.';
                }
            });
        }
    }
}

// Initialize the enhancer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PromptEnhancer();
});