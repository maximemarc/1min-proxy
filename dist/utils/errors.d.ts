export declare class APIError extends Error {
    readonly statusCode: number;
    readonly code?: string | undefined;
    readonly details?: Record<string, unknown> | undefined;
    constructor(message: string, statusCode?: number, code?: string | undefined, details?: Record<string, unknown> | undefined);
    toJSON(): {
        error: {
            details?: Record<string, unknown> | undefined;
            message: string;
            type: string;
        };
    };
}
export declare class ValidationError extends APIError {
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class AuthenticationError extends APIError {
    constructor(message?: string);
}
export declare class NotFoundError extends APIError {
    constructor(resource: string);
}
export declare class RateLimitError extends APIError {
    constructor(message?: string);
}
export declare class NotImplementedError extends APIError {
    constructor(feature: string);
}
//# sourceMappingURL=errors.d.ts.map