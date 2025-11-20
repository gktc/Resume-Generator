/**
 * Logger utility for consistent logging across the application
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        error: {
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
          name: error.name,
        },
      }),
    };

    console.error(this.formatMessage('error', message, errorContext));
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  // Log HTTP requests
  request(method: string, path: string, statusCode: number, duration: number, userId?: string): void {
    this.info('HTTP Request', {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      userId,
    });
  }

  // Log database operations
  database(operation: string, table: string, duration?: number, error?: Error): void {
    if (error) {
      this.error(`Database ${operation} failed on ${table}`, error);
    } else {
      this.debug(`Database ${operation} on ${table}`, { duration: duration ? `${duration}ms` : undefined });
    }
  }

  // Log AI service calls
  aiService(operation: string, model: string, duration?: number, error?: Error): void {
    if (error) {
      this.error(`AI service ${operation} failed`, error, { model });
    } else {
      this.info(`AI service ${operation}`, { model, duration: duration ? `${duration}ms` : undefined });
    }
  }

  // Log queue operations
  queue(operation: string, jobId: string, jobType: string, error?: Error): void {
    if (error) {
      this.error(`Queue ${operation} failed`, error, { jobId, jobType });
    } else {
      this.info(`Queue ${operation}`, { jobId, jobType });
    }
  }
}

export const logger = new Logger();
