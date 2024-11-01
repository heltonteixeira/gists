# Technical Specification

## Technology Stack

### Core Technologies

- **React 18+**: Frontend framework
  - Leverages concurrent features for better streaming performance
  - Component-based architecture for maintainable UI
  - Strong TypeScript support
  - Excellent state management options

- **Vite**: Build tool and dev server
  - Fast hot module replacement
  - Modern development experience
  - Efficient build process
  - Native ESM support

### Additional Dependencies

- **TypeScript**: For type safety and better developer experience
- **TanStack Query**: For API state management and caching
- **Zustand**: For global state management (lightweight alternative to Redux)
- **React Router**: For routing and view management
- **Tailwind CSS**: For implementing our design system
  - Perfect for flat, minimalist design
  - Easy to maintain
  - Great for responsive design
  - Custom configuration for our design system
- **Vitest**: For testing
  - Unit testing with happy-dom environment
  - Integration with Vite
  - Fast test execution
  - Built-in TypeScript support

## Project Structure

```text
src/
├── components/         # Reusable UI components
│   ├── common/        # Basic UI elements
│   ├── chat/          # Chat interface components
│   ├── config/        # Configuration components
│   └── layout/        # Layout components
├── providers/         # AI provider implementations
│   ├── base/          # Base provider interface
│   │   └── AIProvider.ts  # Core provider interfaces
│   ├── deepseek/      # DeepSeek implementation
│   │   ├── DeepSeekProvider.ts  # Provider implementation
│   │   ├── README.md           # Provider documentation
│   │   └── __tests__/         # Provider tests
│   ├── openai/        # OpenAI implementation (planned)
│   └── anthropic/     # Anthropic implementation (planned)
├── hooks/            # Custom React hooks
├── stores/           # Zustand stores
├── types/            # TypeScript definitions
├── utils/            # Utility functions
├── styles/           # Global styles and Tailwind config
└── views/            # Main view components
```

## Key Technical Decisions

### 1. State Management

- Zustand for global state
  - Agent configurations
  - Provider settings
  - UI preferences
- TanStack Query for API state
  - Chat history
  - Provider responses
  - Balance checking

### 2. API Architecture

- Provider interface pattern

  ```typescript
  interface AIProvider {
    sendMessage(message: string): Promise<StreamResponse>;
    checkBalance(): Promise<Balance>;
    getModels(): Promise<Model[]>;
    getName(): string;
  }
  ```

- Streaming implementation using Web Streams API
- Error boundary implementation for resilience

### 3. Component Architecture

- Atomic design principles
- Compound components where appropriate
- Render props for complex state sharing
- Custom hooks for reusable logic

### 4. Performance Considerations

- Code splitting for each provider
- Lazy loading for non-critical components
- Memoization for expensive computations
- Virtual scrolling for chat history

### 5. Testing Strategy

- Vitest for unit testing
  - Happy-dom for DOM environment
  - Mock implementations for API calls
  - Comprehensive provider testing
- React Testing Library for component testing
- Playwright for E2E testing
- MSW for API mocking

## Development Setup

### Prerequisites

```bash
node >= 18.0.0
npm >= 8.0.0
```

### Initial Setup

```bash
# Create new Vite project with React and TypeScript
npm create vite@latest agentic-assistant -- --template react-ts

# Install core dependencies
npm install @tanstack/react-query zustand react-router-dom

# Install development dependencies
npm install -D tailwindcss postcss autoprefixer typescript @types/react vitest @vitest/ui happy-dom
```

### Configuration Files

Key configuration changes made to improve TypeScript and ESLint integration:

#### tsconfig.json

```json
{
    "compilerOptions": {
        // ... other options remain unchanged
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    }
}
```

#### .eslintrc.json (new file)

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### .eslintignore (new file)

```text
node_modules
dist
coverage
*.config.js
*.config.ts
vite-env.d.ts
```

#### .vscode/settings.json (new file)

```json
{
    "typescript.tsdk": "node_modules/typescript/lib",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

#### .vscode/extensions.json (new file)

```json
{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-typescript-next"
    ]
}
```

#### src/env.d.ts

```typescript
declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
}
```

#### src/main.tsx

```typescript
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

#### Dependencies Updated

```bash
# TypeScript version downgraded for compatibility
typescript@5.3.3

# ESLint plugins installed
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
eslint-plugin-react-hooks
eslint-plugin-react-refresh
```

## Implementation Plan

### Phase 1: Project Setup ✓

1. Initialize Vite project with React and TypeScript
2. Configure Tailwind CSS
3. Set up project structure
4. Implement base provider interface

### Phase 2: Core Features

1. Implement DeepSeek provider ✓
   - API integration with streaming
   - Balance checking
   - Model selection
   - Unit testing
2. Create chat interface
3. Create configuration components
4. Set up state management

### Phase 3: Advanced Features

1. Add split view testing
2. Implement additional providers
3. Add export/import functionality
4. Implement performance optimizations

## Deployment Strategy

- Static site deployment
- Environment-based configuration
- CI/CD pipeline with GitHub Actions
- Automated testing before deployment

This technical specification provides a solid foundation for building the agent testing interface using React and Vite, while maintaining the principles of flat, minimalist, and asymmetrical design as specified in the whitepaper.
