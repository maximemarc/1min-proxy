/**
 * Express Router with all OpenAI-compatible endpoints
 */

import { Router } from 'express';
import { OneMinAPI } from './client.js';
import { ChatHandler } from './handlers/chat.js';
import { ImagesHandler } from './handlers/images.js';
import { AudioHandler } from './handlers/audio.js';
import { EmbeddingsHandler } from './handlers/embeddings.js';
import { ModelsHandler } from './handlers/models.js';

export function createRouter(apiKey) {
  const router = Router();
  
  // Initialize API client and handlers
  const api = new OneMinAPI(apiKey);
  const chatHandler = new ChatHandler(api);
  const imagesHandler = new ImagesHandler(api);
  const audioHandler = new AudioHandler(api);
  const embeddingsHandler = new EmbeddingsHandler(api);
  const modelsHandler = new ModelsHandler(api);

  // ==================== CHAT ====================
  
  router.post('/v1/chat/completions', (req, res) => chatHandler.handle(req, res));

  // ==================== IMAGES ====================
  
  router.post('/v1/images/generations', (req, res) => imagesHandler.generate(req, res));
  router.post('/v1/images/edits', (req, res) => imagesHandler.edit(req, res));
  router.post('/v1/images/variations', (req, res) => imagesHandler.variations(req, res));

  // ==================== AUDIO ====================
  
  router.post('/v1/audio/speech', (req, res) => audioHandler.speech(req, res));
  router.post('/v1/audio/transcriptions', (req, res) => audioHandler.transcription(req, res));
  router.post('/v1/audio/translations', (req, res) => audioHandler.translation(req, res));

  // ==================== EMBEDDINGS ====================
  
  router.post('/v1/embeddings', (req, res) => embeddingsHandler.create(req, res));

  // ==================== MODELS ====================
  
  router.get('/v1/models', (req, res) => modelsHandler.list(req, res));
  router.get('/v1/models/:model', (req, res) => modelsHandler.get(req, res));

  // ==================== 1MIN.AI NATIVE ENDPOINTS ====================
  
  // Assets
  router.post('/api/assets', async (req, res) => {
    try {
      const result = await api.assets.upload(req.body.file, req.body.filename);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // Conversations
  router.post('/api/conversations', async (req, res) => {
    try {
      const result = await api.conversations.create(req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  router.get('/api/conversations', async (req, res) => {
    try {
      const result = await api.conversations.list();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  router.get('/api/conversations/:id', async (req, res) => {
    try {
      const result = await api.conversations.get(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  router.delete('/api/conversations/:id', async (req, res) => {
    try {
      const result = await api.conversations.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // Features (native 1min.ai)
  router.post('/api/features', async (req, res) => {
    try {
      const result = await api.features.call(req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  router.post('/api/features/stream', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      const stream = await api.features.stream(req.body);
      const reader = stream.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // ==================== EXTENDED FEATURES ====================

  // Image generation (1min.ai native)
  router.post('/api/image/generate', async (req, res) => {
    try {
      const { model, prompt, ...options } = req.body;
      const result = await api.features.generateImage(model, prompt, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // Image variation
  router.post('/api/image/variation', async (req, res) => {
    try {
      const { model, imageUrl, ...options } = req.body;
      const result = await api.features.imageVariation(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // Image upscale
  router.post('/api/image/upscale', async (req, res) => {
    try {
      const { model, imageUrl, ...options } = req.body;
      const result = await api.features.upscaleImage(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // Background removal
  router.post('/api/image/remove-background', async (req, res) => {
    try {
      const { model, imageUrl, ...options } = req.body;
      const result = await api.features.removeBackground(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // Background replacement
  router.post('/api/image/replace-background', async (req, res) => {
    try {
      const { model, imageUrl, newBackground, ...options } = req.body;
      const result = await api.features.replaceBackground(model, imageUrl, newBackground, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // Image to prompt
  router.post('/api/image/to-prompt', async (req, res) => {
    try {
      const { model, imageUrl, ...options } = req.body;
      const result = await api.features.imageToPrompt(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // TTS
  router.post('/api/audio/tts', async (req, res) => {
    try {
      const { model, text, ...options } = req.body;
      const result = await api.features.textToSpeech(model, text, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // STT
  router.post('/api/audio/stt', async (req, res) => {
    try {
      const { model, audioUrl, ...options } = req.body;
      const result = await api.features.speechToText(model, audioUrl, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // Video generation
  router.post('/api/video/generate', async (req, res) => {
    try {
      const { model, prompt, ...options } = req.body;
      const result = await api.features.generateVideo(model, prompt, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  // Image to video
  router.post('/api/video/from-image', async (req, res) => {
    try {
      const { model, imageUrl, ...options } = req.body;
      const result = await api.features.imageToVideo(model, imageUrl, options);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: { message: err.message } });
    }
  });

  return router;
}

export default createRouter;
