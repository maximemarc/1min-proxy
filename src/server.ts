/**
 * 1min-proxy - OpenAI-compatible proxy for 1min.ai
 *
 * Provides full OpenAI API compatibility while routing requests
 * through the 1min.ai API for access to multiple AI models.
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createRouter } from './router.js';
import { appConfig } from './config/index.js';
import { logger, logRequest } from './utils/logger.js';
import { APIError, AuthenticationError } from './utils/errors.js';

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for API
    crossOriginEmbedderPolicy: false,
  })
);

// Body parsing
app.use(express.json({ limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: appConfig.rateLimitWindowMs,
  max: appConfig.rateLimitMax,
  message: {
    error: {
      message: 'Too many requests, please try again later',
      type: 'rate_limit_exceeded',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ==================== MIDDLEWARE ====================

// API Key middleware - use env var or Authorization header
app.use((req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const headerKey = authHeader?.replace('Bearer ', '');
  (req as Request & { apiKey: string }).apiKey = headerKey ?? appConfig.apiKey ?? '';
  next();
});

// API key validation middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = (req as Request & { apiKey: string }).apiKey;

  if (!apiKey && req.path !== '/health' && req.path !== '/') {
    const error = new AuthenticationError();
    res.status(error.statusCode).json(error.toJSON());
    return;
  }

  next();
});

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logRequest(req.method, req.path, res.statusCode, duration);
  });
  next();
});

// CORS middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  const origins = appConfig.corsOrigins;
  if (origins.includes('*')) {
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    const origin = _req.headers.origin;
    if (origin && origins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (_req: Request, res: Response) => {
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
app.get('/', (_req: Request, res: Response) => {
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
app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = (req as Request & { apiKey: string }).apiKey;
  const router = createRouter(apiKey);
  router(req, res, next);
});

// ==================== ERROR HANDLING ====================

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, 'Unhandled error');

  if (err instanceof APIError) {
    res.status(err.statusCode).json(err.toJSON());
  } else {
    res.status(500).json({
      error: {
        message: err.message || 'Internal server error',
        type: 'server_error',
      },
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: `Endpoint ${req.method} ${req.path} not found`,
      type: 'invalid_request_error',
    },
  });
});

// ==================== START ====================

const PORT = appConfig.port;

app.listen(PORT, () => {
  logger.info('Server started');

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

  if (!appConfig.apiKey) {
    console.log('  ⚠️  ONEMIN_API_KEY not set - requires Authorization header');
  } else {
    console.log('  ✅ API Key configured');
  }

  console.log('');
});

export default app;
