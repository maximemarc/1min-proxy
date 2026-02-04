/**
 * Model definitions and mappings
 */
export type ModelCategory = 'chat' | 'image' | 'audio' | 'video';
export declare const CHAT_MODELS: Record<string, string>;
export declare const IMAGE_MODELS: Record<string, string>;
export declare const AUDIO_MODELS: Record<string, string>;
export declare const VIDEO_MODELS: Record<string, string>;
export declare const FEATURE_TYPES: {
    readonly CHAT_WITH_AI: "CHAT_WITH_AI";
    readonly CHAT_WITH_IMAGE: "CHAT_WITH_IMAGE";
    readonly CHAT_WITH_PDF: "CHAT_WITH_PDF";
    readonly CHAT_WITH_YOUTUBE_VIDEO: "CHAT_WITH_YOUTUBE_VIDEO";
    readonly IMAGE_GENERATOR: "IMAGE_GENERATOR";
    readonly IMAGE_VARIATOR: "IMAGE_VARIATOR";
    readonly IMAGE_UPSCALER: "IMAGE_UPSCALER";
    readonly IMAGE_TO_PROMPT: "IMAGE_TO_PROMPT";
    readonly BACKGROUND_REMOVER: "BACKGROUND_REMOVER";
    readonly BACKGROUND_REPLACER: "BACKGROUND_REPLACER";
    readonly TEXT_REMOVER: "TEXT_REMOVER";
    readonly IMAGE_OBJECT_REPLACER: "IMAGE_OBJECT_REPLACER";
    readonly IMAGE_TEXT_EDITOR: "IMAGE_TEXT_EDITOR";
    readonly TEXT_TO_SPEECH: "TEXT_TO_SPEECH";
    readonly SPEECH_TO_TEXT: "SPEECH_TO_TEXT";
    readonly VIDEO_GENERATOR: "VIDEO_GENERATOR";
    readonly IMAGE_TO_VIDEO: "IMAGE_TO_VIDEO";
};
/**
 * Get mapped model name
 */
export declare function mapModel(model: string, category?: ModelCategory): string;
/**
 * Get all available models
 */
export declare function getAllModels(): Record<ModelCategory, string[]>;
declare const _default: {
    CHAT_MODELS: Record<string, string>;
    IMAGE_MODELS: Record<string, string>;
    AUDIO_MODELS: Record<string, string>;
    VIDEO_MODELS: Record<string, string>;
    FEATURE_TYPES: {
        readonly CHAT_WITH_AI: "CHAT_WITH_AI";
        readonly CHAT_WITH_IMAGE: "CHAT_WITH_IMAGE";
        readonly CHAT_WITH_PDF: "CHAT_WITH_PDF";
        readonly CHAT_WITH_YOUTUBE_VIDEO: "CHAT_WITH_YOUTUBE_VIDEO";
        readonly IMAGE_GENERATOR: "IMAGE_GENERATOR";
        readonly IMAGE_VARIATOR: "IMAGE_VARIATOR";
        readonly IMAGE_UPSCALER: "IMAGE_UPSCALER";
        readonly IMAGE_TO_PROMPT: "IMAGE_TO_PROMPT";
        readonly BACKGROUND_REMOVER: "BACKGROUND_REMOVER";
        readonly BACKGROUND_REPLACER: "BACKGROUND_REPLACER";
        readonly TEXT_REMOVER: "TEXT_REMOVER";
        readonly IMAGE_OBJECT_REPLACER: "IMAGE_OBJECT_REPLACER";
        readonly IMAGE_TEXT_EDITOR: "IMAGE_TEXT_EDITOR";
        readonly TEXT_TO_SPEECH: "TEXT_TO_SPEECH";
        readonly SPEECH_TO_TEXT: "SPEECH_TO_TEXT";
        readonly VIDEO_GENERATOR: "VIDEO_GENERATOR";
        readonly IMAGE_TO_VIDEO: "IMAGE_TO_VIDEO";
    };
    mapModel: typeof mapModel;
    getAllModels: typeof getAllModels;
};
export default _default;
//# sourceMappingURL=models.d.ts.map