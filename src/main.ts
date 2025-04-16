import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from '@app/Interceptor/AuthInterceptor';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { routes } from './app/app.routes';
import { LoggerService } from './app/services/logger.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(MatSnackBarModule, BrowserAnimationsModule, RouterModule.forRoot(routes)),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    LoggerService
  ]
});
