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
export declare const appConfig: AppConfig;
//# sourceMappingURL=index.d.ts.map