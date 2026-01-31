# 1min-proxy

OpenAI-compatible proxy for [1min.ai](https://1min.ai) API.

Allows you to use 1min.ai's models (Claude, GPT, Gemini, Mistral, Llama, etc.) with any OpenAI-compatible client.

## Features

- 🔄 Translates OpenAI API format to 1min.ai format
- 🌊 Supports both streaming and non-streaming responses
- 🤖 Multiple model support (Claude, GPT, Gemini, Mistral, Llama)
- 🐳 Docker ready

## Available Models

| Alias | 1min.ai Model |
|-------|---------------|
| `claude-haiku` | claude-3-5-haiku-20241022 |
| `claude-sonnet` | claude-3-5-sonnet-20241022 |
| `claude-opus` | claude-3-opus-20240229 |
| `gpt-4o` | gpt-4o |
| `gpt-4o-mini` | gpt-4o-mini |
| `gemini-1.5-pro` | gemini-1.5-pro |
| `gemini-1.5-flash` | gemini-1.5-flash |
| `mistral-large` | mistral-large-latest |
| `llama-3.1-405b` | llama-3.1-405b-instruct |

## Quick Start

### Local

```bash
npm install
cp .env.example .env
# Edit .env with your 1min.ai API key
npm start
```

### Docker

```bash
cp .env.example .env
# Edit .env with your 1min.ai API key
docker compose up -d
```

## Usage

The proxy exposes an OpenAI-compatible endpoint at `http://localhost:3456/v1/chat/completions`.

```bash
curl http://localhost:3456/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ONEMIN_API_KEY` | Your 1min.ai API key | Required |
| `PORT` | Server port | 3456 |

## License

MIT
