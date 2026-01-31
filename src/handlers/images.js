/**
 * OpenAI-compatible Images Handler
 */

import { mapModel } from '../models.js';

export class ImagesHandler {
  constructor(api) {
    this.api = api;
  }

  /**
   * Handle image generation (POST /v1/images/generations)
   */
  async generate(req, res) {
    try {
      const { 
        model = 'dall-e-3', 
        prompt, 
        n = 1, 
        size = '1024x1024',
        quality = 'standard',
        style = 'vivid',
        response_format = 'url',
      } = req.body;
      
      const mappedModel = mapModel(model, 'image');
      const [width, height] = size.split('x').map(Number);
      const aspectRatio = this.calculateAspectRatio(width, height);
      
      console.log(`[images:generate] model=${model} -> ${mappedModel}, size=${size}`);
      
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
      console.error('[images:generate] Error:', err);
      res.status(500).json({ error: { message: err.message } });
    }
  }

  /**
   * Handle image edit (POST /v1/images/edits)
   */
  async edit(req, res) {
    try {
      const { image, mask, prompt, model = 'dall-e-2', n = 1, size = '1024x1024' } = req.body;
      
      // For edits, we use object replacer or similar
      console.log(`[images:edit] Not fully implemented yet`);
      
      res.status(501).json({ error: { message: 'Image edits not yet implemented' } });
      
    } catch (err) {
      console.error('[images:edit] Error:', err);
      res.status(500).json({ error: { message: err.message } });
    }
  }

  /**
   * Handle image variations (POST /v1/images/variations)
   */
  async variations(req, res) {
    try {
      const { image, model = 'dall-e-2', n = 1, size = '1024x1024', response_format = 'url' } = req.body;
      
      const mappedModel = mapModel(model, 'image');
      
      console.log(`[images:variations] model=${model} -> ${mappedModel}`);
      
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
      console.error('[images:variations] Error:', err);
      res.status(500).json({ error: { message: err.message } });
    }
  }

  /**
   * Calculate aspect ratio string from dimensions
   */
  calculateAspectRatio(width, height) {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  }

  /**
   * Extract images from API response
   */
  extractImages(data, format) {
    let urls = [];
    
    if (data.aiRecord?.aiRecordDetail?.resultObject) {
      const result = data.aiRecord.aiRecordDetail.resultObject;
      urls = Array.isArray(result) ? result : [result];
    } else if (data.result) {
      urls = Array.isArray(data.result) ? data.result : [data.result];
    }
    
    return urls.map(url => {
      const fullUrl = url.startsWith('http') ? url : `https://asset.1min.ai/${url}`;
      
      if (format === 'b64_json') {
        // Would need to fetch and convert to base64
        return { b64_json: null, url: fullUrl };
      }
      
      return { url: fullUrl };
    });
  }
}

export default ImagesHandler;
