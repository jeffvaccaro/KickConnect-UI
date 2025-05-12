import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/Interceptor/AuthInterceptor'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { routes } from './app/app.routes';
import { LoggerService } from './app/services/logger.service';

import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import { fetchAuthSession } from 'aws-amplify/auth';
import { awsConfig } from './aws-exports';

// Configure Amplify
console.log('Configuring Amplify with:', JSON.stringify(awsConfig, null, 2));
Amplify.configure(awsConfig);

// Listen for auth events
Hub.listen('auth', ({ payload }) => {
  const { event } = payload;
  console.log('Auth event in main.ts:', event);
});

// Process OAuth code if present - do this before bootstrapping the app
const processAuth = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log('OAuth code detected in main.ts, fetching session...');
      try {
        const session = await fetchAuthSession({ forceRefresh: true });
        console.log('Auth session in main.ts:', session);
        return true;
      } catch (error) {
        console.error('Error fetching auth session in main.ts:', error);
      }
    }
  } catch (error) {
    console.error('Error in auth processing:', error);
  }
  return false;
};

// Process auth before bootstrapping the app
processAuth().then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(MatSnackBarModule, BrowserAnimationsModule, RouterModule.forRoot(routes)),
      provideHttpClient(withInterceptorsFromDi()),
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      LoggerService,
    ],
  }).catch(err => console.error(err));
});