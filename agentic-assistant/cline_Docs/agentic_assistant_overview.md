# Agent Testing Interface

A lightweight, browser-based interface for testing and comparing different AI agent configurations across multiple providers. Built with modern web standards and combining minimalist, flat and asymmetrical design with a focus on simplicity and ease of use.

## Core Design Principles

- **Provider Agnostic**: Support for multiple AI providers (starting with DeepSeek)
- **Simplicity First**: Minimal dependencies, straightforward implementation
- **Focus on Testing**: Optimized for comparing different agent configurations
- **Modern Standards**: Uses ES6+ features while maintaining broad compatibility
- **Flat and Asymmetrical**: Minimal design with a focus on simplicity and ease of use

## Supported Providers

### DeepSeek

- Models: deepseek-chat
- Features:
  - Chat completions
  - Streaming responses
  - Balance checking
  - Context window: 128K tokens
  - Maximum output: 4K tokens (8K in beta)

### OpenAI

- Models: gpt-4o, gpt-4o-mini
- Features:
  - Chat completions
  - Streaming responses
  - Balance checking
  - Prompt Caching
  - Context window: 128k tokens
  - Maximum output: 16k tokens

### Anthropic

- Models: claude-3-5-sonnet-20241022, claude-3-haiku-20240307
- Features:
  - Chat completions
  - Streaming responses
  - Balance checking
  - Prompt caching
  - Context window: 200k tokens
  - Max output: 4k tokens (8k for sonnet model)

### Future Providers (Planned)

- Gemini
- Sambanova
- OpenAI compatible providers

## Key Features

### 1. Provider & Model Management

- Select between different AI providers
- Choose available models per provider
- Save API keys securely
- Monitor usage and balance

### 2. Agent Management

- Create and manage multiple agent configurations
- Save and load agent presets
- Quick A/B testing between different configurations
- Visual differentiation between agents in conversation

### 3. Conversation Interface

- Split-view mode for parallel agent testing
- Real-time streaming responses
- Markdown and code syntax highlighting
- Conversation export/import functionality
- Clear conversation history option

### 4. Configuration Options

- Provider selection
- Model selection (provider-specific)
- Temperature control (0-2 range, provider-specific)
- Maximum token limit (provider-specific)
- System prompt customization
- Response format selection
- Stream toggle

### Core Components

1. **Provider Interface**
   - Abstract provider class
   - Standardized request and response handling
   - Provider-specific implementations
   - Model management
   - API key handling

2. **Agent System**
   - Agent configuration
   - Message handling
   - Response processing
   - History management

3. **UI Components**
   - Chat interface
   - Configuration panels
   - Provider selection
   - Model selection

4. **Storage System**
   - Configuration persistence
   - History management
   - Secure API key storage

## Security Considerations

1. **API Key Management**
   - Secure storage in browser
   - Encrypted when possible
   - Never exposed in UI

2. **Request Security**
   - HTTPS only
   - Input validation
   - Rate limiting handling

3. **Data Protection**
   - Local storage encryption
   - Session management
   - Clear data option

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- LocalStorage API support needed
- Secure Context required for certain features

## Future Improvements

1. Message Threading
   - Add support for branching conversations
   - Implement conversation forking

2. Enhanced Analysis
   - Add response time tracking
   - Implement token usage monitoring
   - Add cost estimation features

3. UI Enhancements
   - Dark mode support
   - Custom themes
   - Responsive design for mobile devices

4. Export Features
   - PDF export
   - Conversation sharing
   - Configuration presets sharing

This implementation provides a solid foundation for agent testing while remaining simple and maintainable. The modular structure allows for easy extensions and modifications as needed.
