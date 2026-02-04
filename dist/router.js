import { Router } from 'express';
import { OneMinAPI } from './client.js';
import { ChatHandler, ImagesHandler, AudioHandler, EmbeddingsHandler, ModelsHandler, } from './handlers/index.js';
import { conversationCreateSchema, featureRequestSchema } from './schemas/index.js';
import { APIError, ValidationError } from './utils/errors.js';
import { logger } from './utils/logger.js';
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
    router.post('/v1/chat/completions', (req, res) => {
        void chatHandler.handle(req, res);
    });
    // ==================== IMAGES ====================
    router.post('/v1/images/generations', (req, res) => {
        void imagesHandler.generate(req, res);
    });
    router.post('/v1/images/edits', (req, res) => {
        void imagesHandler.edit(req, res);
    });
    router.post('/v1/images/variations', (req, res) => {
        void imagesHandler.variations(req, res);
    });
    // ==================== AUDIO ====================
    router.post('/v1/audio/speech', (req, res) => {
        void audioHandler.speech(req, res);
    });
    router.post('/v1/audio/transcriptions', (req, res) => {
        void audioHandler.transcription(req, res);
    });
    router.post('/v1/audio/translations', (req, res) => {
        void audioHandler.translation(req, res);
    });
    // ==================== EMBEDDINGS ====================
    router.post('/v1/embeddings', (req, res) => {
        void embeddingsHandler.create(req, res);
    });
    // ==================== MODELS ====================
    router.get('/v1/models', (req, res) => {
        void modelsHandler.list(req, res);
    });
    router.get('/v1/models/:model', (req, res) => {
        void modelsHandler.get(req, res);
    });
    // ==================== 1MIN.AI NATIVE ENDPOINTS ====================
    // Assets
    router.post('/api/assets', async (req, res) => {
        try {
            const { file, filename } = req.body;
            const result = await api.assets.upload(file, filename);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // Conversations
    router.post('/api/conversations', async (req, res) => {
        try {
            const parseResult = conversationCreateSchema.safeParse(req.body);
            if (!parseResult.success) {
                throw new ValidationError('Invalid request body', parseResult.error.format());
            }
            const result = await api.conversations.create(parseResult.data);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    router.get('/api/conversations', async (_req, res) => {
        try {
            const result = await api.conversations.list();
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    router.get('/api/conversations/:id', async (req, res) => {
        try {
            const result = await api.conversations.get(req.params.id);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    router.delete('/api/conversations/:id', async (req, res) => {
        try {
            const result = await api.conversations.delete(req.params.id);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // Features (native 1min.ai)
    router.post('/api/features', async (req, res) => {
        try {
            const parseResult = featureRequestSchema.safeParse(req.body);
            if (!parseResult.success) {
                throw new ValidationError('Invalid request body', parseResult.error.format());
            }
            const result = await api.features.call(parseResult.data);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    router.post('/api/features/stream', async (req, res) => {
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
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // ==================== EXTENDED FEATURES ====================
    // Image generation (1min.ai native)
    router.post('/api/image/generate', async (req, res) => {
        try {
            const { model, prompt, ...options } = req.body;
            const result = await api.features.generateImage(model, prompt, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // Image variation
    router.post('/api/image/variation', async (req, res) => {
        try {
            const { model, imageUrl, ...options } = req.body;
            const result = await api.features.imageVariation(model, imageUrl, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // Image upscale
    router.post('/api/image/upscale', async (req, res) => {
        try {
            const { model, imageUrl, ...options } = req.body;
            const result = await api.features.upscaleImage(model, imageUrl, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // Background removal
    router.post('/api/image/remove-background', async (req, res) => {
        try {
            const { model, imageUrl, ...options } = req.body;
            const result = await api.features.removeBackground(model, imageUrl, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // Background replacement
    router.post('/api/image/replace-background', async (req, res) => {
        try {
            const { model, imageUrl, newBackground, ...options } = req.body;
            const result = await api.features.replaceBackground(model, imageUrl, newBackground, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // Image to prompt
    router.post('/api/image/to-prompt', async (req, res) => {
        try {
            const { model, imageUrl, ...options } = req.body;
            const result = await api.features.imageToPrompt(model, imageUrl, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // TTS
    router.post('/api/audio/tts', async (req, res) => {
        try {
            const { model, text, ...options } = req.body;
            const result = await api.features.textToSpeech(model, text, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // STT
    router.post('/api/audio/stt', async (req, res) => {
        try {
            const { model, audioUrl, ...options } = req.body;
            const result = await api.features.speechToText(model, audioUrl, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // Video generation
    router.post('/api/video/generate', async (req, res) => {
        try {
            const { model, prompt, ...options } = req.body;
            const result = await api.features.generateVideo(model, prompt, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    // Image to video
    router.post('/api/video/from-image', async (req, res) => {
        try {
            const { model, imageUrl, ...options } = req.body;
            const result = await api.features.imageToVideo(model, imageUrl, options);
            res.json(result);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    return router;
}
function handleError(err, res) {
    logger.error({ err }, 'Router error');
    if (err instanceof APIError) {
        res.status(err.statusCode).json(err.toJSON());
    }
    else {
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
//# sourceMappingURL=router.js.map