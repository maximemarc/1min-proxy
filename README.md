# 1min-proxy

OpenAI-compatible proxy for [1min.ai](https://1min.ai) API.

Access 50+ AI models (Claude, GPT, Gemini, Mistral, Llama, Flux, DALL-E, etc.) with a single API key through a fully OpenAI-compatible interface.

## Features

- 🔄 **Full OpenAI Compatibility** - Drop-in replacement for OpenAI SDK
- 🌊 **Streaming Support** - Real-time responses
- 🤖 **50+ Models** - Claude, GPT, Gemini, Mistral, Llama, DeepSeek, Qwen, Grok...
- 🎨 **Image Generation** - DALL-E, Flux, Stable Diffusion, Midjourney-style
- 🔊 **Audio** - Text-to-speech, transcription, translation
- 🎬 **Video** - Text-to-video, image-to-video
- 🐳 **Docker Ready** - Easy deployment

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

### Docker Hub

```bash
docker run -d -p 3456:3456 -e ONEMIN_API_KEY=your_key ghcr.io/maximemarc/1min-proxy:main
```

## API Endpoints

### OpenAI-Compatible

| Endpoint | Description |
|----------|-------------|
| `POST /v1/chat/completions` | Chat completions (streaming supported) |
| `POST /v1/images/generations` | Image generation |
| `POST /v1/images/variations` | Image variations |
| `POST /v1/audio/speech` | Text-to-speech |
| `POST /v1/audio/transcriptions` | Speech-to-text |
| `POST /v1/audio/translations` | Audio translation |
| `GET /v1/models` | List available models |

### Native 1min.ai

| Endpoint | Description |
|----------|-------------|
| `POST /api/features` | All AI features |
| `POST /api/features/stream` | Streaming features |
| `POST /api/conversations` | Create conversation |
| `POST /api/assets` | Upload assets |
| `POST /api/image/generate` | Generate image |
| `POST /api/image/upscale` | Upscale image |
| `POST /api/image/remove-background` | Remove background |
| `POST /api/audio/tts` | Text-to-speech |
| `POST /api/video/generate` | Generate video |

## Available Models

### Chat Models

| Model | Alias |
|-------|-------|
| Claude 3.5 Haiku | `claude-haiku` |
| Claude 3.5 Sonnet | `claude-sonnet` |
| Claude 3 Opus | `claude-opus` |
| GPT-4o | `gpt-4o` |
| GPT-4o Mini | `gpt-4o-mini` |
| Gemini 1.5 Pro | `gemini-1.5-pro` |
| Gemini 2.0 Flash | `gemini-2.0-flash` |
| Mistral Large | `mistral-large` |
| Llama 3.1 405B | `llama-3.1-405b` |
| DeepSeek Chat | `deepseek-chat` |
| DeepSeek Reasoner | `deepseek-reasoner` |
| Qwen Max | `qwen-max` |
| Grok 2 | `grok-2` |

### Image Models

| Model | Alias |
|-------|-------|
| DALL-E 3 | `dall-e-3` |
| Flux Pro | `flux-pro` |
| Flux Schnell | `flux-schnell` |
| Stable Diffusion XL | `sdxl` |
| Leonardo Phoenix | `leonardo-phoenix` |
| Magic Art 7.0 | `magic-art-7.0` |

### Audio Models

| Model | Alias |
|-------|-------|
| TTS-1 | `tts-1` |
| TTS-1 HD | `tts-1-hd` |
| Whisper | `whisper-1` |
| ElevenLabs | `elevenlabs` |

## Usage Examples

### Chat Completion

```bash
curl http://localhost:3456/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Image Generation

```bash
curl http://localhost:3456/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flux-schnell",
    "prompt": "A beautiful sunset over mountains",
    "n": 1,
    "size": "1024x1024"
  }'
```

### With OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3456/v1",
    api_key="your-1min-api-key"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:3456/v1',
  apiKey: 'your-1min-api-key',
});

const response = await client.chat.completions.create({
  model: 'claude-haiku',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);
```

## Project Structure

```
1min-proxy/
├── server.js           # Express server
├── src/
│   ├── client.js       # 1min.ai API client (OOP)
│   ├── models.js       # Model definitions & mappings
│   ├── router.js       # Express router
│   └── handlers/
│       ├── chat.js     # Chat completions handler
│       ├── images.js   # Images handler
│       ├── audio.js    # Audio handler
│       ├── embeddings.js
│       └── models.js   # Models list handler
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ONEMIN_API_KEY` | Your 1min.ai API key | Required |
| `PORT` | Server port | 3456 |

## License

MIT
