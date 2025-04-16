import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-dynamic',
    template: '<p>Redirecting...</p>',
    standalone: false
})
export class DynamicComponent implements OnInit {
  role: string;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    console.log('DynamicComponent initialized.');
    this.userService.getRoleName().subscribe({
      next: (roleName) => {
        console.log('Role received:', roleName);
        this.role = roleName;
        this.routeUser();
      },
      error: (err) => {
        console.error('Error fetching role:', err);
      }
    });
  }
  
  routeUser() {
    console.log('Routing user based on role:', this.role);
    switch (this.role) {
      case 'Super Admin':
        console.log('Navigating to super-admin.');
        this.router.navigate(['super-admin']);
        break;
      case 'Owner':
        console.log('Navigating to owner.');
        this.router.navigate(['owner']);
        break;
      case 'Admin':
        console.log('Navigating to admin.');
        this.router.navigate(['admin']);
        break;
      case 'Staff':
        console.log('Navigating to staff.');
        this.router.navigate(['staff']);
        break;        
      default:
        console.log('Navigating to not-authorized.');
        this.router.navigate(['not-authorized']);
    }
  }
}
