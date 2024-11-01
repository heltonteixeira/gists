import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeepSeekProvider } from '../DeepSeekProvider';
import type { Mock } from 'vitest';

// Extend the global fetch type for testing
declare global {
    interface Window {
        fetch: Mock<(...args: Parameters<typeof fetch>) => Promise<Response>>;
    }
}

describe('DeepSeekProvider', () => {
    let provider: DeepSeekProvider;
    const mockApiKey = 'test-api-key';

    beforeEach(() => {
        provider = new DeepSeekProvider(mockApiKey);
        // Reset all mocks before each test
        vi.resetAllMocks();
    });

    describe('sendMessage', () => {
        it('should handle streaming response correctly', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":" World"}}]}\n'));
                    controller.enqueue(new TextEncoder().encode('data: [DONE]\n'));
                    controller.close();
                }
            });

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse,
                statusText: 'OK'
            } as Response));

            const result = await provider.sendMessage('Test message');
            expect(result).toEqual({
                text: 'Hello World',
                isComplete: true
            });

            expect(fetch).toHaveBeenCalledWith(
                'https://api.deepseek.com/v1/chat/completions',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer test-api-key'
                    }
                })
            );
        });

        it('should handle API errors', async () => {
            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                ok: false,
                statusText: 'Bad Request'
            } as Response));

            await expect(provider.sendMessage('Test message')).rejects.toThrow('DeepSeek API error: Bad Request');
        });
    });

    describe('checkBalance', () => {
        it('should return correct balance', async () => {
            const mockBalance = {
                total_credits: 100
            };

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockBalance)
            } as Response));

            const result = await provider.checkBalance();
            expect(result).toEqual({
                amount: 100,
                currency: 'USD'
            });

            expect(fetch).toHaveBeenCalledWith(
                'https://api.deepseek.com/v1/dashboard/billing/credit',
                expect.objectContaining({
                    headers: {
                        'Authorization': 'Bearer test-api-key'
                    }
                })
            );
        });

        it('should handle balance check errors', async () => {
            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                ok: false,
                statusText: 'Unauthorized'
            } as Response));

            await expect(provider.checkBalance()).rejects.toThrow('DeepSeek API error: Unauthorized');
        });
    });

    describe('getModels', () => {
        it('should return available models', async () => {
            const models = await provider.getModels();
            expect(models).toEqual([{
                id: 'deepseek-chat',
                name: 'DeepSeek Chat',
                contextWindow: 128000,
                maxOutputTokens: 4000
            }]);
        });
    });

    describe('getName', () => {
        it('should return provider name', () => {
            expect(provider.getName()).toBe('DeepSeek');
        });
    });
});
