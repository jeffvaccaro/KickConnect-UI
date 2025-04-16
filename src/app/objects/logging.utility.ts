// logging.utility.ts
import { NGXLogger } from 'ngx-logger';

export class LoggingUtility {
  static logError(logger: NGXLogger, message: string, error: any) {
    logger.error(message, error);
    // Additional actions if needed (e.g., send logs to backend)
  }
}
