# DeepSeek Provider

## Overview

The DeepSeek provider implementation for the Agentic Assistant project. This provider integrates with the DeepSeek API to provide chat completions, streaming responses, and balance checking functionality.

## Features

- Chat completions with streaming support
- Balance checking
- Model information retrieval
- Error handling and type safety

## Technical Details

### Model Specifications

- Model ID: deepseek-chat
- Context Window: 128K tokens
- Maximum Output: 4K tokens (8K in beta)

### API Integration

The provider implements three main interfaces:

1. `sendMessage`: Streams chat completions
2. `checkBalance`: Retrieves account balance
3. `getModels`: Returns available models

### Usage Example

```typescript
import { DeepSeekProvider } from './DeepSeekProvider';

// Initialize provider
const provider = new DeepSeekProvider('your-api-key');

// Send a message
const response = await provider.sendMessage('Hello, world!');
console.log(response.text);

// Check balance
const balance = await provider.checkBalance();
console.log(`Balance: ${balance.amount} ${balance.currency}`);

// Get available models
const models = await provider.getModels();
console.log('Available models:', models);
```

## Error Handling

The provider includes comprehensive error handling for:

- API authentication errors
- Network failures
- Invalid responses
- Stream processing errors

## Testing

Unit tests are implemented using vitest and cover:

- Message streaming
- Balance checking
- Model information retrieval
- Error scenarios

Run tests using:

```bash
npm run test
```

## Dependencies

- TypeScript for type safety
- Web Streams API for response streaming
- Fetch API for network requests
