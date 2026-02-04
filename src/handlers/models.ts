import type { Request, Response } from 'express';
import type { OneMinAPI } from '../client.js';
import { CHAT_MODELS, IMAGE_MODELS, AUDIO_MODELS, VIDEO_MODELS } from '../models.js';
import { modelParamSchema } from '../schemas/index.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class ModelsHandler {
  // @ts-expect-error - API client reserved for future use
  constructor(private readonly _api: OneMinAPI) {}

  /**
   * List all available models (GET /v1/models)
   */
  async list(_req: Request, res: Response): Promise<void> {
    try {
      const models = [];
      const timestamp = Math.floor(Date.now() / 1000);

      // Chat models
      for (const id of Object.keys(CHAT_MODELS)) {
        models.push({
          id,
          object: 'model',
          created: timestamp,
          owned_by: '1min-proxy',
          permission: [],
          root: id,
          parent: null,
        });
      }

      // Image models
      for (const id of Object.keys(IMAGE_MODELS)) {
        models.push({
          id,
          object: 'model',
          created: timestamp,
          owned_by: '1min-proxy',
          permission: [],
          root: id,
          parent: null,
        });
      }

      // Audio models
      for (const id of Object.keys(AUDIO_MODELS)) {
        models.push({
          id,
          object: 'model',
          created: timestamp,
          owned_by: '1min-proxy',
          permission: [],
          root: id,
          parent: null,
        });
      }

      res.json({
        object: 'list',
        data: models,
      });
    } catch (err) {
      logger.error({ err }, '[models:list] Error');
      throw err;
    }
  }

  /**
   * Get a specific model (GET /v1/models/:model)
   */
  async get(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = modelParamSchema.safeParse(req.params);

      if (!parseResult.success) {
        throw new ValidationError('Invalid model parameter', parseResult.error.format());
      }

      const { model } = parseResult.data;
      const allModels = { ...CHAT_MODELS, ...IMAGE_MODELS, ...AUDIO_MODELS, ...VIDEO_MODELS };

      if (allModels[model]) {
        res.json({
          id: model,
          object: 'model',
          created: Math.floor(Date.now() / 1000),
          owned_by: '1min-proxy',
          permission: [],
          root: model,
          parent: null,
        });
      } else {
        throw new NotFoundError(`Model '${model}'`);
      }
    } catch (err) {
      logger.error({ err }, '[models:get] Error');

      if (err instanceof NotFoundError) {
        res.status(err.statusCode).json(err.toJSON());
      } else if (err instanceof ValidationError) {
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
  }
}

// Default export for compatibility

export { ModelsHandler as default };
