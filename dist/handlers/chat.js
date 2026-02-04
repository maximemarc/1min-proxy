import { mapModel } from '../models.js';
import { chatCompletionRequestSchema } from '../schemas/index.js';
import { APIError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
/**
 * Convert OpenAI messages to 1min.ai prompt
 */
function convertMessages(messages) {
    const userMessages = messages.filter((m) => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];
    let context = '';
    for (const msg of messages.slice(0, -1)) {
        if (typeof msg.content !== 'string') {
            continue;
        }
        if (msg.role === 'system') {
            context += `System: ${msg.content}\n\n`;
        }
        else if (msg.role === 'user') {
            context += `User: ${msg.content}\n\n`;
        }
        else if (msg.role === 'assistant') {
            context += `Assistant: ${msg.content}\n\n`;
        }
    }
    let prompt = '';
    if (typeof lastUserMessage?.content === 'string') {
        prompt = lastUserMessage.content;
    }
    if (context) {
        prompt = `${context}User: ${prompt}`;
    }
    return prompt;
}
/**
 * Extract images from messages
 */
function extractImages(messages) {
    const images = [];
    for (const msg of messages) {
        if (msg.role === 'user' && Array.isArray(msg.content)) {
            for (const part of msg.content) {
                if (typeof part === 'object' && part.type === 'image_url' && part.image_url?.url) {
                    images.push(part.image_url.url);
                }
            }
        }
    }
    return images;
}
export class ChatHandler {
    api;
    constructor(api) {
        this.api = api;
    }
    /**
     * Handle OpenAI chat completions request
     */
    async handle(req, res) {
        try {
            const parseResult = chatCompletionRequestSchema.safeParse(req.body);
            if (!parseResult.success) {
                throw new ValidationError('Invalid request body', parseResult.error.format());
            }
            const { model, messages, stream } = parseResult.data;
            const mappedModel = mapModel(model, 'chat');
            const prompt = convertMessages(messages);
            const images = extractImages(messages);
            logger.info({ model, mappedModel, stream, imageCount: images.length }, '[chat] Processing request');
            if (stream) {
                await this.handleStream(res, mappedModel, prompt, images, model);
            }
            else {
                await this.handleSync(res, mappedModel, prompt, images, model);
            }
        }
        catch (err) {
            logger.error({ err }, '[chat] Error handling request');
            if (err instanceof APIError) {
                res.status(err.statusCode).json(err.toJSON());
            }
            else {
                const apiError = new APIError(err instanceof Error ? err.message : 'Unknown error', 500);
                res.status(500).json(apiError.toJSON());
            }
        }
    }
    /**
     * Handle synchronous response
     */
    async handleSync(res, mappedModel, prompt, images, originalModel) {
        const featureType = images.length > 0 ? 'CHAT_WITH_IMAGE' : 'CHAT_WITH_AI';
        const payload = {
            type: featureType,
            model: mappedModel,
            promptObject: {
                prompt,
                isMixed: false,
                webSearch: false,
            },
        };
        if (images.length > 0) {
            payload.promptObject.imageList = images;
        }
        const data = await this.api.features.call(payload);
        const content = this.extractContent(data);
        res.json({
            id: `chatcmpl-${Date.now()}`,
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: originalModel,
            choices: [
                {
                    index: 0,
                    message: {
                        role: 'assistant',
                        content,
                    },
                    finish_reason: 'stop',
                },
            ],
            usage: {
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0,
            },
        });
    }
    /**
     * Handle streaming response
     */
    async handleStream(res, mappedModel, prompt, images, originalModel) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const featureType = images.length > 0 ? 'CHAT_WITH_IMAGE' : 'CHAT_WITH_AI';
        const payload = {
            type: featureType,
            model: mappedModel,
            promptObject: {
                prompt,
                isMixed: false,
                webSearch: false,
            },
        };
        if (images.length > 0) {
            payload.promptObject.imageList = images;
        }
        try {
            const stream = await this.api.features.stream(payload);
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            const messageId = `chatcmpl-${Date.now()}`;
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                const text = decoder.decode(value, { stream: true });
                const chunk = {
                    id: messageId,
                    object: 'chat.completion.chunk',
                    created: Math.floor(Date.now() / 1000),
                    model: originalModel,
                    choices: [
                        {
                            index: 0,
                            delta: { content: text },
                            finish_reason: null,
                        },
                    ],
                };
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            }
            // Final chunk
            const finalChunk = {
                id: messageId,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: originalModel,
                choices: [
                    {
                        index: 0,
                        delta: {},
                        finish_reason: 'stop',
                    },
                ],
            };
            res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
            res.write('data: [DONE]\n\n');
            res.end();
        }
        catch (err) {
            logger.error({ err }, '[chat:stream] Error');
            res.end();
        }
    }
    /**
     * Extract content from API response
     */
    extractContent(data) {
        if (typeof data === 'string') {
            return data;
        }
        const record = data;
        if (record.result) {
            return String(record.result);
        }
        if (record.response) {
            return String(record.response);
        }
        if (record.content) {
            return String(record.content);
        }
        const aiRecord = record.aiRecord;
        if (aiRecord?.aiRecordDetail) {
            const detail = aiRecord.aiRecordDetail;
            const result = detail.resultObject;
            if (Array.isArray(result)) {
                return result.join('');
            }
            return String(result ?? '');
        }
        return JSON.stringify(data);
    }
}
// Default export for compatibility
export { ChatHandler as default };
//# sourceMappingURL=chat.js.map