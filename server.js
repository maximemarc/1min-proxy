import express from 'express';
import { config } from 'dotenv';
config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3456;
const ONEMIN_API_KEY = process.env.ONEMIN_API_KEY;

// Model mapping: OpenAI format -> 1min.ai format
const MODEL_MAP = {
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
  // Gemini
  'gemini-pro': 'gemini-1.5-pro',
  'gemini-1.5-pro': 'gemini-1.5-pro',
  'gemini-1.5-flash': 'gemini-1.5-flash',
  // Mistral
  'mistral-large': 'mistral-large-latest',
  'mistral-medium': 'mistral-medium-latest',
  // Llama
  'llama-3.1-405b': 'llama-3.1-405b-instruct',
  'llama-3.1-70b': 'llama-3.1-70b-instruct',
};

// Convert OpenAI messages to 1min.ai prompt
function convertMessages(messages) {
  // Get the last user message as prompt
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1];
  
  // Build context from previous messages
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

// OpenAI-compatible chat completions endpoint
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const { model, messages, stream = false } = req.body;
    const apiKey = req.headers.authorization?.replace('Bearer ', '') || ONEMIN_API_KEY;
    
    if (!apiKey) {
      return res.status(401).json({ error: { message: 'Missing API key' } });
    }
    
    const mappedModel = MODEL_MAP[model] || model;
    const prompt = convertMessages(messages);
    
    console.log(`[1min-proxy] Request: model=${model} -> ${mappedModel}, stream=${stream}`);
    
    const oneminPayload = {
      type: 'CHAT_WITH_AI',
      model: mappedModel,
      promptObject: {
        prompt: prompt,
        isMixed: false,
        webSearch: false
      }
    };
    
    const oneminUrl = stream 
      ? 'https://api.1min.ai/api/features?isStreaming=true'
      : 'https://api.1min.ai/api/features';
    
    const response = await fetch(oneminUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-KEY': apiKey
      },
      body: JSON.stringify(oneminPayload)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`[1min-proxy] Error from 1min.ai: ${response.status} ${error}`);
      return res.status(response.status).json({ error: { message: error } });
    }
    
    if (stream) {
      // Streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      const messageId = `chatcmpl-${Date.now()}`;
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          // Send as OpenAI SSE format
          const chunk = {
            id: messageId,
            object: 'chat.completion.chunk',
            created: Math.floor(Date.now() / 1000),
            model: model,
            choices: [{
              index: 0,
              delta: { content: buffer },
              finish_reason: null
            }]
          };
          
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          buffer = '';
        }
        
        // Send final chunk
        const finalChunk = {
          id: messageId,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [{
            index: 0,
            delta: {},
            finish_reason: 'stop'
          }]
        };
        res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
        
      } catch (err) {
        console.error('[1min-proxy] Stream error:', err);
        res.end();
      }
      
    } else {
      // Non-streaming response
      const data = await response.json();
      const content = data.aiRecord?.aiRecordDetail?.resultObject || 
                     data.result || 
                     data.response || 
                     JSON.stringify(data);
      
      const openaiResponse = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: typeof content === 'string' ? content : JSON.stringify(content)
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
      
      res.json(openaiResponse);
    }
    
  } catch (err) {
    console.error('[1min-proxy] Error:', err);
    res.status(500).json({ error: { message: err.message } });
  }
});

// Models endpoint
app.get('/v1/models', (req, res) => {
  const models = Object.keys(MODEL_MAP).map(id => ({
    id,
    object: 'model',
    created: Date.now(),
    owned_by: '1min-proxy'
  }));
  res.json({ object: 'list', data: models });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', proxy: '1min-proxy' });
});

app.listen(PORT, () => {
  console.log(`[1min-proxy] Running on http://localhost:${PORT}`);
  console.log(`[1min-proxy] OpenAI-compatible endpoint: http://localhost:${PORT}/v1/chat/completions`);
  if (!ONEMIN_API_KEY) {
    console.log('[1min-proxy] Warning: ONEMIN_API_KEY not set, will require Authorization header');
  }
});
