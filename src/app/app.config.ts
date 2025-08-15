import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app-routes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './service/notification.service';
import { AuthenticationGuard } from './service/security/guard/authentication.guard';
import { AuthenticationService } from './service/security/authentication.service';
import { ElementService } from './service/element.service';
import { UserService } from './service/user.service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './service/security/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    MatSnackBar,
    NotificationService,
    AuthenticationGuard,
    AuthenticationService,
    ElementService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
