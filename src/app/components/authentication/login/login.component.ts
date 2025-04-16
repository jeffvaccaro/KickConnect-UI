import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { LoginService } from '../../../services/loginService';
import { AuthService } from '../../../services/authService';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule
],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    email: string = '';
    password: string = '';
    
    hide = true;

    constructor(
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder, 
        private loginService: LoginService, 
        private authService: AuthService,  
        private userService: UserService,
        private router: Router) {
          this.loginForm = this.fb.group({
            // email: ['admin@admin.com', [Validators.required, Validators.email]],
            // password: ['admin12345', Validators.required]
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
          });
        }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    onSubmit() {
      if (this.loginForm.valid) {
        const { email, password } = this.loginForm.value;
        this.loginService.login(email, password).subscribe({
          next: response => {
            const token = response.token;
            const decodedToken: any = this.decodeToken(token);
            const expiration = decodedToken.exp * 1000; // Convert to milliseconds
            this.authService.setToken(token, new Date(expiration).toISOString());
            this.userService.setAccountCode(response.accountCode);
            this.userService.setAccountId(response.accountId);
            this.userService.setUserName(response.name);
            this.userService.setRoleName(response.role);
    
            // Log before navigation
            console.log('Login successful, navigating to root path');
            
            // Navigate to the root path to trigger DynamicComponent
            this.router.navigate(['/dashboard']);
          },
          error: error => {
            console.error('Login failed', error); // Handle login error
          }
        });
      }
    }
    
    private decodeToken(token: string): any {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    
      return JSON.parse(jsonPayload);
    }
  }
