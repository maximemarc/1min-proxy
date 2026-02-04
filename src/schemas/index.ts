import { z } from 'zod';

// ==================== Chat Schemas ====================

export const chatMessageContentPartSchema = z.union([
  z.object({
    type: z.literal('text'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('image_url'),
    image_url: z.object({ url: z.string().url() }),
  }),
]);

export const chatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.union([z.string(), z.array(chatMessageContentPartSchema)]),
});

export const chatCompletionRequestSchema = z.object({
  model: z.string().min(1),
  messages: z.array(chatMessageSchema).min(1),
  stream: z.boolean().default(false),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().optional(),
  top_p: z.number().min(0).max(1).optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
});

export type ChatCompletionRequestInput = z.infer<typeof chatCompletionRequestSchema>;

// ==================== Image Schemas ====================

export const imageGenerationRequestSchema = z.object({
  model: z.string().default('dall-e-3'),
  prompt: z.string().min(1).max(4000),
  n: z.number().int().min(1).max(10).default(1),
  size: z.enum(['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792']).default('1024x1024'),
  quality: z.enum(['standard', 'hd']).default('standard'),
  style: z.enum(['vivid', 'natural']).default('vivid'),
  response_format: z.enum(['url', 'b64_json']).default('url'),
});

export type ImageGenerationRequestInput = z.infer<typeof imageGenerationRequestSchema>;

export const imageEditRequestSchema = z.object({
  image: z.string(),
  mask: z.string().optional(),
  prompt: z.string().min(1),
  model: z.string().default('dall-e-2'),
  n: z.number().int().min(1).max(10).default(1),
  size: z.enum(['256x256', '512x512', '1024x1024']).default('1024x1024'),
});

export const imageVariationRequestSchema = z.object({
  image: z.string(),
  model: z.string().default('dall-e-2'),
  n: z.number().int().min(1).max(10).default(1),
  size: z.enum(['256x256', '512x512', '1024x1024']).default('1024x1024'),
  response_format: z.enum(['url', 'b64_json']).default('url'),
});

// ==================== Audio Schemas ====================

export const speechRequestSchema = z.object({
  model: z.string().default('tts-1'),
  input: z.string().min(1).max(4096),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).default('alloy'),
  response_format: z.enum(['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm']).default('mp3'),
  speed: z.number().min(0.25).max(4.0).default(1.0),
});

export type SpeechRequestInput = z.infer<typeof speechRequestSchema>;

export const transcriptionRequestSchema = z.object({
  file: z.union([z.string(), z.instanceof(Buffer), z.instanceof(Blob)]),
  model: z.string().default('whisper-1'),
  language: z.string().length(2).optional(),
  prompt: z.string().optional(),
  response_format: z.enum(['json', 'text', 'srt', 'vtt']).default('json'),
});

export const translationRequestSchema = z.object({
  file: z.union([z.string(), z.instanceof(Buffer), z.instanceof(Blob)]),
  model: z.string().default('whisper-1'),
  prompt: z.string().optional(),
  response_format: z.enum(['json', 'text']).default('json'),
});

// ==================== Model Schemas ====================

export const modelParamSchema = z.object({
  model: z.string().min(1),
});

// ==================== Native API Schemas ====================

export const conversationCreateSchema = z.object({
  type: z.enum(['CHAT_WITH_AI', 'CHAT_WITH_IMAGE', 'CHAT_WITH_PDF', 'CHAT_WITH_YOUTUBE_VIDEO']),
  title: z.string().optional(),
  model: z.string().optional(),
  fileList: z.array(z.string()).optional(),
  youtubeUrl: z.string().url().optional(),
});

export const featureRequestSchema = z.object({
  type: z.string(),
  model: z.string(),
  conversationId: z.string().optional(),
  promptObject: z.record(z.unknown()),
});
