import type { Request, Response } from 'express';
import type { OneMinAPI } from '../client.js';
export declare class EmbeddingsHandler {
    private readonly _api;
    constructor(_api: OneMinAPI);
    /**
     * Handle embeddings creation (POST /v1/embeddings)
     */
    create(req: Request, res: Response): Promise<void>;
}
export { EmbeddingsHandler as default };
//# sourceMappingURL=embeddings.d.ts.map