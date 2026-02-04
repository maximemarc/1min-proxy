/**
 * Model definitions and mappings
 */
// Chat models mapping: alias -> 1min.ai model ID
export const CHAT_MODELS = {
    // Claude models
    'claude-3-5-haiku-20241022': 'claude-3-5-haiku-20241022',
    'claude-3-5-sonnet-20241022': 'claude-3-5-sonnet-20241022',
    'claude-3-opus-20240229': 'claude-3-opus-20240229',
    'claude-haiku': 'claude-3-5-haiku-20241022',
    'claude-sonnet': 'claude-3-5-sonnet-20241022',
    'claude-opus': 'claude-3-opus-20240229',
    // GPT models
    'gpt-4o': 'gpt-4o',
    'gpt-4o-mini': 'gpt-4o-mini',
    'gpt-4-turbo': 'gpt-4-turbo',
    'gpt-4': 'gpt-4',
    'gpt-3.5-turbo': 'gpt-3.5-turbo',
    'o1': 'o1',
    'o1-mini': 'o1-mini',
    'o1-preview': 'o1-preview',
    'o3-mini': 'o3-mini',
    // Gemini
    'gemini-pro': 'gemini-1.5-pro',
    'gemini-1.5-pro': 'gemini-1.5-pro',
    'gemini-1.5-flash': 'gemini-1.5-flash',
    'gemini-2.0-flash': 'gemini-2.0-flash-exp',
    'gemini-2.5-flash': 'gemini-2.5-flash-preview-04-17',
    'gemini-2.5-pro': 'gemini-2.5-pro-exp-03-25',
    // Mistral
    'mistral-large': 'mistral-large-latest',
    'mistral-medium': 'mistral-medium-latest',
    'mistral-small': 'mistral-small-latest',
    'codestral': 'codestral-latest',
    'pixtral-large': 'pixtral-large-latest',
    // Llama
    'llama-3.1-405b': 'llama-3.1-405b-instruct',
    'llama-3.1-70b': 'llama-3.1-70b-instruct',
    'llama-3.1-8b': 'llama-3.1-8b-instruct',
    'llama-3.3-70b': 'llama-3.3-70b-instruct',
    // DeepSeek
    'deepseek-chat': 'deepseek-chat',
    'deepseek-reasoner': 'deepseek-reasoner',
    'deepseek-coder': 'deepseek-coder',
    // Qwen
    'qwen-max': 'qwen-max',
    'qwen-plus': 'qwen-plus',
    'qwen-turbo': 'qwen-turbo',
    'qwen-coder': 'qwen-coder-turbo',
    // Grok
    'grok-2': 'grok-2-latest',
    'grok-beta': 'grok-beta',
    // Perplexity
    'perplexity-online': 'llama-3.1-sonar-huge-128k-online',
    'perplexity-sonar': 'llama-3.1-sonar-large-128k-online',
};
// Image generation models
export const IMAGE_MODELS = {
    // DALL-E
    'dall-e-3': 'dall-e-3',
    'dall-e-2': 'dall-e-2',
    // Flux
    'flux-pro': 'black-forest-labs/flux-pro',
    'flux-pro-1.1': 'black-forest-labs/flux-1.1-pro',
    'flux-pro-ultra': 'black-forest-labs/flux-1.1-pro-ultra',
    'flux-dev': 'black-forest-labs/flux-dev',
    'flux-schnell': 'black-forest-labs/flux-schnell',
    // Stable Diffusion
    'sdxl': 'stability-ai/stable-diffusion-xl-1024-v1-0',
    'sd-core': 'stability-ai/stable-image-core',
    'sd-ultra': 'stability-ai/stable-image-ultra',
    // Leonardo
    'leonardo-phoenix': 'leonardo-ai/phoenix',
    'leonardo-lightning': 'leonardo-ai/lightning-xl',
    'leonardo-anime': 'leonardo-ai/anime-xl',
    'leonardo-diffusion': 'leonardo-ai/diffusion-xl',
    'leonardo-kino': 'leonardo-ai/kino-xl',
    'leonardo-vision': 'leonardo-ai/vision-xl',
    // Magic Art (1min.ai native)
    'magic-art': 'magic-art',
    'magic-art-5.2': 'magic-art-5.2',
    'magic-art-6.1': 'magic-art-6.1',
    'magic-art-7.0': 'magic-art-7.0',
    // Recraft
    'recraft': 'recraft-v3',
    // GPT Image
    'gpt-image-1': 'gpt-image-1',
    'gpt-image-1-mini': 'gpt-image-1-mini',
    // Gemini Image
    'gemini-image': 'gemini-2.0-flash-exp-image',
    // Grok Image
    'grok-image': 'grok-2-image',
    // Qwen Image
    'qwen-image': 'qwen-vl-max',
};
// Audio models
export const AUDIO_MODELS = {
    // TTS
    'tts-1': 'tts-1',
    'tts-1-hd': 'tts-1-hd',
    'elevenlabs': 'elevenlabs-v1',
    // STT
    'whisper-1': 'whisper-1',
    'whisper-large': 'whisper-large-v3',
};
// Video models
export const VIDEO_MODELS = {
    'runway-gen3': 'runway-gen3-turbo',
    'luma': 'luma-dream-machine',
    'kling': 'kling-v1',
    'minimax': 'minimax-video-01',
    'haiper': 'haiper-video-2',
    'pika': 'pika-1.0',
};
// Feature types
export const FEATURE_TYPES = {
    // Chat
    CHAT_WITH_AI: 'CHAT_WITH_AI',
    CHAT_WITH_IMAGE: 'CHAT_WITH_IMAGE',
    CHAT_WITH_PDF: 'CHAT_WITH_PDF',
    CHAT_WITH_YOUTUBE_VIDEO: 'CHAT_WITH_YOUTUBE_VIDEO',
    // Image
    IMAGE_GENERATOR: 'IMAGE_GENERATOR',
    IMAGE_VARIATOR: 'IMAGE_VARIATOR',
    IMAGE_UPSCALER: 'IMAGE_UPSCALER',
    IMAGE_TO_PROMPT: 'IMAGE_TO_PROMPT',
    BACKGROUND_REMOVER: 'BACKGROUND_REMOVER',
    BACKGROUND_REPLACER: 'BACKGROUND_REPLACER',
    TEXT_REMOVER: 'TEXT_REMOVER',
    IMAGE_OBJECT_REPLACER: 'IMAGE_OBJECT_REPLACER',
    IMAGE_TEXT_EDITOR: 'IMAGE_TEXT_EDITOR',
    // Audio
    TEXT_TO_SPEECH: 'TEXT_TO_SPEECH',
    SPEECH_TO_TEXT: 'SPEECH_TO_TEXT',
    // Video
    VIDEO_GENERATOR: 'VIDEO_GENERATOR',
    IMAGE_TO_VIDEO: 'IMAGE_TO_VIDEO',
};
/**
 * Get mapped model name
 */
export function mapModel(model, category = 'chat') {
    const maps = {
        chat: CHAT_MODELS,
        image: IMAGE_MODELS,
        audio: AUDIO_MODELS,
        video: VIDEO_MODELS,
    };
    const map = maps[category] ?? CHAT_MODELS;
    return map[model] ?? model;
}
/**
 * Get all available models
 */
export function getAllModels() {
    return {
        chat: Object.keys(CHAT_MODELS),
        image: Object.keys(IMAGE_MODELS),
        audio: Object.keys(AUDIO_MODELS),
        video: Object.keys(VIDEO_MODELS),
    };
}
// Default export for compatibility
export default {
    CHAT_MODELS,
    IMAGE_MODELS,
    AUDIO_MODELS,
    VIDEO_MODELS,
    FEATURE_TYPES,
    mapModel,
    getAllModels,
};
//# sourceMappingURL=models.js.map