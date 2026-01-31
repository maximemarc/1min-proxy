/**
 * 1min.ai API Client
 * Full-featured client for all 1min.ai endpoints
 */

export class OneMinClient {
  constructor(apiKey, baseUrl = 'https://api.1min.ai') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Make a request to 1min.ai API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'API-KEY': this.apiKey,
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body instanceof FormData 
        ? options.body 
        : options.body ? JSON.stringify(options.body) : undefined,
    });

    return response;
  }

  /**
   * Make a JSON request
   */
  async json(endpoint, options = {}) {
    const response = await this.request(endpoint, options);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }
    return response.json();
  }
}

/**
 * Asset API - Upload and manage files
 */
export class AssetAPI {
  constructor(client) {
    this.client = client;
  }

  /**
   * Upload a file
   * @param {File|Blob|Buffer} file - The file to upload
   * @param {string} filename - Original filename
   */
  async upload(file, filename) {
    const formData = new FormData();
    formData.append('asset', file, filename);
    
    return this.client.json('/api/assets', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Get asset by ID
   */
  async get(assetId) {
    return this.client.json(`/api/assets/${assetId}`);
  }
}

/**
 * Conversation API - Manage chat sessions
 */
export class ConversationAPI {
  constructor(client) {
    this.client = client;
  }

  /**
   * Create a new conversation
   * @param {Object} params
   * @param {string} params.type - CHAT_WITH_AI, CHAT_WITH_IMAGE, CHAT_WITH_PDF, CHAT_WITH_YOUTUBE_VIDEO
   * @param {string} params.title - Conversation title
   * @param {string} params.model - AI model to use
   * @param {string[]} [params.fileList] - File IDs for CHAT_WITH_PDF
   * @param {string} [params.youtubeUrl] - YouTube URL for CHAT_WITH_YOUTUBE_VIDEO
   */
  async create(params) {
    return this.client.json('/api/conversations', {
      method: 'POST',
      body: params,
    });
  }

  /**
   * Get conversation by ID
   */
  async get(conversationId) {
    return this.client.json(`/api/conversations/${conversationId}`);
  }

  /**
   * List all conversations
   */
  async list() {
    return this.client.json('/api/conversations');
  }

  /**
   * Delete a conversation
   */
  async delete(conversationId) {
    return this.client.json(`/api/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Feature API - All AI features
 */
export class FeatureAPI {
  constructor(client) {
    this.client = client;
  }

  /**
   * Call an AI feature (non-streaming)
   * @param {Object} params
   * @param {string} params.type - Feature type
   * @param {string} params.model - Model to use
   * @param {Object} params.promptObject - Feature-specific parameters
   * @param {string} [params.conversationId] - Optional conversation ID
   */
  async call(params) {
    return this.client.json('/api/features', {
      method: 'POST',
      body: params,
    });
  }

  /**
   * Call an AI feature with streaming
   */
  async stream(params) {
    const response = await this.client.request('/api/features?isStreaming=true', {
      method: 'POST',
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }

    return response.body;
  }

  // ==================== CHAT FEATURES ====================

  /**
   * Chat with AI
   */
  async chat(model, prompt, options = {}) {
    return this.call({
      type: 'CHAT_WITH_AI',
      model,
      conversationId: options.conversationId,
      promptObject: {
        prompt,
        isMixed: options.isMixed || false,
        webSearch: options.webSearch || false,
        numOfSite: options.numOfSite || 1,
        maxWord: options.maxWord || 500,
      },
    });
  }

  /**
   * Chat with AI (streaming)
   */
  async chatStream(model, prompt, options = {}) {
    return this.stream({
      type: 'CHAT_WITH_AI',
      model,
      conversationId: options.conversationId,
      promptObject: {
        prompt,
        isMixed: options.isMixed || false,
        webSearch: options.webSearch || false,
        numOfSite: options.numOfSite || 1,
        maxWord: options.maxWord || 500,
      },
    });
  }

  /**
   * Chat with image analysis
   */
  async chatWithImage(model, prompt, imageList, options = {}) {
    return this.call({
      type: 'CHAT_WITH_IMAGE',
      model,
      conversationId: options.conversationId,
      promptObject: {
        prompt,
        imageList,
        isMixed: options.isMixed || false,
      },
    });
  }

  /**
   * Chat with PDF
   */
  async chatWithPDF(model, prompt, conversationId, options = {}) {
    return this.call({
      type: 'CHAT_WITH_PDF',
      model,
      conversationId,
      promptObject: {
        prompt,
        isMixed: options.isMixed || false,
      },
    });
  }

  /**
   * Chat with YouTube video
   */
  async chatWithYouTube(model, prompt, conversationId, options = {}) {
    return this.call({
      type: 'CHAT_WITH_YOUTUBE_VIDEO',
      model,
      conversationId,
      promptObject: {
        prompt,
        isMixed: options.isMixed || false,
      },
    });
  }

  // ==================== IMAGE FEATURES ====================

  /**
   * Generate image from text
   */
  async generateImage(model, prompt, options = {}) {
    return this.call({
      type: 'IMAGE_GENERATOR',
      model,
      promptObject: {
        prompt,
        num_outputs: options.numOutputs || 1,
        aspect_ratio: options.aspectRatio || '1:1',
        output_format: options.outputFormat || 'webp',
        ...options.extra,
      },
    });
  }

  /**
   * Create image variations
   */
  async imageVariation(model, imageUrl, options = {}) {
    return this.call({
      type: 'IMAGE_VARIATOR',
      model,
      promptObject: {
        imageUrl,
        mode: options.mode || 'fast',
        n: options.n || 4,
        aspect_width: options.aspectWidth || 1,
        aspect_height: options.aspectHeight || 1,
        maintainModeration: options.maintainModeration ?? true,
        ...options.extra,
      },
    });
  }

  /**
   * Upscale image
   */
  async upscaleImage(model, imageUrl, options = {}) {
    return this.call({
      type: 'IMAGE_UPSCALER',
      model,
      promptObject: {
        imageUrl,
        scale: options.scale || 2,
        ...options.extra,
      },
    });
  }

  /**
   * Remove background from image
   */
  async removeBackground(model, imageUrl, options = {}) {
    return this.call({
      type: 'BACKGROUND_REMOVER',
      model,
      promptObject: {
        imageUrl,
        ...options.extra,
      },
    });
  }

  /**
   * Replace background in image
   */
  async replaceBackground(model, imageUrl, newBackground, options = {}) {
    return this.call({
      type: 'BACKGROUND_REPLACER',
      model,
      promptObject: {
        imageUrl,
        backgroundPrompt: newBackground,
        ...options.extra,
      },
    });
  }

  /**
   * Remove text from image
   */
  async removeText(model, imageUrl, options = {}) {
    return this.call({
      type: 'TEXT_REMOVER',
      model,
      promptObject: {
        imageUrl,
        ...options.extra,
      },
    });
  }

  /**
   * Image to prompt
   */
  async imageToPrompt(model, imageUrl, options = {}) {
    return this.call({
      type: 'IMAGE_TO_PROMPT',
      model,
      promptObject: {
        imageUrl,
        ...options.extra,
      },
    });
  }

  /**
   * Search and replace objects in image
   */
  async objectReplace(model, imageUrl, searchPrompt, replacePrompt, options = {}) {
    return this.call({
      type: 'IMAGE_OBJECT_REPLACER',
      model,
      promptObject: {
        imageUrl,
        searchPrompt,
        replacePrompt,
        ...options.extra,
      },
    });
  }

  // ==================== AUDIO FEATURES ====================

  /**
   * Text to speech
   */
  async textToSpeech(model, text, options = {}) {
    return this.call({
      type: 'TEXT_TO_SPEECH',
      model,
      promptObject: {
        text,
        voice: options.voice,
        ...options.extra,
      },
    });
  }

  /**
   * Speech to text (transcription)
   */
  async speechToText(model, audioUrl, options = {}) {
    return this.call({
      type: 'SPEECH_TO_TEXT',
      model,
      promptObject: {
        audioUrl,
        language: options.language,
        ...options.extra,
      },
    });
  }

  // ==================== VIDEO FEATURES ====================

  /**
   * Generate video from text
   */
  async generateVideo(model, prompt, options = {}) {
    return this.call({
      type: 'VIDEO_GENERATOR',
      model,
      promptObject: {
        prompt,
        duration: options.duration,
        aspectRatio: options.aspectRatio,
        ...options.extra,
      },
    });
  }

  /**
   * Generate video from image
   */
  async imageToVideo(model, imageUrl, options = {}) {
    return this.call({
      type: 'IMAGE_TO_VIDEO',
      model,
      promptObject: {
        imageUrl,
        motion: options.motion,
        duration: options.duration,
        ...options.extra,
      },
    });
  }
}

/**
 * Main 1min.ai API class
 */
export class OneMinAPI {
  constructor(apiKey, baseUrl = 'https://api.1min.ai') {
    this.client = new OneMinClient(apiKey, baseUrl);
    this.assets = new AssetAPI(this.client);
    this.conversations = new ConversationAPI(this.client);
    this.features = new FeatureAPI(this.client);
  }

  // Convenience methods

  /**
   * Quick chat
   */
  async chat(model, prompt, options = {}) {
    return this.features.chat(model, prompt, options);
  }

  /**
   * Quick chat with streaming
   */
  async chatStream(model, prompt, options = {}) {
    return this.features.chatStream(model, prompt, options);
  }

  /**
   * Quick image generation
   */
  async generateImage(model, prompt, options = {}) {
    return this.features.generateImage(model, prompt, options);
  }
}

export default OneMinAPI;
