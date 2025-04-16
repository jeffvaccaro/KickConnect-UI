import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor(private http: HttpClient) {}

  logError(message: string, error: any) {
    const errorMessage = error?.message || 'Unknown error';
    const errorStack = error?.stack || 'No stack trace available';
    const loggerEndpoint = `${environment.apiUrl}/api/logger`;
    this.http.post(loggerEndpoint, { message, error: { errorMessage, errorStack }, level: 'error' })
      .subscribe({
        next: response => console.log('Log successfully sent', response),
        error: err => console.error('Failed to send log', err)
      });
  }
  
  logInfo(message: string, info: any) {
    console.info(`${message}: ${JSON.stringify(info)}`);
    const loggerEndpoint = `${environment.apiUrl}/api/logger`;
    this.http.post(loggerEndpoint, { message, info, level: 'info' }).subscribe();
  }
  
  logWarn(message: string, warning: any) {
    console.warn(`${message}: ${JSON.stringify(warning)}`);
    const loggerEndpoint = `${environment.apiUrl}/api/logger`;
    this.http.post(loggerEndpoint, { message, warning, level: 'warn' }).subscribe();
  }
  
  logDebug(message: string, debugInfo: any) {
    console.debug(`${message}: ${JSON.stringify(debugInfo)}`);
    const loggerEndpoint = `${environment.apiUrl}/api/logger`;
    this.http.post(loggerEndpoint, { message, debugInfo, level: 'debug' }).subscribe();
  }
}
