import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RoleService } from '../services/role.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const expectedRoles: string[] = route.data['expectedRoles'];

    return this.userService.getRoleName().pipe(
      map(userRole => {
        const hasRole = expectedRoles.includes(userRole);
        console.log('Expected roles:', expectedRoles, 'User role:', userRole, 'Has role:', hasRole);
        if (!hasRole) {
          console.log('!hasRole');
          this.router.navigate(['not-authorized']);
        }
        return hasRole;
      }),
      catchError(() => {
        console.log('ERROR');
        this.router.navigate(['not-authorized']);
        return of(false);
      })
    );
  }
}
