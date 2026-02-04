import type { Request, Response } from 'express';
import type { OneMinAPI } from '../client.js';
export declare class AudioHandler {
    private readonly api;
    constructor(api: OneMinAPI);
    /**
     * Handle speech synthesis (POST /v1/audio/speech)
     */
    speech(req: Request, res: Response): Promise<void>;
    /**
     * Handle transcription (POST /v1/audio/transcriptions)
     */
    transcription(req: Request, res: Response): Promise<void>;
    /**
     * Handle translation (POST /v1/audio/translations)
     */
    translation(req: Request, res: Response): Promise<void>;
    /**
     * Extract audio URL from response
     */
    private extractAudioUrl;
    /**
     * Extract text from transcription response
     */
    private extractText;
}
export { AudioHandler as default };
//# sourceMappingURL=audio.d.ts.map