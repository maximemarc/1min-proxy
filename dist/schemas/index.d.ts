import { z } from 'zod';
export declare const chatMessageContentPartSchema: z.ZodUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
    type: "text";
}, {
    text: string;
    type: "text";
}>, z.ZodObject<{
    type: z.ZodLiteral<"image_url">;
    image_url: z.ZodObject<{
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
    }, {
        url: string;
    }>;
}, "strip", z.ZodTypeAny, {
    image_url: {
        url: string;
    };
    type: "image_url";
}, {
    image_url: {
        url: string;
    };
    type: "image_url";
}>]>;
export declare const chatMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["system", "user", "assistant"]>;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        type: "text";
    }, {
        text: string;
        type: "text";
    }>, z.ZodObject<{
        type: z.ZodLiteral<"image_url">;
        image_url: z.ZodObject<{
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
        }, {
            url: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        image_url: {
            url: string;
        };
        type: "image_url";
    }, {
        image_url: {
            url: string;
        };
        type: "image_url";
    }>]>, "many">]>;
}, "strip", z.ZodTypeAny, {
    role: "system" | "user" | "assistant";
    content: string | ({
        text: string;
        type: "text";
    } | {
        image_url: {
            url: string;
        };
        type: "image_url";
    })[];
}, {
    role: "system" | "user" | "assistant";
    content: string | ({
        text: string;
        type: "text";
    } | {
        image_url: {
            url: string;
        };
        type: "image_url";
    })[];
}>;
export declare const chatCompletionRequestSchema: z.ZodObject<{
    model: z.ZodString;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "assistant"]>;
        content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            text: string;
            type: "text";
        }, {
            text: string;
            type: "text";
        }>, z.ZodObject<{
            type: z.ZodLiteral<"image_url">;
            image_url: z.ZodObject<{
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
            }, {
                url: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            image_url: {
                url: string;
            };
            type: "image_url";
        }, {
            image_url: {
                url: string;
            };
            type: "image_url";
        }>]>, "many">]>;
    }, "strip", z.ZodTypeAny, {
        role: "system" | "user" | "assistant";
        content: string | ({
            text: string;
            type: "text";
        } | {
            image_url: {
                url: string;
            };
            type: "image_url";
        })[];
    }, {
        role: "system" | "user" | "assistant";
        content: string | ({
            text: string;
            type: "text";
        } | {
            image_url: {
                url: string;
            };
            type: "image_url";
        })[];
    }>, "many">;
    stream: z.ZodDefault<z.ZodBoolean>;
    temperature: z.ZodOptional<z.ZodNumber>;
    max_tokens: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodOptional<z.ZodNumber>;
    presence_penalty: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    model: string;
    messages: {
        role: "system" | "user" | "assistant";
        content: string | ({
            text: string;
            type: "text";
        } | {
            image_url: {
                url: string;
            };
            type: "image_url";
        })[];
    }[];
    stream: boolean;
    temperature?: number | undefined;
    max_tokens?: number | undefined;
    top_p?: number | undefined;
    frequency_penalty?: number | undefined;
    presence_penalty?: number | undefined;
}, {
    model: string;
    messages: {
        role: "system" | "user" | "assistant";
        content: string | ({
            text: string;
            type: "text";
        } | {
            image_url: {
                url: string;
            };
            type: "image_url";
        })[];
    }[];
    stream?: boolean | undefined;
    temperature?: number | undefined;
    max_tokens?: number | undefined;
    top_p?: number | undefined;
    frequency_penalty?: number | undefined;
    presence_penalty?: number | undefined;
}>;
export type ChatCompletionRequestInput = z.infer<typeof chatCompletionRequestSchema>;
export declare const imageGenerationRequestSchema: z.ZodObject<{
    model: z.ZodDefault<z.ZodString>;
    prompt: z.ZodString;
    n: z.ZodDefault<z.ZodNumber>;
    size: z.ZodDefault<z.ZodEnum<["256x256", "512x512", "1024x1024", "1792x1024", "1024x1792"]>>;
    quality: z.ZodDefault<z.ZodEnum<["standard", "hd"]>>;
    style: z.ZodDefault<z.ZodEnum<["vivid", "natural"]>>;
    response_format: z.ZodDefault<z.ZodEnum<["url", "b64_json"]>>;
}, "strip", z.ZodTypeAny, {
    model: string;
    prompt: string;
    n: number;
    size: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792";
    quality: "standard" | "hd";
    style: "vivid" | "natural";
    response_format: "url" | "b64_json";
}, {
    prompt: string;
    model?: string | undefined;
    n?: number | undefined;
    size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792" | undefined;
    quality?: "standard" | "hd" | undefined;
    style?: "vivid" | "natural" | undefined;
    response_format?: "url" | "b64_json" | undefined;
}>;
export type ImageGenerationRequestInput = z.infer<typeof imageGenerationRequestSchema>;
export declare const imageEditRequestSchema: z.ZodObject<{
    image: z.ZodString;
    mask: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
    model: z.ZodDefault<z.ZodString>;
    n: z.ZodDefault<z.ZodNumber>;
    size: z.ZodDefault<z.ZodEnum<["256x256", "512x512", "1024x1024"]>>;
}, "strip", z.ZodTypeAny, {
    model: string;
    prompt: string;
    n: number;
    image: string;
    size: "256x256" | "512x512" | "1024x1024";
    mask?: string | undefined;
}, {
    prompt: string;
    image: string;
    model?: string | undefined;
    n?: number | undefined;
    size?: "256x256" | "512x512" | "1024x1024" | undefined;
    mask?: string | undefined;
}>;
export declare const imageVariationRequestSchema: z.ZodObject<{
    image: z.ZodString;
    model: z.ZodDefault<z.ZodString>;
    n: z.ZodDefault<z.ZodNumber>;
    size: z.ZodDefault<z.ZodEnum<["256x256", "512x512", "1024x1024"]>>;
    response_format: z.ZodDefault<z.ZodEnum<["url", "b64_json"]>>;
}, "strip", z.ZodTypeAny, {
    model: string;
    n: number;
    image: string;
    size: "256x256" | "512x512" | "1024x1024";
    response_format: "url" | "b64_json";
}, {
    image: string;
    model?: string | undefined;
    n?: number | undefined;
    size?: "256x256" | "512x512" | "1024x1024" | undefined;
    response_format?: "url" | "b64_json" | undefined;
}>;
export declare const speechRequestSchema: z.ZodObject<{
    model: z.ZodDefault<z.ZodString>;
    input: z.ZodString;
    voice: z.ZodDefault<z.ZodEnum<["alloy", "echo", "fable", "onyx", "nova", "shimmer"]>>;
    response_format: z.ZodDefault<z.ZodEnum<["mp3", "opus", "aac", "flac", "wav", "pcm"]>>;
    speed: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    model: string;
    voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
    response_format: "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm";
    input: string;
    speed: number;
}, {
    input: string;
    model?: string | undefined;
    voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" | undefined;
    response_format?: "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm" | undefined;
    speed?: number | undefined;
}>;
export type SpeechRequestInput = z.infer<typeof speechRequestSchema>;
export declare const transcriptionRequestSchema: z.ZodObject<{
    file: z.ZodUnion<[z.ZodString, z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>, z.ZodType<import("buffer").Blob, z.ZodTypeDef, import("buffer").Blob>]>;
    model: z.ZodDefault<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
    response_format: z.ZodDefault<z.ZodEnum<["json", "text", "srt", "vtt"]>>;
}, "strip", z.ZodTypeAny, {
    model: string;
    response_format: "text" | "json" | "srt" | "vtt";
    file: string | Buffer<ArrayBufferLike> | import("buffer").Blob;
    prompt?: string | undefined;
    language?: string | undefined;
}, {
    file: string | Buffer<ArrayBufferLike> | import("buffer").Blob;
    model?: string | undefined;
    prompt?: string | undefined;
    language?: string | undefined;
    response_format?: "text" | "json" | "srt" | "vtt" | undefined;
}>;
export declare const translationRequestSchema: z.ZodObject<{
    file: z.ZodUnion<[z.ZodString, z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>, z.ZodType<import("buffer").Blob, z.ZodTypeDef, import("buffer").Blob>]>;
    model: z.ZodDefault<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
    response_format: z.ZodDefault<z.ZodEnum<["json", "text"]>>;
}, "strip", z.ZodTypeAny, {
    model: string;
    response_format: "text" | "json";
    file: string | Buffer<ArrayBufferLike> | import("buffer").Blob;
    prompt?: string | undefined;
}, {
    file: string | Buffer<ArrayBufferLike> | import("buffer").Blob;
    model?: string | undefined;
    prompt?: string | undefined;
    response_format?: "text" | "json" | undefined;
}>;
export declare const modelParamSchema: z.ZodObject<{
    model: z.ZodString;
}, "strip", z.ZodTypeAny, {
    model: string;
}, {
    model: string;
}>;
export declare const conversationCreateSchema: z.ZodObject<{
    type: z.ZodEnum<["CHAT_WITH_AI", "CHAT_WITH_IMAGE", "CHAT_WITH_PDF", "CHAT_WITH_YOUTUBE_VIDEO"]>;
    title: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    fileList: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    youtubeUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "CHAT_WITH_AI" | "CHAT_WITH_IMAGE" | "CHAT_WITH_PDF" | "CHAT_WITH_YOUTUBE_VIDEO";
    model?: string | undefined;
    title?: string | undefined;
    fileList?: string[] | undefined;
    youtubeUrl?: string | undefined;
}, {
    type: "CHAT_WITH_AI" | "CHAT_WITH_IMAGE" | "CHAT_WITH_PDF" | "CHAT_WITH_YOUTUBE_VIDEO";
    model?: string | undefined;
    title?: string | undefined;
    fileList?: string[] | undefined;
    youtubeUrl?: string | undefined;
}>;
export declare const featureRequestSchema: z.ZodObject<{
    type: z.ZodString;
    model: z.ZodString;
    conversationId: z.ZodOptional<z.ZodString>;
    promptObject: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    model: string;
    type: string;
    promptObject: Record<string, unknown>;
    conversationId?: string | undefined;
}, {
    model: string;
    type: string;
    promptObject: Record<string, unknown>;
    conversationId?: string | undefined;
}>;
//# sourceMappingURL=index.d.ts.map