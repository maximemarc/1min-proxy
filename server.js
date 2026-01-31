/**
 * 1min-proxy - OpenAI-compatible proxy for 1min.ai
 * 
 * Provides full OpenAI API compatibility while routing requests
 * through the 1min.ai API for access to multiple AI models.
 */

import express from 'express';
import { config } from 'dotenv';
import { createRouter } from './src/router.js';

config();

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3456;
const ONEMIN_API_KEY = process.env.ONEMIN_API_KEY;

// ==================== MIDDLEWARE ====================

// API Key middleware - use env var or Authorization header
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const headerKey = authHeader?.replace('Bearer ', '');
  req.apiKey = headerKey || ONEMIN_API_KEY;
  
  if (!req.apiKey && req.path !== '/health' && req.path !== '/') {
    return res.status(401).json({ error: { message: 'Missing API key' } });
  }
  
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    proxy: '1min-proxy',
    version: '2.0.0',
    endpoints: {
      openai: [
        '/v1/chat/completions',
        '/v1/images/generations',
        '/v1/images/variations',
        '/v1/audio/speech',
        '/v1/audio/transcriptions',
        '/v1/audio/translations',
        '/v1/embeddings',
        '/v1/models',
      ],
      native: [
        '/api/features',
        '/api/features/stream',
        '/api/conversations',
        '/api/assets',
        '/api/image/*',
        '/api/audio/*',
        '/api/video/*',
      ],
    },
  });
});

// Root info
app.get('/', (req, res) => {
  res.json({
    name: '1min-proxy',
    description: 'OpenAI-compatible proxy for 1min.ai API',
    version: '2.0.0',
    docs: 'https://github.com/maximemarc/1min-proxy',
    health: '/health',
    openai: '/v1/chat/completions',
  });
});

// Mount router with API key from request
app.use((req, res, next) => {
  const router = createRouter(req.apiKey);
  router(req, res, next);
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('[error]', err);
  res.status(500).json({
    error: {
      message: err.message || 'Internal server error',
      type: 'server_error',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Endpoint ${req.method} ${req.path} not found`,
      type: 'invalid_request_error',
    },
  });
});

// ==================== START ====================

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║         1min-proxy v2.0.0             ║');
  console.log('  ║   OpenAI-compatible 1min.ai proxy     ║');
  console.log('  ╚═══════════════════════════════════════╝');
  console.log('');
  console.log(`  🚀 Server:     http://localhost:${PORT}`);
  console.log(`  📡 OpenAI:     http://localhost:${PORT}/v1/chat/completions`);
  console.log(`  🎨 Images:     http://localhost:${PORT}/v1/images/generations`);
  console.log(`  🔊 Audio:      http://localhost:${PORT}/v1/audio/speech`);
  console.log(`  📋 Models:     http://localhost:${PORT}/v1/models`);
  console.log('');
  
  if (!ONEMIN_API_KEY) {
    console.log('  ⚠️  ONEMIN_API_KEY not set - requires Authorization header');
  } else {
    console.log('  ✅ API Key configured');
  }
  console.log('');
});

export default app;
