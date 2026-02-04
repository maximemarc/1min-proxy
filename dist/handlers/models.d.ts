import type { Request, Response } from 'express';
import type { OneMinAPI } from '../client.js';
export declare class ModelsHandler {
    private readonly _api;
    constructor(_api: OneMinAPI);
    /**
     * List all available models (GET /v1/models)
     */
    list(_req: Request, res: Response): Promise<void>;
    /**
     * Get a specific model (GET /v1/models/:model)
     */
    get(req: Request, res: Response): Promise<void>;
}
export { ModelsHandler as default };
//# sourceMappingURL=models.d.ts.map