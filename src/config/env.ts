import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  APP_NAME: z.string().default('notarial-palata-bot'),
  APP_VERSION: z.string().default('1.0.0'),

  // Telegram Bot Token
  TELEGRAM_BOT_TOKEN: z.string().min(10, 'Telegram bot token must be provided'),
  TELEGRAM_MODE: z.enum(['polling', 'webhook']).default('polling'),
  WEBHOOK_DOMAIN: z.string().optional(),
  WEBHOOK_PATH: z.string().default('/webhook/telegram'),
  WEBHOOK_SECRET_TOKEN: z.string().optional(),

  // Database
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/notarial_palata_db?schema=public'),

  // Redis (Optional)
  REDIS_URL: z.string().optional(),
  REDIS_KEY_PREFIX: z.string().default('notary_bot:'),

  // Rate Limiting
  RATE_LIMIT_USER_MAX: z.coerce.number().default(20),
  RATE_LIMIT_USER_WINDOW_SECONDS: z.coerce.number().default(60),
  RATE_LIMIT_BURST_MAX: z.coerce.number().default(5),
  RATE_LIMIT_BURST_WINDOW_SECONDS: z.coerce.number().default(5),

  // External APIs / Providers
  LEXUZ_BASE_URL: z.string().url().default('https://lex.uz'),
  ADVICE_UZ_BASE_URL: z.string().url().default('https://advice.uz'),
  E_NOTARIUS_BASE_URL: z.string().url().default('https://e-notarius.uz'),
  EXTERNAL_REQUEST_TIMEOUT_MS: z.coerce.number().default(6000),
  CACHE_TTL_NOTARY_SECONDS: z.coerce.number().default(86400),
  CACHE_TTL_LEGAL_DOC_SECONDS: z.coerce.number().default(604800),

  // AI / LLM Configuration (Optional)
  LLM_PROVIDER: z.enum(['none', 'openai', 'gemini']).default('none'),
  LLM_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().default('gemini-1.5-flash'),
  LLM_MAX_TOKENS: z.coerce.number().default(1000),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_PRETTY: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function loadEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.format();
    // Do not crash during tests if TELEGRAM_BOT_TOKEN is missing; provide a safe mock
    if (process.env.NODE_ENV === 'test') {
      return envSchema.parse({
        ...process.env,
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '123456789:ABCdefTEST_MOCK_TOKEN_FOR_UNIT_TESTS',
      });
    }
    console.error('❌ Configuration validation failed:', JSON.stringify(formatted, null, 2));
    throw new Error('Invalid environment configuration');
  }
  return result.data;
}

export const env = loadEnv();
