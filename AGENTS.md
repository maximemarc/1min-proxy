# 1min-proxy - Agent Documentation

## Project Overview

This is a TypeScript-based OpenAI-compatible proxy for the 1min.ai API. It provides access to 50+ AI models through a standard OpenAI interface.

## Architecture

### Stack
- **Runtime**: Node.js 20+ with ES modules
- **Language**: TypeScript 5.3+
- **Framework**: Express.js 4.18+
- **Validation**: Zod
- **Logging**: Pino
- **Security**: Helmet + express-rate-limit
- **Testing**: Vitest

### Directory Structure

```
src/
├── server.ts           # Entry point, Express setup, middleware
├── client.ts           # 1min.ai API client with OOP architecture
├── models.ts           # Model mappings (OpenAI alias → 1min.ai ID)
├── router.ts           # Route definitions and native API endpoints
├── config/             # Configuration management
│   └── index.ts
├── handlers/           # OpenAI-compatible request handlers
│   ├── chat.ts         # Chat completions (+ streaming)
│   ├── images.ts       # Image generation/variations
│   ├── audio.ts        # TTS/STT
│   ├── embeddings.ts   # Stub (not implemented)
│   ├── models.ts       # Model listing
│   └── index.ts        # Re-exports
├── schemas/            # Zod validation schemas
│   └── index.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utilities
    ├── logger.ts       # Pino logger setup
    ├── errors.ts       # Custom error classes
    └── __tests__/      # Utility tests
```

## Key Components

### Client (`client.ts`)

The client uses an OOP architecture with separate classes for different API areas:

- `OneMinClient`: Base HTTP client
- `AssetAPI`: File uploads
- `ConversationAPI`: Chat session management
- `FeatureAPI`: AI features (chat, images, audio, video)
- `OneMinAPI`: Main facade combining all APIs

### Handlers (`handlers/`)

Each handler implements OpenAI-compatible endpoints:

- **ChatHandler**: Handles `/v1/chat/completions` with streaming support
- **ImagesHandler**: Handles `/v1/images/generations`, `/edits`, `/variations`
- **AudioHandler**: Handles `/v1/audio/speech`, `/transcriptions`, `/translations`

### Validation

All inputs are validated using Zod schemas in `schemas/index.ts`:

- `chatCompletionRequestSchema`
- `imageGenerationRequestSchema`
- `speechRequestSchema`
- etc.

### Error Handling

Custom error classes in `utils/errors.ts`:

- `APIError`: Base error with status code and JSON serialization
- `ValidationError`: 400 Bad Request
- `AuthenticationError`: 401 Unauthorized
- `NotFoundError`: 404 Not Found
- `RateLimitError`: 429 Too Many Requests
- `NotImplementedError`: 501 Not Implemented

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev           # Start with hot reload (tsx watch)

# Building
npm run build         # Compile TypeScript to dist/
npm start            # Run compiled server

# Code Quality
npm run lint         # ESLint check
npm run lint:fix     # ESLint fix
npm run format       # Prettier format
npm run format:check # Prettier check
npm run typecheck    # TypeScript check (no emit)

# Testing
npm run test         # Run tests
npm run test:coverage # Run with coverage
```

### Adding New Features

1. **Add types** to `types/index.ts`
2. **Add schema** to `schemas/index.ts` for validation
3. **Implement handler** in `handlers/<feature>.ts`
4. **Add routes** in `router.ts`
5. **Add tests** in `__tests__/` or `utils/__tests__/`

### Adding New Models

Edit `models.ts` and add to the appropriate mapping:

```typescript
export const CHAT_MODELS: Record<string, string> = {
  // Add your model alias
  'my-model': 'actual-1min-model-id',
};
```

## Environment Variables

See `.env.example` for all options. Key variables:

- `ONEMIN_API_KEY` - Required API key
- `PORT` - Server port (default: 3456)
- `NODE_ENV` - environment (development/production)
- `RATE_LIMIT_*` - Rate limiting configuration
- `LOG_LEVEL` - debug/info/warn/error

## Docker

The Dockerfile uses multi-stage build:

1. **Builder stage**: Installs deps, compiles TypeScript
2. **Production stage**: Copies only dist/ and runs with node user

## Security Considerations

- Rate limiting is enabled by default
- Helmet headers are applied
- CORS is configurable
- Non-root user in Docker
- Input validation via Zod

## CI/CD

GitHub Actions workflows:

- `ci.yml`: Lint, typecheck, test, build
- `docker-publish.yml`: Build and push Docker image to GHCR

Both run on push to main and on PRs.
