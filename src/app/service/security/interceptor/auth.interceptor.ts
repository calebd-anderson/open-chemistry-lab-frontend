import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(httpRequest: HttpRequest<any>, HttpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(`${this.authenticationService.host}/user/login`)) {
      return HttpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.authenticationService.host}/user/register`)) {
      return HttpHandler.handle(httpRequest);
    }
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    if (token)
      return HttpHandler.handle(httpRequest.clone({setHeaders: { Authorization: `Bearer ${token}` }}));
    return HttpHandler.handle(httpRequest.clone());
  }
}
