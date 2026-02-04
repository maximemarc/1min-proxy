import type { Request, Response } from 'express';
import type { OneMinAPI } from '../client.js';
export declare class ImagesHandler {
    private readonly api;
    constructor(api: OneMinAPI);
    /**
     * Handle image generation (POST /v1/images/generations)
     */
    generate(req: Request, res: Response): Promise<void>;
    /**
     * Handle image edit (POST /v1/images/edits)
     */
    edit(_req: Request, res: Response): Promise<void>;
    /**
     * Handle image variations (POST /v1/images/variations)
     */
    variations(req: Request, res: Response): Promise<void>;
    /**
     * Calculate aspect ratio string from dimensions
     */
    private calculateAspectRatio;
    /**
     * Extract images from API response
     */
    private extractImages;
}
export { ImagesHandler as default };
//# sourceMappingURL=images.d.ts.map