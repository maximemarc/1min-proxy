import type { Request, Response } from 'express';
import type { OneMinAPI } from '../client.js';
import { NotImplementedError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class EmbeddingsHandler {
  // @ts-expect-error - API client reserved for future use
  constructor(private readonly _api: OneMinAPI) {}

  /**
   * Handle embeddings creation (POST /v1/embeddings)
   */
  async create(req: Request, res: Response): Promise<void> {
    const { model = 'text-embedding-ada-002', input } = req.body as {
      model?: string;
      input?: unknown;
    };

    const inputLength = Array.isArray(input) ? input.length : 1;
    logger.info({ model, inputLength }, '[embeddings] Processing request');

    // 1min.ai doesn't seem to have embeddings API
    const error = new NotImplementedError('Embeddings');
    res.status(error.statusCode).json(error.toJSON());
  }
}

// Default export for compatibility

export { EmbeddingsHandler as default };
