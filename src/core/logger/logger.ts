import { env } from '../../config/env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_PATTERNS = [
  /(bot)?token[:=]\s*["']?([a-zA-Z0-9_\-:]+)["']?/gi,
  /password[:=]\s*["']?([^"',\s]+)["']?/gi,
  /secret[:=]\s*["']?([^"',\s]+)["']?/gi,
  /authorization:\s*["']?bearer\s+([^"',\s]+)["']?/gi,
];

function redactSensitiveData(data: unknown): unknown {
  if (typeof data === 'string') {
    let sanitized = data;
    for (const pattern of SENSITIVE_PATTERNS) {
      sanitized = sanitized.replace(pattern, '$1=[REDACTED]');
    }
    return sanitized;
  }
  if (Array.isArray(data)) {
    return data.map(redactSensitiveData);
  }
  if (data !== null && typeof data === 'object') {
    const copy: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const lower = key.toLowerCase();
      if (
        lower.includes('token') ||
        lower.includes('password') ||
        lower.includes('secret') ||
        lower.includes('auth') ||
        lower.includes('apikey') ||
        lower.includes('pinfl') ||
        lower.includes('passport')
      ) {
        copy[key] = '[REDACTED]';
      } else {
        copy[key] = redactSensitiveData(value);
      }
    }
    return copy;
  }
  return data;
}

export interface LogContext {
  [key: string]: unknown;
}

export class Logger {
  private contextName: string;
  private minLevel: LogLevel;

  private static levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(contextName = 'App') {
    this.contextName = contextName;
    this.minLevel = env.LOG_LEVEL;
  }

  private shouldLog(level: LogLevel): boolean {
    return Logger.levels[level] >= Logger.levels[this.minLevel];
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const cleanContext = context ? redactSensitiveData(context) : undefined;
    const logObject = {
      timestamp,
      level: level.toUpperCase(),
      context: this.contextName,
      message: typeof message === 'string' ? redactSensitiveData(message) : message,
      ...(cleanContext && typeof cleanContext === 'object' ? cleanContext : {}),
    };

    if (env.LOG_PRETTY) {
      return `[${timestamp}] [${level.toUpperCase()}] [${this.contextName}] ${message} ${
        cleanContext ? JSON.stringify(cleanContext, null, 2) : ''
      }`;
    }

    return JSON.stringify(logObject);
  }

  public debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  public info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  public warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  public error(message: string, error?: unknown, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errContext = {
        ...context,
        errorMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      };
      console.error(this.formatMessage('error', message, errContext));
    }
  }

  public child(name: string): Logger {
    return new Logger(`${this.contextName}:${name}`);
  }
}

export const logger = new Logger('NotarialBot');
