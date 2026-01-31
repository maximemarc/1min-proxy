/**
 * OpenAI-compatible Chat Completions Handler
 */

import { mapModel } from '../models.js';

/**
 * Convert OpenAI messages to 1min.ai prompt
 */
function convertMessages(messages) {
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1];
  
  let context = '';
  for (const msg of messages.slice(0, -1)) {
    if (msg.role === 'system') {
      context += `System: ${msg.content}\n\n`;
    } else if (msg.role === 'user') {
      context += `User: ${msg.content}\n\n`;
    } else if (msg.role === 'assistant') {
      context += `Assistant: ${msg.content}\n\n`;
    }
  }
  
  let prompt = lastUserMessage?.content || '';
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
        if (part.type === 'image_url') {
          images.push(part.image_url.url);
        }
      }
    }
  }
  
  return images;
}

export class ChatHandler {
  constructor(api) {
    this.api = api;
  }

  /**
   * Handle OpenAI chat completions request
   */
  async handle(req, res) {
    try {
      const { model, messages, stream = false, temperature, max_tokens } = req.body;
      
      const mappedModel = mapModel(model, 'chat');
      const prompt = convertMessages(messages);
      const images = extractImages(messages);
      
      console.log(`[chat] model=${model} -> ${mappedModel}, stream=${stream}, images=${images.length}`);
      
      if (stream) {
        await this.handleStream(res, mappedModel, prompt, images, model);
      } else {
        await this.handleSync(res, mappedModel, prompt, images, model);
      }
      
    } catch (err) {
      console.error('[chat] Error:', err);
      res.status(500).json({ error: { message: err.message } });
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
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content,
        },
        finish_reason: 'stop',
      }],
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
        if (done) break;
        
        const text = decoder.decode(value, { stream: true });
        
        const chunk = {
          id: messageId,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: originalModel,
          choices: [{
            index: 0,
            delta: { content: text },
            finish_reason: null,
          }],
        };
        
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      
      // Final chunk
      const finalChunk = {
        id: messageId,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model: originalModel,
        choices: [{
          index: 0,
          delta: {},
          finish_reason: 'stop',
        }],
      };
      
      res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      
    } catch (err) {
      console.error('[chat:stream] Error:', err);
      res.end();
    }
  }

  /**
   * Extract content from API response
   */
  extractContent(data) {
    // Try different response structures
    if (typeof data === 'string') return data;
    if (data.result) return data.result;
    if (data.response) return data.response;
    if (data.aiRecord?.aiRecordDetail?.resultObject) {
      const result = data.aiRecord.aiRecordDetail.resultObject;
      return Array.isArray(result) ? result.join('') : result;
    }
    if (data.content) return data.content;
    return JSON.stringify(data);
  }
}

export default ChatHandler;
