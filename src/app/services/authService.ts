import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Cognito configuration
  private cognitoDomain = environment.auth.cognitoDomain;
  private clientId = environment.auth.clientId;
  private redirectUri = environment.auth.redirectUri;
  private clientSecret = environment.auth.clientSecret;

  constructor(private http: HttpClient) {
    // Check if we're already authenticated
    this.checkAuthStatus();
  }

  // Get login URL for Cognito hosted UI
  getLoginUrl(): string {
    const responseType = 'code';
    const scope = 'openid email';
    const state = Math.random().toString(36).substring(2);
    
    return `${this.cognitoDomain}/oauth2/authorize?client_id=${this.clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${state}`;
  }

  // Exchange authorization code for tokens
  exchangeCodeForTokens(code: string): Observable<any> {
    const tokenEndpoint = `${this.cognitoDomain}/oauth2/token`;
    
    // Create the form data - This is very specific to how Cognito expects it
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', this.clientId) 
      .set('code', code)
      .set('redirect_uri', this.redirectUri);
    
    // Set up the headers - WITH BASIC AUTH for the client secret
    // The Format is: "Basic " + base64(clientId:clientSecret)
    const auth = btoa(`${this.clientId}:${this.clientSecret}`);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Basic ${auth}`);
    
    console.log('Request headers:', headers);
    console.log('Request body:', body.toString());
    
    return this.http.post(tokenEndpoint, body.toString(), { headers })
      .pipe(
        tap(tokens => {
          console.log('Received tokens:', tokens);
          this.storeTokens(tokens);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Token exchange error response:', error);
          if (error.error) {
            console.error('Error details:', error.error);
          }
          return throwError(() => new Error(`Failed to exchange code: ${error.message}`));
        })
      );
  }

  // Store tokens in localStorage
  private storeTokens(tokens: any): void {
    localStorage.setItem('id_token', tokens.id_token);
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token || '');
    localStorage.setItem('expires_at', JSON.stringify(Date.now() + tokens.expires_in * 1000));
  }

  // Check if the user is authenticated
  isAuthenticatedUser(): boolean {
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) return false;
    
    return Date.now() < JSON.parse(expiresAt);
  }

  // Check authentication status and update subject
  checkAuthStatus(): boolean {
    const isAuth = this.isAuthenticatedUser();
    this.isAuthenticatedSubject.next(isAuth);
    return isAuth;
  }

  // Get user information using the access token
  getUserInfo(): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return throwError(() => new Error('No access token available'));
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    
    return this.http.get(`${this.cognitoDomain}/oauth2/userInfo`, { headers });
  }

  // Get ID token
  getIdToken(): string | null {
    return localStorage.getItem('id_token');
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Logout
  logout(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    
    this.isAuthenticatedSubject.next(false);
    
    // Redirect to Cognito logout
    const logoutUrl = `${this.cognitoDomain}/logout?client_id=${this.clientId}&logout_uri=${encodeURIComponent('http://localhost:4200/login')}`;
    window.location.href = logoutUrl;
  }


// Add this helper method to your AuthService
private logFullResponse(response: any) {
  console.log('Full response:', {
    body: response.body,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    type: response.type,
    url: response.url
  });
}
}