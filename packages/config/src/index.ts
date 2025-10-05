import { z } from 'zod';

export const featureFlags = {
  enableComputerVision: true,
  enableOfflineQueue: true,
  enableWebsockets: true,
  enableStripe: true,
  enableAnalytics: true,
} as const;

export const colorTokens = {
  bg0: 'hsl(210 40% 98%)',
  bg1: 'hsl(0 0% 100%)',
  text1: 'hsl(222 47% 11%)',
  text2: 'hsl(215 16% 47%)',
  brand: 'hsl(192 95% 40%)',
  brand2: 'hsl(192 90% 32%)',
  accent: 'hsl(158 62% 45%)',
  ok: 'hsl(142 72% 29%)',
  warn: 'hsl(38 92% 50%)',
  danger: 'hsl(0 84% 60%)',
  border: 'hsl(214 32% 91%)',
} as const;

export const appConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(24),
  PORT: z.coerce.number().default(4000),
  WEB_URL: z.string().url().default('http://localhost:5173'),
  MOBILE_DEEP_LINK: z.string().default('vitalize://'),
  STRIPE_KEY: z.string().optional(),
  ANALYTICS_WRITE_KEY: z.string().optional(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function parseEnv(env: NodeJS.ProcessEnv): AppConfig {
  return appConfigSchema.parse(env);
}
