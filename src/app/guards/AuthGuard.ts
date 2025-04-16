import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/authService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const currentPath = route.routeConfig?.path || '';
    const publicRoutes = ['register', 'reset-password'];
  
    if (publicRoutes.includes(currentPath)) {
      console.log('Allowed public route:', currentPath);
      return true;
    }
  
    if (isAuthenticated) {
      console.log('AuthGuard - isAuthenticated:', isAuthenticated);
      return true;
    } else {
      console.log('AuthGuard: Redirecting to authentication');
      this.router.navigate(['logout']);
      return false;
    }
  }
  
}