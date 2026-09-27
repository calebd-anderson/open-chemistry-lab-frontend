import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    httpRequest: HttpRequest<any>,
    HttpHandler: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Only add the token if the request is for our API origin
    if (!httpRequest.url.startsWith(this.authenticationService.host)) {
      return HttpHandler.handle(httpRequest);
    }

    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    if (token) {
      return HttpHandler.handle(
        httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
      );
    }
    return HttpHandler.handle(httpRequest);
  }
}
