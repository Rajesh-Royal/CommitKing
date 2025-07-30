/**
 * Debug logging utility for development
 * Automatically disabled in production
 */

const IS_DEV = process.env.NODE_ENV === 'development';

type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

interface LogOptions {
  level?: LogLevel;
  prefix?: string;
  emoji?: string;
}

const LOG_STYLES = {
  info: { emoji: 'ℹ️', color: '#3b82f6' },
  warn: { emoji: '⚠️', color: '#f59e0b' },
  error: { emoji: '❌', color: '#ef4444' },
  success: { emoji: '✅', color: '#10b981' },
  debug: { emoji: '🔍', color: '#8b5cf6' },
};

export const debugLog = {
  info: (message: string, data?: unknown) => log(message, data, { level: 'info' }),
  warn: (message: string, data?: unknown) => log(message, data, { level: 'warn' }),
  error: (message: string, data?: unknown) => log(message, data, { level: 'error' }),
  success: (message: string, data?: unknown) => log(message, data, { level: 'success' }),
  debug: (message: string, data?: unknown) => log(message, data, { level: 'debug' }),
  
  // Specialized loggers for specific features
  cache: {
    hit: (type: string, count: number) => 
      log(`Cache HIT: Using ${count} cached ${type} items`, null, { level: 'success', prefix: 'CACHE' }),
    miss: (type: string, reason?: string) => 
      log(`Cache MISS: ${type} ${reason ? `(${reason})` : ''}`, null, { level: 'warn', prefix: 'CACHE' }),
    prefetch: (type: string, count: number) => 
      log(`Prefetching ${count} ${type} items`, null, { level: 'info', prefix: 'CACHE' }),
  },
  
  api: {
    start: (endpoint: string, params?: Record<string, unknown>) => 
      log(`API Request: ${endpoint}`, params, { level: 'info', prefix: 'API' }),
    success: (endpoint: string, count: number) => 
      log(`API Success: ${endpoint} returned ${count} items`, null, { level: 'success', prefix: 'API' }),
    error: (endpoint: string, error: unknown) => 
      log(`API Error: ${endpoint}`, error, { level: 'error', prefix: 'API' }),
  },
  
  queue: {
    init: (type: string, count: number) => 
      log(`Queue initialized with ${count} ${type} items`, null, { level: 'success', prefix: 'QUEUE' }),
    switch: (fromType: string, toType: string) => 
      log(`Switching queue from ${fromType} to ${toType}`, null, { level: 'info', prefix: 'QUEUE' }),
    refill: (type: string, count: number) => 
      log(`Refilling queue with ${count} ${type} items`, null, { level: 'info', prefix: 'QUEUE' }),
  },
};

function log(message: string, data?: unknown, options: LogOptions = {}) {
  if (!IS_DEV) return;
  
  const { level = 'info', prefix } = options;
  const style = LOG_STYLES[level];
  
  const timestamp = new Date().toLocaleTimeString();
  const prefixStr = prefix ? `[${prefix}]` : '';
  const logMessage = `${style.emoji} ${timestamp} ${prefixStr} ${message}`;
  
  if (level === 'error') {
    console.error(logMessage, data ? data : '');
  } else if (level === 'warn') {
    console.warn(logMessage, data ? data : '');
  } else {
    console.log(logMessage, data ? data : '');
  }
}

// Export individual methods for convenience
export const { info, warn, error, success, debug } = debugLog;
