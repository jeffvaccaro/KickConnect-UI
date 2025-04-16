import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/authService';
import { AuthGuard } from './guards/AuthGuard';
import { authinterceptor } from './interceptor/authinterceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes), 
        AuthService,
        AuthGuard,        
        provideClientHydration(), 
        provideAnimationsAsync(), 
        importProvidersFrom(HttpClientModule, CommonModule),
        { provide: HTTP_INTERCEPTORS, useClass: authinterceptor, multi: true }
    ]
};
