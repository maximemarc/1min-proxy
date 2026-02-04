import type { Request, Response } from 'express';
import type { OneMinAPI } from '../client.js';
export declare class ChatHandler {
    private readonly api;
    constructor(api: OneMinAPI);
    /**
     * Handle OpenAI chat completions request
     */
    handle(req: Request, res: Response): Promise<void>;
    /**
     * Handle synchronous response
     */
    private handleSync;
    /**
     * Handle streaming response
     */
    private handleStream;
    /**
     * Extract content from API response
     */
    private extractContent;
}
export { ChatHandler as default };
//# sourceMappingURL=chat.d.ts.map