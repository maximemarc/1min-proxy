import { Router } from 'express';
import type { Request, Response } from 'express';
import { OneMinAPI } from './client.js';
import {
  ChatHandler,
  ImagesHandler,
  AudioHandler,
  EmbeddingsHandler,
  ModelsHandler,
} from './handlers/index.js';
import { conversationCreateSchema, featureRequestSchema } from './schemas/index.js';
import { APIError, ValidationError } from './utils/errors.js';
import { logError } from './utils/logger.js';

export function createRouter(apiKey: string): Router {
  const router = Router();

  // Initialize API client and handlers
  const api = new OneMinAPI(apiKey);
  const chatHandler = new ChatHandler(api);
  const imagesHandler = new ImagesHandler(api);
  const audioHandler = new AudioHandler(api);
  const embeddingsHandler = new EmbeddingsHandler(api);
  const modelsHandler = new ModelsHandler(api);

  // ==================== CHAT ====================

  router.post('/v1/chat/completions', (req: Request, res: Response) => {
    void chatHandler.handle(req, res);
  });

  // ==================== IMAGES ====================

  router.post('/v1/images/generations', (req: Request, res: Response) => {
    void imagesHandler.generate(req, res);
  });

  router.post('/v1/images/edits', (req: Request, res: Response) => {
    void imagesHandler.edit(req, res);
  });

  router.post('/v1/images/variations', (req: Request, res: Response) => {
    void imagesHandler.variations(req, res);
  });

  // ==================== AUDIO ====================

  router.post('/v1/audio/speech', (req: Request, res: Response) => {
    void audioHandler.speech(req, res);
  });

  router.post('/v1/audio/transcriptions', (req: Request, res: Response) => {
    void audioHandler.transcription(req, res);
  });

  router.post('/v1/audio/translations', (req: Request, res: Response) => {
    void audioHandler.translation(req, res);
  });

  // ==================== EMBEDDINGS ====================

  router.post('/v1/embeddings', (req: Request, res: Response) => {
    void embeddingsHandler.create(req, res);
  });

  // ==================== MODELS ====================

  router.get('/v1/models', (req: Request, res: Response) => {
    void modelsHandler.list(req, res);
  });

  router.get('/v1/models/:model', (req: Request, res: Response) => {
    void modelsHandler.get(req, res);
  });

  // ==================== 1MIN.AI NATIVE ENDPOINTS ====================

  // Assets
  router.post('/api/assets', async (req: Request, res: Response) => {
    try {
      const { file, filename } = req.body as { file: Blob; filename: string };
      const result = await api.assets.upload(file, filename);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Conversations
  router.post('/api/conversations', async (req: Request, res: Response) => {
    try {
      const parseResult = conversationCreateSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.format());
      }

      const result = await api.conversations.create(parseResult.data);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  router.get('/api/conversations', async (_req: Request, res: Response) => {
    try {
      const result = await api.conversations.list();
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  router.get('/api/conversations/:id', async (req: Request, res: Response) => {
    try {
      const result = await api.conversations.get(req.params.id);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  router.delete('/api/conversations/:id', async (req: Request, res: Response) => {
    try {
      const result = await api.conversations.delete(req.params.id);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Features (native 1min.ai)
  router.post('/api/features', async (req: Request, res: Response) => {
    try {
      const parseResult = featureRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.format());
      }

      const result = await api.features.call(parseResult.data);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  router.post('/api/features/stream', async (req: Request, res: Response) => {
    try {
      const parseResult = featureRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.format());
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await api.features.stream(parseResult.data);
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        res.write(value);
      }
      res.end();
    } catch (err) {
      handleError(err, res);
    }
  });

  // ==================== EXTENDED FEATURES ====================

  // Image generation (1min.ai native)
  router.post('/api/image/generate', async (req: Request, res: Response) => {
    try {
      const { model, prompt, ...options } = req.body as {
        model: string;
        prompt: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.generateImage(model, prompt, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Image variation
  router.post('/api/image/variation', async (req: Request, res: Response) => {
    try {
      const { model, imageUrl, ...options } = req.body as {
        model: string;
        imageUrl: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.imageVariation(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Image upscale
  router.post('/api/image/upscale', async (req: Request, res: Response) => {
    try {
      const { model, imageUrl, ...options } = req.body as {
        model: string;
        imageUrl: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.upscaleImage(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Background removal
  router.post('/api/image/remove-background', async (req: Request, res: Response) => {
    try {
      const { model, imageUrl, ...options } = req.body as {
        model: string;
        imageUrl: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.removeBackground(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Background replacement
  router.post('/api/image/replace-background', async (req: Request, res: Response) => {
    try {
      const { model, imageUrl, newBackground, ...options } = req.body as {
        model: string;
        imageUrl: string;
        newBackground: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.replaceBackground(model, imageUrl, newBackground, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Image to prompt
  router.post('/api/image/to-prompt', async (req: Request, res: Response) => {
    try {
      const { model, imageUrl, ...options } = req.body as {
        model: string;
        imageUrl: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.imageToPrompt(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // TTS
  router.post('/api/audio/tts', async (req: Request, res: Response) => {
    try {
      const { model, text, ...options } = req.body as {
        model: string;
        text: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.textToSpeech(model, text, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // STT
  router.post('/api/audio/stt', async (req: Request, res: Response) => {
    try {
      const { model, audioUrl, ...options } = req.body as {
        model: string;
        audioUrl: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.speechToText(model, audioUrl, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Video generation
  router.post('/api/video/generate', async (req: Request, res: Response) => {
    try {
      const { model, prompt, ...options } = req.body as {
        model: string;
        prompt: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.generateVideo(model, prompt, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Image to video
  router.post('/api/video/from-image', async (req: Request, res: Response) => {
    try {
      const { model, imageUrl, ...options } = req.body as {
        model: string;
        imageUrl: string;
        extra?: Record<string, unknown>;
      };
      const result = await api.features.imageToVideo(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  });

  return router;
}

function handleError(err: unknown, res: Response): void {
  if (err instanceof Error) {
    logError(err, { context: 'router' });
  }

  if (err instanceof APIError) {
    res.status(err.statusCode).json(err.toJSON());
  } else {
    const error = err instanceof Error ? err : new Error('Unknown error');
    res.status(500).json({
      error: {
        message: error.message,
        type: 'server_error',
      },
    });
  }
}

// Default export for compatibility

export { createRouter as default };
