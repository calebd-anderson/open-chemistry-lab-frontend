import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    if (!request.url.startsWith(environment.apiUrl) || !token) {
      return next.handle(request);
    }

    return next.handle(
      request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      }),
    );
  }
}
