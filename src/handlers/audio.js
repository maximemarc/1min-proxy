/**
 * OpenAI-compatible Audio Handler
 */

import { mapModel } from '../models.js';

export class AudioHandler {
  constructor(api) {
    this.api = api;
  }

  /**
   * Handle speech synthesis (POST /v1/audio/speech)
   */
  async speech(req, res) {
    try {
      const { 
        model = 'tts-1', 
        input, 
        voice = 'alloy',
        response_format = 'mp3',
        speed = 1.0,
      } = req.body;
      
      const mappedModel = mapModel(model, 'audio');
      
      console.log(`[audio:speech] model=${model} -> ${mappedModel}, voice=${voice}`);
      
      const data = await this.api.features.textToSpeech(mappedModel, input, {
        voice,
        extra: {
          speed,
          format: response_format,
        },
      });
      
      const audioUrl = this.extractAudioUrl(data);
      
      if (audioUrl) {
        // Fetch and stream the audio file
        const audioResponse = await fetch(audioUrl);
        const contentType = this.getContentType(response_format);
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Transfer-Encoding', 'chunked');
        
        const reader = audioResponse.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      } else {
        res.status(500).json({ error: { message: 'No audio generated' } });
      }
      
    } catch (err) {
      console.error('[audio:speech] Error:', err);
      res.status(500).json({ error: { message: err.message } });
    }
  }

  /**
   * Handle transcription (POST /v1/audio/transcriptions)
   */
  async transcription(req, res) {
    try {
      const { file, model = 'whisper-1', language, prompt, response_format = 'json' } = req.body;
      
      const mappedModel = mapModel(model, 'audio');
      
      console.log(`[audio:transcription] model=${model} -> ${mappedModel}`);
      
      // Upload file first if needed
      let audioUrl = file;
      if (file instanceof Buffer || file instanceof Blob) {
        const uploaded = await this.api.assets.upload(file, 'audio.mp3');
        audioUrl = uploaded.fileContent?.path || uploaded.asset?.key;
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
      console.error('[audio:transcription] Error:', err);
      res.status(500).json({ error: { message: err.message } });
    }
  }

  /**
   * Handle translation (POST /v1/audio/translations)
   */
  async translation(req, res) {
    try {
      const { file, model = 'whisper-1', prompt, response_format = 'json' } = req.body;
      
      // Translation is transcription + translation to English
      const mappedModel = mapModel(model, 'audio');
      
      console.log(`[audio:translation] model=${model} -> ${mappedModel}`);
      
      let audioUrl = file;
      if (file instanceof Buffer || file instanceof Blob) {
        const uploaded = await this.api.assets.upload(file, 'audio.mp3');
        audioUrl = uploaded.fileContent?.path || uploaded.asset?.key;
      }
      
      const data = await this.api.features.speechToText(mappedModel, audioUrl, {
        language: 'en', // Force English output
      });
      
      const text = this.extractText(data);
      
      if (response_format === 'text') {
        res.type('text/plain').send(text);
      } else {
        res.json({ text });
      }
      
    } catch (err) {
      console.error('[audio:translation] Error:', err);
      res.status(500).json({ error: { message: err.message } });
    }
  }

  /**
   * Get content type for audio format
   */
  getContentType(format) {
    const types = {
      mp3: 'audio/mpeg',
      opus: 'audio/opus',
      aac: 'audio/aac',
      flac: 'audio/flac',
      wav: 'audio/wav',
      pcm: 'audio/pcm',
    };
    return types[format] || 'audio/mpeg';
  }

  /**
   * Extract audio URL from response
   */
  extractAudioUrl(data) {
    if (data.aiRecord?.aiRecordDetail?.resultObject) {
      const result = data.aiRecord.aiRecordDetail.resultObject;
      const url = Array.isArray(result) ? result[0] : result;
      return url.startsWith('http') ? url : `https://asset.1min.ai/${url}`;
    }
    return null;
  }

  /**
   * Extract text from transcription response
   */
  extractText(data) {
    if (typeof data === 'string') return data;
    if (data.result) return data.result;
    if (data.text) return data.text;
    if (data.aiRecord?.aiRecordDetail?.resultObject) {
      return data.aiRecord.aiRecordDetail.resultObject;
    }
    return '';
  }
}

export default AudioHandler;
