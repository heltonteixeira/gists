export interface StreamResponse {
    text: string;
    isComplete: boolean;
}

export interface Balance {
    amount: number;
    currency: string;
}

export interface Model {
    id: string;
    name: string;
    contextWindow: number;
    maxOutputTokens: number;
}

export interface AIProvider {
    /**
     * Send a message to the AI provider and receive a streaming response
     * @param message The message to send
     * @returns A promise that resolves to a StreamResponse
     */
    sendMessage(message: string): Promise<StreamResponse>;

    /**
     * Check the current balance for the provider
     * @returns A promise that resolves to the current balance
     */
    checkBalance(): Promise<Balance>;

    /**
     * Get the list of available models for this provider
     * @returns A promise that resolves to an array of available models
     */
    getModels(): Promise<Model[]>;

    /**
     * Get the name of the provider
     * @returns The provider name
     */
    getName(): string;
}

export abstract class BaseAIProvider implements AIProvider {
    protected apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    abstract sendMessage(message: string): Promise<StreamResponse>;
    abstract checkBalance(): Promise<Balance>;
    abstract getModels(): Promise<Model[]>;
    abstract getName(): string;
}
