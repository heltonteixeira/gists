import { Balance, Model, StreamResponse, BaseAIProvider } from '../base/AIProvider';

interface DeepSeekResponse {
    choices: Array<{
        delta: {
            content?: string;
        };
    }>;
}

interface DeepSeekBalanceResponse {
    total_credits: number;
}

export class DeepSeekProvider extends BaseAIProvider {
    private static readonly API_URL = 'https://api.deepseek.com/v1';
    private static readonly MODEL_ID = 'deepseek-chat';

    constructor(apiKey: string) {
        super(apiKey);
    }

    async sendMessage(message: string): Promise<StreamResponse> {
        try {
            const response = await fetch(`${DeepSeekProvider.API_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: DeepSeekProvider.MODEL_ID,
                    messages: [{ role: 'user', content: message }],
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`DeepSeek API error: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get response reader');
            }

            let text = '';
            let isComplete = false;

            // Process the stream
            while (!isComplete) {
                const { done, value } = await reader.read();
                if (done) {
                    isComplete = true;
                    break;
                }

                // Convert the chunk to text and append to the response
                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            isComplete = true;
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data) as DeepSeekResponse;
                            const content = parsed.choices[0]?.delta?.content ?? '';
                            text += content;
                        } catch (e) {
                            console.error('Failed to parse chunk:', e);
                        }
                    }
                }
            }

            return { text, isComplete };
        } catch (error) {
            throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async checkBalance(): Promise<Balance> {
        try {
            const response = await fetch(`${DeepSeekProvider.API_URL}/dashboard/billing/credit`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`DeepSeek API error: ${response.statusText}`);
            }

            const data = (await response.json()) as DeepSeekBalanceResponse;
            return {
                amount: data.total_credits,
                currency: 'USD'
            };
        } catch (error) {
            throw new Error(`Failed to check balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    getModels(): Promise<Model[]> {
        // Since this is a static list, we can return it wrapped in Promise.resolve
        return Promise.resolve([{
            id: DeepSeekProvider.MODEL_ID,
            name: 'DeepSeek Chat',
            contextWindow: 128000, // 128K tokens
            maxOutputTokens: 4000  // 4K tokens (8K in beta)
        }]);
    }

    getName(): string {
        return 'DeepSeek';
    }
}
