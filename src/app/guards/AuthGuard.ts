import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/authService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AuthGuard checking authentication...');
    
    if (this.authService.isAuthenticatedUser()) {
      console.log('AuthGuard - User is authenticated');
      return true;
    }
    
    console.log('AuthGuard - User is not authenticated, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}