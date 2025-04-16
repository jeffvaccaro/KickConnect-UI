import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, delay, switchMap } from 'rxjs/operators';
import { ModalService } from '../services/modal.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../services/loginService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private modalService: ModalService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    const cloned = token ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }) : req;

    return next.handle(cloned).pipe(
      retry({
        delay: (retryCount) => of(retryCount).pipe(delay(retryCount * 1000)), // Incremental delay
        count: 3 // Retry 3 times
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Avoid looping if already on authentication route
          if (this.router.url !== '/register') {
            this.snackBar.open('Credentials Incorrect or Session Expired. Please log in again.', 'OK', { duration: 3000 });

            return this.loginService.refreshToken().pipe(
              switchMap((newToken: string) => {
                localStorage.setItem('authToken', newToken);
                const newRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next.handle(newRequest);
              }),
              catchError(refreshError => {
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 3000); // Delay navigation to allow snackBar display
                return throwError(refreshError);
              })
            );
          }
        } else if (error.status >= 500) {
          this.snackBar.open('Server error. Redirecting...', 'OK', { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/error']);
          }, 3000); // Delay navigation to allow snackBar display
        } else if (!navigator.onLine) {
          this.snackBar.open('No internet connection. Redirecting...', 'OK', { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/error']);
          }, 3000); // Delay navigation to allow snackBar display
        } else if (error.status >= 400 && error.status < 500) {
          this.modalService.openModal(); // Use modal service only for client errors
        } else {
          this.snackBar.open('An unexpected error occurred. Please try again.', 'OK', { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/error']);
          }, 3000); // Delay navigation to allow snackBar display
        }
        return throwError(() => new Error(error.message)); // Updated to new throwError syntax
      })
    );
  }
}
