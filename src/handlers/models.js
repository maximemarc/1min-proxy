/**
 * OpenAI-compatible Models Handler
 */

import { CHAT_MODELS, IMAGE_MODELS, AUDIO_MODELS, VIDEO_MODELS } from '../models.js';

export class ModelsHandler {
  constructor(api) {
    this.api = api;
  }

  /**
   * List all available models (GET /v1/models)
   */
  async list(req, res) {
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
      console.error('[models:list] Error:', err);
      res.status(500).json({ error: { message: err.message } });
    }
  }

  /**
   * Get a specific model (GET /v1/models/:model)
   */
  async get(req, res) {
    try {
      const { model } = req.params;
      
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
        res.status(404).json({
          error: {
            message: `Model '${model}' not found`,
            type: 'invalid_request_error',
            code: 'model_not_found',
          },
        });
      }
      
    } catch (err) {
      console.error('[models:get] Error:', err);
      res.status(500).json({ error: { message: err.message } });
    }
  }
}

export default ModelsHandler;
