import { config } from 'dotenv';
import { logger } from '../utils/logger.js';

config();

export interface AppConfig {
  port: number;
  apiKey: string | undefined;
  nodeEnv: string;
  logLevel: string;
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMax: number;
  oneMinBaseUrl: string;
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (value === undefined) {
    logger.warn(`Environment variable ${name} is not set`);
  }
  return value ?? '';
}

function getEnvVarAsNumber(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    logger.warn(
      `Environment variable ${name} is not a valid number, using default ${defaultValue}`
    );
    return defaultValue;
  }
  return parsed;
}

export const appConfig: AppConfig = {
  port: getEnvVarAsNumber('PORT', 3456),
  apiKey: process.env.ONEMIN_API_KEY,
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  logLevel: getEnvVar('LOG_LEVEL', 'info'),
  corsOrigins: getEnvVar('CORS_ORIGINS', '*')
    .split(',')
    .map((s) => s.trim()),
  rateLimitWindowMs: getEnvVarAsNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
  rateLimitMax: getEnvVarAsNumber('RATE_LIMIT_MAX', 100),
  oneMinBaseUrl: getEnvVar('ONEMIN_BASE_URL', 'https://api.1min.ai'),
};

// Validate required config in production
if (appConfig.nodeEnv === 'production' && !appConfig.apiKey) {
  logger.error('ONEMIN_API_KEY is required in production mode');
  process.exit(1);
}
