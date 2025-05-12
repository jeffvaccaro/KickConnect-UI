import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding token for token-related endpoints
    if (request.url.includes('/oauth2/token') || request.url.includes('/oauth2/userInfo')) {
      return next.handle(request);
    }

    // Skip adding token for non-API calls
    if (!request.url.includes('/api/')) {
      return next.handle(request);
    }

    // Add the token to API requests
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(authReq);
    }

    return next.handle(request);
  }
}