import { pino } from 'pino';
const isDevelopment = process.env.NODE_ENV !== 'production';
export const logger = pino({
    level: process.env.LOG_LEVEL ?? 'info',
    transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    base: {
        pid: process.pid,
        env: process.env.NODE_ENV ?? 'development',
    },
});
export function logRequest(method, path, statusCode, durationMs) {
    logger.info({
        method,
        path,
        statusCode,
        durationMs,
    }, `[${method}] ${path} - ${statusCode} (${durationMs}ms)`);
}
export function logError(error, context) {
    logger.error({
        err: error,
        ...context,
    }, error.message);
}
//# sourceMappingURL=logger.js.map