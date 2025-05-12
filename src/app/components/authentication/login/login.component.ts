import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../../services/authService'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoginComponent implements OnInit {
  authInProgress = false;
  authError: string | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('LoginComponent initialized');
    
    // Check if the user is already authenticated
    if (this.authService.isAuthenticatedUser()) {
      console.log('User is already authenticated');
      this.router.navigate(['/dashboard']);
      return;
    }
    
    // Handle the auth code if it's in the URL
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        console.log('Authorization code detected in URL:', code);
        this.handleAuthCode(code);
      }
    });
  }

  // Handle the authorization code from Cognito
  handleAuthCode(code: string) {
    this.authInProgress = true;
    console.log('Processing authorization code...');
    
    this.authService.exchangeCodeForTokens(code).subscribe({
      next: (tokens) => {
        console.log('Successfully exchanged code for tokens');
        
        // Clean up the URL and navigate to dashboard
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: (error) => {
        console.error('Error exchanging code for tokens:', error);
        this.authError = 'Failed to complete authentication. Please try again.';
        this.authInProgress = false;
      }
    });
  }

  // This is the method called from the button click
  loginWithCognito() {
    this.authInProgress = true;
    this.authError = null;
    
    try {
      // Use our AuthService to get the login URL
      const loginUrl = this.authService.getLoginUrl();
      console.log('Redirecting to Cognito login:', loginUrl);
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Error initiating sign-in:', error);
      this.authError = 'Failed to initiate login process';
      this.authInProgress = false;
    }
  }
}