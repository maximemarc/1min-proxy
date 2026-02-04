import type { Request, Response } from 'express';
import type { OneMinAPI } from '../client.js';
import { mapModel } from '../models.js';
import { imageGenerationRequestSchema, imageVariationRequestSchema } from '../schemas/index.js';
import { APIError, NotImplementedError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class ImagesHandler {
  constructor(private readonly api: OneMinAPI) {}

  /**
   * Handle image generation (POST /v1/images/generations)
   */
  async generate(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = imageGenerationRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.format());
      }

      const { model, prompt, n, size, quality, style, response_format } = parseResult.data;

      const mappedModel = mapModel(model, 'image');
      const [width, height] = size.split('x').map(Number);
      const aspectRatio = this.calculateAspectRatio(width, height);

      logger.info({ model, mappedModel, size }, '[images:generate] Processing request');

      const data = await this.api.features.generateImage(mappedModel, prompt, {
        numOutputs: n,
        aspectRatio,
        outputFormat: 'webp',
        extra: {
          quality,
          style,
        },
      });

      const images = this.extractImages(data, response_format);

      res.json({
        created: Math.floor(Date.now() / 1000),
        data: images,
      });
    } catch (err) {
      logger.error({ err }, '[images:generate] Error');

      if (err instanceof APIError) {
        res.status(err.statusCode).json(err.toJSON());
      } else {
        const apiError = new APIError(err instanceof Error ? err.message : 'Unknown error', 500);
        res.status(500).json(apiError.toJSON());
      }
    }
  }

  /**
   * Handle image edit (POST /v1/images/edits)
   */
  async edit(_req: Request, res: Response): Promise<void> {
    const error = new NotImplementedError('Image edits');
    res.status(error.statusCode).json(error.toJSON());
  }

  /**
   * Handle image variations (POST /v1/images/variations)
   */
  async variations(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = imageVariationRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.format());
      }

      const { image, model, n, response_format } = parseResult.data;
      const mappedModel = mapModel(model, 'image');

      logger.info({ model, mappedModel }, '[images:variations] Processing request');

      const data = await this.api.features.imageVariation(mappedModel, image, {
        n,
        mode: 'fast',
      });

      const images = this.extractImages(data, response_format);

      res.json({
        created: Math.floor(Date.now() / 1000),
        data: images,
      });
    } catch (err) {
      logger.error({ err }, '[images:variations] Error');

      if (err instanceof APIError) {
        res.status(err.statusCode).json(err.toJSON());
      } else {
        const apiError = new APIError(err instanceof Error ? err.message : 'Unknown error', 500);
        res.status(500).json(apiError.toJSON());
      }
    }
  }

  /**
   * Calculate aspect ratio string from dimensions
   */
  private calculateAspectRatio(width: number, height: number): string {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  }

  /**
   * Extract images from API response
   */
  private extractImages(data: unknown, format: string): Array<{ url?: string; b64_json?: string }> {
    const record = data as Record<string, unknown>;
    let urls: string[] = [];

    const aiRecord = record.aiRecord as Record<string, unknown> | undefined;
    if (aiRecord?.aiRecordDetail) {
      const detail = aiRecord.aiRecordDetail as Record<string, unknown>;
      const result = detail.resultObject;
      urls = Array.isArray(result) ? (result as string[]) : [String(result)];
    } else if (record.result) {
      const result = record.result;
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      urls = Array.isArray(result) ? (result as string[]) : [String(result)];
    }

    return urls.map((url) => {
      const fullUrl = url.startsWith('http') ? url : `https://asset.1min.ai/${url}`;

      if (format === 'b64_json') {
        // Would need to fetch and convert to base64
        return { b64_json: undefined, url: fullUrl };
      }

      return { url: fullUrl };
    });
  }
}

// Default export for compatibility

export { ImagesHandler as default };
