// ==================== API Types ====================

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | ChatMessageContentPart[];
}

export interface ChatMessageContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: TokenUsage;
}

export interface ChatCompletionChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: ChatCompletionChunkChoice[];
}

export interface ChatCompletionChunkChoice {
  index: number;
  delta: {
    content?: string;
    role?: string;
  };
  finish_reason: string | null;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// ==================== Image Types ====================

export interface ImageGenerationRequest {
  model: string;
  prompt: string;
  n?: number;
  size?: string;
  quality?: string;
  style?: string;
  response_format?: 'url' | 'b64_json';
}

export interface ImageResponse {
  created: number;
  data: Array<{ url?: string; b64_json?: string }>;
}

// ==================== Audio Types ====================

export interface SpeechRequest {
  model: string;
  input: string;
  voice?: string;
  response_format?: string;
  speed?: number;
}

export interface TranscriptionRequest {
  file: string | Buffer | Blob;
  model: string;
  language?: string;
  prompt?: string;
  response_format?: string;
}

// ==================== Model Types ====================

export interface ModelInfo {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
  permission: unknown[];
  root: string;
  parent: null;
}

export interface ModelListResponse {
  object: 'list';
  data: ModelInfo[];
}

// ==================== 1min.ai API Types ====================

export interface OneMinFeatureRequest {
  type: string;
  model: string;
  conversationId?: string;
  promptObject: Record<string, unknown>;
}

export interface OneMinAPIResponse {
  result?: unknown;
  response?: unknown;
  aiRecord?: {
    aiRecordDetail?: {
      resultObject?: unknown;
    };
  };
  content?: string;
}

export interface ConversationParams {
  type: string;
  title?: string;
  model?: string;
  fileList?: string[];
  youtubeUrl?: string;
}

// ==================== Config Types ====================

export interface ServerConfig {
  port: number;
  apiKey: string;
  nodeEnv: string;
}

// ==================== Handler Types ====================

export interface HandlerContext {
  apiKey: string;
}
