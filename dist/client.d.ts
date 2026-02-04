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
export declare class OneMinClient {
    private readonly apiKey;
    private readonly baseUrl;
    constructor(apiKey: string, baseUrl?: string);
    /**
     * Make a request to 1min.ai API
     */
    request(endpoint: string, options?: RequestOptions): Promise<Response>;
    /**
     * Make a JSON request
     */
    json<T = OneMinAPIResponse>(endpoint: string, options?: RequestOptions): Promise<T>;
}
/**
 * Asset API - Upload and manage files
 */
export declare class AssetAPI {
    private readonly client;
    constructor(client: OneMinClient);
    /**
     * Upload a file
     */
    upload(file: Blob | Buffer, filename: string): Promise<OneMinAPIResponse>;
    /**
     * Get asset by ID
     */
    get(assetId: string): Promise<OneMinAPIResponse>;
}
/**
 * Conversation API - Manage chat sessions
 */
export declare class ConversationAPI {
    private readonly client;
    constructor(client: OneMinClient);
    /**
     * Create a new conversation
     */
    create(params: ConversationParams): Promise<OneMinAPIResponse>;
    /**
     * Get conversation by ID
     */
    get(conversationId: string): Promise<OneMinAPIResponse>;
    /**
     * List all conversations
     */
    list(): Promise<OneMinAPIResponse>;
    /**
     * Delete a conversation
     */
    delete(conversationId: string): Promise<OneMinAPIResponse>;
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
export declare class FeatureAPI {
    private readonly client;
    constructor(client: OneMinClient);
    /**
     * Call an AI feature (non-streaming)
     */
    call(params: OneMinFeatureRequest): Promise<OneMinAPIResponse>;
    /**
     * Call an AI feature with streaming
     */
    stream(params: OneMinFeatureRequest): Promise<ReadableStream<Uint8Array>>;
    /**
     * Chat with AI
     */
    chat(model: string, prompt: string, options?: ChatOptions): Promise<OneMinAPIResponse>;
    /**
     * Chat with AI (streaming)
     */
    chatStream(model: string, prompt: string, options?: ChatOptions): Promise<ReadableStream<Uint8Array>>;
    /**
     * Chat with image analysis
     */
    chatWithImage(model: string, prompt: string, imageList: string[], options?: Omit<ChatOptions, 'webSearch' | 'numOfSite' | 'maxWord'>): Promise<OneMinAPIResponse>;
    /**
     * Chat with PDF
     */
    chatWithPDF(model: string, prompt: string, conversationId: string, options?: Omit<ChatOptions, 'webSearch' | 'numOfSite' | 'maxWord'>): Promise<OneMinAPIResponse>;
    /**
     * Chat with YouTube video
     */
    chatWithYouTube(model: string, prompt: string, conversationId: string, options?: Omit<ChatOptions, 'webSearch' | 'numOfSite' | 'maxWord'>): Promise<OneMinAPIResponse>;
    /**
     * Generate image from text
     */
    generateImage(model: string, prompt: string, options?: ImageGenerationOptions): Promise<OneMinAPIResponse>;
    /**
     * Create image variations
     */
    imageVariation(model: string, imageUrl: string, options?: ImageVariationOptions): Promise<OneMinAPIResponse>;
    /**
     * Upscale image
     */
    upscaleImage(model: string, imageUrl: string, options?: ImageUpscaleOptions): Promise<OneMinAPIResponse>;
    /**
     * Remove background from image
     */
    removeBackground(model: string, imageUrl: string, options?: BackgroundOptions): Promise<OneMinAPIResponse>;
    /**
     * Replace background in image
     */
    replaceBackground(model: string, imageUrl: string, newBackground: string, options?: BackgroundOptions): Promise<OneMinAPIResponse>;
    /**
     * Remove text from image
     */
    removeText(model: string, imageUrl: string, options?: BackgroundOptions): Promise<OneMinAPIResponse>;
    /**
     * Image to prompt
     */
    imageToPrompt(model: string, imageUrl: string, options?: BackgroundOptions): Promise<OneMinAPIResponse>;
    /**
     * Search and replace objects in image
     */
    objectReplace(model: string, imageUrl: string, searchPrompt: string, replacePrompt: string, options?: BackgroundOptions): Promise<OneMinAPIResponse>;
    /**
     * Text to speech
     */
    textToSpeech(model: string, text: string, options?: TTSOptions): Promise<OneMinAPIResponse>;
    /**
     * Speech to text (transcription)
     */
    speechToText(model: string, audioUrl: string, options?: STTOptions): Promise<OneMinAPIResponse>;
    /**
     * Generate video from text
     */
    generateVideo(model: string, prompt: string, options?: VideoOptions): Promise<OneMinAPIResponse>;
    /**
     * Generate video from image
     */
    imageToVideo(model: string, imageUrl: string, options?: ImageToVideoOptions): Promise<OneMinAPIResponse>;
}
/**
 * Main 1min.ai API class
 */
export declare class OneMinAPI {
    readonly client: OneMinClient;
    readonly assets: AssetAPI;
    readonly conversations: ConversationAPI;
    readonly features: FeatureAPI;
    constructor(apiKey: string, baseUrl?: string);
    /**
     * Quick chat
     */
    chat(model: string, prompt: string, options?: ChatOptions): Promise<OneMinAPIResponse>;
    /**
     * Quick chat with streaming
     */
    chatStream(model: string, prompt: string, options?: ChatOptions): Promise<ReadableStream<Uint8Array>>;
    /**
     * Quick image generation
     */
    generateImage(model: string, prompt: string, options?: ImageGenerationOptions): Promise<OneMinAPIResponse>;
}
export { OneMinAPI as default };
//# sourceMappingURL=client.d.ts.map