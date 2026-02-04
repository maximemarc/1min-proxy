import type { Request, Response } from 'express';
import type { OneMinAPI } from '../client.js';
import { mapModel } from '../models.js';
import {
  speechRequestSchema,
  transcriptionRequestSchema,
  translationRequestSchema,
} from '../schemas/index.js';
import { APIError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const CONTENT_TYPES: Record<string, string> = {
  mp3: 'audio/mpeg',
  opus: 'audio/opus',
  aac: 'audio/aac',
  flac: 'audio/flac',
  wav: 'audio/wav',
  pcm: 'audio/pcm',
};

export class AudioHandler {
  constructor(private readonly api: OneMinAPI) {}

  /**
   * Handle speech synthesis (POST /v1/audio/speech)
   */
  async speech(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = speechRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.format());
      }

      const { model, input, voice, response_format } = parseResult.data;
      const mappedModel = mapModel(model, 'audio');

      logger.info({ model, mappedModel, voice }, '[audio:speech] Processing request');

      const data = await this.api.features.textToSpeech(mappedModel, input, {
        voice,
        extra: {
          format: response_format,
        },
      });

      const audioUrl = this.extractAudioUrl(data);

      if (!audioUrl) {
        throw new APIError('No audio generated', 500);
      }

      // Fetch and stream the audio file
      const audioResponse = await fetch(audioUrl);
      const contentType = CONTENT_TYPES[response_format] ?? 'audio/mpeg';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Transfer-Encoding', 'chunked');

      if (!audioResponse.body) {
        throw new APIError('No audio response body', 500);
      }

      const reader = audioResponse.body.getReader();
      while (true) {
        const result = await reader.read();
        if (result.done) {
          break;
        }
        res.write(result.value);
      }
      res.end();
    } catch (err) {
      logger.error({ err }, '[audio:speech] Error');

      if (err instanceof APIError) {
        res.status(err.statusCode).json(err.toJSON());
      } else {
        const apiError = new APIError(err instanceof Error ? err.message : 'Unknown error', 500);
        res.status(500).json(apiError.toJSON());
      }
    }
  }

  /**
   * Handle transcription (POST /v1/audio/transcriptions)
   */
  async transcription(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = transcriptionRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.format());
      }

      const { file, model, language, response_format } = parseResult.data;
      const mappedModel = mapModel(model, 'audio');

      logger.info({ model, mappedModel }, '[audio:transcription] Processing request');

      // Upload file first if needed
      let audioUrl: string;
      if (typeof file === 'string') {
        audioUrl = file;
      } else {
        const uploaded = await this.api.assets.upload(file, 'audio.mp3');
        const record = uploaded as Record<string, unknown>;
        const fileContent = record.fileContent as Record<string, string> | undefined;
        const asset = record.asset as Record<string, string> | undefined;
        audioUrl = fileContent?.path ?? asset?.key ?? '';
      }

      const data = await this.api.features.speechToText(mappedModel, audioUrl, {
        language,
      });

      const text = this.extractText(data);

      if (response_format === 'text') {
        res.type('text/plain').send(text);
      } else if (response_format === 'srt' || response_format === 'vtt') {
        res.type('text/plain').send(text); // Would need proper formatting
      } else {
        res.json({ text });
      }
    } catch (err) {
      logger.error({ err }, '[audio:transcription] Error');

      if (err instanceof APIError) {
        res.status(err.statusCode).json(err.toJSON());
      } else {
        const apiError = new APIError(err instanceof Error ? err.message : 'Unknown error', 500);
        res.status(500).json(apiError.toJSON());
      }
    }
  }

  /**
   * Handle translation (POST /v1/audio/translations)
   */
  async translation(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = translationRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new ValidationError('Invalid request body', parseResult.error.format());
      }

      const { file, model, response_format } = parseResult.data;
      const mappedModel = mapModel(model, 'audio');

      logger.info({ model, mappedModel }, '[audio:translation] Processing request');

      // Upload file first if needed
      let audioUrl: string;
      if (typeof file === 'string') {
        audioUrl = file;
      } else {
        const uploaded = await this.api.assets.upload(file, 'audio.mp3');
        const record = uploaded as Record<string, unknown>;
        const fileContent = record.fileContent as Record<string, string> | undefined;
        const asset = record.asset as Record<string, string> | undefined;
        audioUrl = fileContent?.path ?? asset?.key ?? '';
      }

      const data = await this.api.features.speechToText(mappedModel, audioUrl, {
        language: 'en',
      });

      const text = this.extractText(data);

      if (response_format === 'text') {
        res.type('text/plain').send(text);
      } else {
        res.json({ text });
      }
    } catch (err) {
      logger.error({ err }, '[audio:translation] Error');

      if (err instanceof APIError) {
        res.status(err.statusCode).json(err.toJSON());
      } else {
        const apiError = new APIError(err instanceof Error ? err.message : 'Unknown error', 500);
        res.status(500).json(apiError.toJSON());
      }
    }
  }

  /**
   * Extract audio URL from response
   */
  private extractAudioUrl(data: unknown): string | null {
    const record = data as Record<string, unknown>;
    const aiRecord = record.aiRecord as Record<string, unknown> | undefined;

    if (aiRecord?.aiRecordDetail) {
      const detail = aiRecord.aiRecordDetail as Record<string, unknown>;
      const result = detail.resultObject;
      const url = Array.isArray(result) ? (result as string[])[0] : String(result);
      return url.startsWith('http') ? url : `https://asset.1min.ai/${url}`;
    }

    return null;
  }

  /**
   * Extract text from transcription response
   */
  private extractText(data: unknown): string {
    if (typeof data === 'string') {
      return data;
    }

    const record = data as Record<string, unknown>;

    if (record.result) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return String(record.result);
    }
    if (record.text) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return String(record.text);
    }

    const aiRecord = record.aiRecord as Record<string, unknown> | undefined;
    if (aiRecord?.aiRecordDetail) {
      const detail = aiRecord.aiRecordDetail as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return String(detail.resultObject ?? '');
    }

    return '';
  }
}

// Default export for compatibility

export { AudioHandler as default };
