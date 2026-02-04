export class APIError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode = 500, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'APIError';
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            error: {
                message: this.message,
                type: this.code ?? 'api_error',
                ...(this.details && { details: this.details }),
            },
        };
    }
}
export class ValidationError extends APIError {
    constructor(message, details) {
        super(message, 400, 'invalid_request_error', details);
        this.name = 'ValidationError';
    }
}
export class AuthenticationError extends APIError {
    constructor(message = 'Missing or invalid API key') {
        super(message, 401, 'authentication_error');
        this.name = 'AuthenticationError';
    }
}
export class NotFoundError extends APIError {
    constructor(resource) {
        super(`${resource} not found`, 404, 'not_found_error');
        this.name = 'NotFoundError';
    }
}
export class RateLimitError extends APIError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429, 'rate_limit_exceeded');
        this.name = 'RateLimitError';
    }
}
export class NotImplementedError extends APIError {
    constructor(feature) {
        super(`${feature} is not implemented`, 501, 'not_implemented');
        this.name = 'NotImplementedError';
    }
}
//# sourceMappingURL=errors.js.map