import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../notification.service';
import { ProblemDetails } from '../../model/problem-details.model';
import { NotificationType } from '../../model/enum/notification-type.enum';
import { SKIP_ERROR_NOTIFICATION } from './error.context';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (request.context.get(SKIP_ERROR_NOTIFICATION)) {
          return throwError(() => error);
        }

        if (error.error && typeof error.error === 'object' && 'title' in error.error) {
          const problem = error.error as ProblemDetails;
          this.notificationService.showProblemDetails(problem);
        } else if (error.error && error.error.message) {
          this.notificationService.notify(
            NotificationType.ERROR,
            error.error.message,
          );
        } else {
          this.notificationService.notify(
            NotificationType.ERROR,
            'An error occurred. Please try again.',
          );
        }

        return throwError(() => error);
      }),
    );
  }
}