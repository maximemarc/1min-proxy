/**
 * OpenAI-compatible Embeddings Handler
 * Note: 1min.ai may not have a direct embeddings endpoint
 * This is a placeholder for compatibility
 */

export class EmbeddingsHandler {
  constructor(api) {
    this.api = api;
  }

  /**
   * Handle embeddings creation (POST /v1/embeddings)
   */
  async create(req, res) {
    try {
      const { model = 'text-embedding-ada-002', input, encoding_format = 'float' } = req.body;
      
      console.log(`[embeddings] model=${model}, inputs=${Array.isArray(input) ? input.length : 1}`);
      
      // 1min.ai doesn't seem to have embeddings API
      // Return a stub response or error
      res.status(501).json({ 
        error: { 
          message: 'Embeddings not supported by 1min.ai API',
          type: 'not_implemented',
        } 
      });
      
    } catch (err) {
      console.error('[embeddings] Error:', err);
      res.status(500).json({ error: { message: err.message } });
    }
  }
}

export default EmbeddingsHandler;
