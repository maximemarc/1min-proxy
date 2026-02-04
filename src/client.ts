/**
 * 1min.ai API Client
 * Full-featured client for all 1min.ai endpoints
 */

import type { OneMinFeatureRequest, ConversationParams, OneMinAPIResponse } from './types/index.js';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export class OneMinClient {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string = 'https://api.1min.ai'
  ) {}

  /**
   * Make a request to 1min.ai API
   */
  async request(endpoint: string, options: RequestOptions = {}): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'API-KEY': this.apiKey,
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body:
        options.body instanceof FormData
          ? options.body
          : options.body
            ? JSON.stringify(options.body)
            : undefined,
    });

    return response;
  }

  /**
   * Make a JSON request
   */
  async json<T = OneMinAPIResponse>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.request(endpoint, options);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }
    return response.json() as Promise<T>;
  }
}

/**
 * Asset API - Upload and manage files
 */
export class AssetAPI {
  constructor(private readonly client: OneMinClient) {}

  /**
   * Upload a file
   */
  async upload(file: Blob | Buffer, filename: string): Promise<OneMinAPIResponse> {
    const formData = new FormData();
    formData.append('asset', new Blob([file]), filename);

    return this.client.json('/api/assets', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Get asset by ID
   */
  async get(assetId: string): Promise<OneMinAPIResponse> {
    return this.client.json(`/api/assets/${assetId}`);
  }
}

/**
 * Conversation API - Manage chat sessions
 */
export class ConversationAPI {
  constructor(private readonly client: OneMinClient) {}

  /**
   * Create a new conversation
   */
  async create(params: ConversationParams): Promise<OneMinAPIResponse> {
    return this.client.json('/api/conversations', {
      method: 'POST',
      body: params,
    });
  }

  /**
   * Get conversation by ID
   */
  async get(conversationId: string): Promise<OneMinAPIResponse> {
    return this.client.json(`/api/conversations/${conversationId}`);
  }

  /**
   * List all conversations
   */
  async list(): Promise<OneMinAPIResponse> {
    return this.client.json('/api/conversations');
  }

  /**
   * Delete a conversation
   */
  async delete(conversationId: string): Promise<OneMinAPIResponse> {
    return this.client.json(`/api/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  }
}

interface ChatOptions {
  conversationId?: string;
  isMixed?: boolean;
  webSearch?: boolean;
  numOfSite?: number;
  maxWord?: number;
}

interface ImageGenerationOptions {
  numOutputs?: number;
  aspectRatio?: string;
  outputFormat?: string;
  extra?: Record<string, unknown>;
}

interface ImageVariationOptions {
  mode?: string;
  n?: number;
  aspectWidth?: number;
  aspectHeight?: number;
  maintainModeration?: boolean;
  extra?: Record<string, unknown>;
}

interface ImageUpscaleOptions {
  scale?: number;
  extra?: Record<string, unknown>;
}

interface BackgroundOptions {
  extra?: Record<string, unknown>;
}

// Note: BackgroundReplaceOptions and ObjectReplaceOptions can be added here when needed

interface TTSOptions {
  voice?: string;
  extra?: Record<string, unknown>;
}

interface STTOptions {
  language?: string;
  extra?: Record<string, unknown>;
}

interface VideoOptions {
  duration?: number;
  aspectRatio?: string;
  extra?: Record<string, unknown>;
}

interface ImageToVideoOptions {
  motion?: string;
  duration?: number;
  extra?: Record<string, unknown>;
}

/**
 * Feature API - All AI features
 */
export class FeatureAPI {
  constructor(private readonly client: OneMinClient) {}

  /**
   * Call an AI feature (non-streaming)
   */
  async call(params: OneMinFeatureRequest): Promise<OneMinAPIResponse> {
    return this.client.json('/api/features', {
      method: 'POST',
      body: params,
    });
  }

  /**
   * Call an AI feature with streaming
   */
  async stream(params: OneMinFeatureRequest): Promise<ReadableStream<Uint8Array>> {
    const response = await this.client.request('/api/features?isStreaming=true', {
      method: 'POST',
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }

    if (!response.body) {
      throw new Error('No response body for stream');
    }

    return response.body;
  }

  // ==================== CHAT FEATURES ====================

  /**
   * Chat with AI
   */
  async chat(model: string, prompt: string, options: ChatOptions = {}): Promise<OneMinAPIResponse> {
    return this.call({
      type: 'CHAT_WITH_AI',
      model,
      conversationId: options.conversationId,
      promptObject: {
        prompt,
        isMixed: options.isMixed ?? false,
        webSearch: options.webSearch ?? false,
        numOfSite: options.numOfSite ?? 1,
        maxWord: options.maxWord ?? 500,
      },
    });
  }

  /**
   * Chat with AI (streaming)
   */
  async chatStream(
    model: string,
    prompt: string,
    options: ChatOptions = {}
  ): Promise<ReadableStream<Uint8Array>> {
    return this.stream({
      type: 'CHAT_WITH_AI',
      model,
      conversationId: options.conversationId,
      promptObject: {
        prompt,
        isMixed: options.isMixed ?? false,
        webSearch: options.webSearch ?? false,
        numOfSite: options.numOfSite ?? 1,
        maxWord: options.maxWord ?? 500,
      },
    });
  }

  /**
   * Chat with image analysis
   */
  async chatWithImage(
    model: string,
    prompt: string,
    imageList: string[],
    options: Omit<ChatOptions, 'webSearch' | 'numOfSite' | 'maxWord'> = {}
  ): Promise<OneMinAPIResponse> {
    return this.call({
      type: 'CHAT_WITH_IMAGE',
      model,
      conversationId: options.conversationId,
      promptObject: {
        prompt,
        imageList,
        isMixed: options.isMixed ?? false,
      },
    });
  }

  /**
   * Chat with PDF
   */
  async chatWithPDF(
    model: string,
    prompt: string,
    conversationId: string,
    options: Omit<ChatOptions, 'webSearch' | 'numOfSite' | 'maxWord'> = {}
  ): Promise<OneMinAPIResponse> {
    return this.call({
      type: 'CHAT_WITH_PDF',
      model,
      conversationId,
      promptObject: {
        prompt,
        isMixed: options.isMixed ?? false,
      },
    });
  }

  /**
   * Chat with YouTube video
   */
  async chatWithYouTube(
    model: string,
    prompt: string,
    conversationId: string,
    options: Omit<ChatOptions, 'webSearch' | 'numOfSite' | 'maxWord'> = {}
  ): Promise<OneMinAPIResponse> {
    return this.call({
      type: 'CHAT_WITH_YOUTUBE_VIDEO',
      model,
      conversationId,
      promptObject: {
        prompt,
        isMixed: options.isMixed ?? false,
      },
    });
  }

  // ==================== IMAGE FEATURES ====================

  /**
   * Generate image from text
   */
  async generateImage(
    model: string,
    prompt: string,
    options: ImageGenerationOptions = {}
  ): Promise<OneMinAPIResponse> {
    return this.call({
      type: 'IMAGE_GENERATOR',
      model,
      promptObject: {
        prompt,
        num_outputs: options.numOutputs ?? 1,
        aspect_ratio: options.aspectRatio ?? '1:1',
        output_format: options.outputFormat ?? 'webp',
        ...options.extra,
      },
    });
  }

  /**
   * Create image variations
   */
  async imageVariation(
    model: string,
    imageUrl: string,
    options: ImageVariationOptions = {}
  ): Promise<OneMinAPIResponse> {
    return this.call({
      type: 'IMAGE_VARIATOR',
      model,
      promptObject: {
        imageUrl,
        mode: options.mode ?? 'fast',
        n: options.n ?? 4,
        aspect_width: options.aspectWidth ?? 1,
        aspect_height: options.aspectHeight ?? 1,
        maintainModeration: options.maintainModeration ?? true,
        ...options.extra,
      },
    });
  }

  /**
   * Upscale image
   */
  async upscaleImage(
    model: string,
    imageUrl: string,
    options: ImageUpscaleOptions = {}
  ): Promise<OneMinAPIResponse> {
    return this.call({
      type: 'IMAGE_UPSCALER',
      model,
      promptObject: {
        imageUrl,
        scale: options.scale ?? 2,
        ...options.extra,
      },
    });
  }

  /**
   * Remove background from image
   */
  async removeBackground(
    model: string,
    imageUrl: string,
    options: BackgroundOptions = {}
  ): Promise<OneMinAPIResponse> {
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
  async replaceBackground(
    model: string,
    imageUrl: string,
    newBackground: string,
    options: BackgroundOptions = {}
  ): Promise<OneMinAPIResponse> {
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
  async removeText(
    model: string,
    imageUrl: string,
    options: BackgroundOptions = {}
  ): Promise<OneMinAPIResponse> {
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
  async imageToPrompt(
    model: string,
    imageUrl: string,
    options: BackgroundOptions = {}
  ): Promise<OneMinAPIResponse> {
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
  async objectReplace(
    model: string,
    imageUrl: string,
    searchPrompt: string,
    replacePrompt: string,
    options: BackgroundOptions = {}
  ): Promise<OneMinAPIResponse> {
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
  async textToSpeech(
    model: string,
    text: string,
    options: TTSOptions = {}
  ): Promise<OneMinAPIResponse> {
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
  async speechToText(
    model: string,
    audioUrl: string,
    options: STTOptions = {}
  ): Promise<OneMinAPIResponse> {
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
  async generateVideo(
    model: string,
    prompt: string,
    options: VideoOptions = {}
  ): Promise<OneMinAPIResponse> {
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
  async imageToVideo(
    model: string,
    imageUrl: string,
    options: ImageToVideoOptions = {}
  ): Promise<OneMinAPIResponse> {
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
  public readonly client: OneMinClient;
  public readonly assets: AssetAPI;
  public readonly conversations: ConversationAPI;
  public readonly features: FeatureAPI;

  constructor(apiKey: string, baseUrl = 'https://api.1min.ai') {
    this.client = new OneMinClient(apiKey, baseUrl);
    this.assets = new AssetAPI(this.client);
    this.conversations = new ConversationAPI(this.client);
    this.features = new FeatureAPI(this.client);
  }

  // Convenience methods

  /**
   * Quick chat
   */
  async chat(model: string, prompt: string, options: ChatOptions = {}): Promise<OneMinAPIResponse> {
    return this.features.chat(model, prompt, options);
  }

  /**
   * Quick chat with streaming
   */
  async chatStream(
    model: string,
    prompt: string,
    options: ChatOptions = {}
  ): Promise<ReadableStream<Uint8Array>> {
    return this.features.chatStream(model, prompt, options);
  }

  /**
   * Quick image generation
   */
  async generateImage(
    model: string,
    prompt: string,
    options: ImageGenerationOptions = {}
  ): Promise<OneMinAPIResponse> {
    return this.features.generateImage(model, prompt, options);
  }
}

// Default export for compatibility

export { OneMinAPI as default };
