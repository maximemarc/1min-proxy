export declare const logger: import("pino").Logger<never>;
export declare function logRequest(method: string, path: string, statusCode: number, durationMs: number): void;
export declare function logError(error: Error, context?: Record<string, unknown>): void;
//# sourceMappingURL=logger.d.ts.map