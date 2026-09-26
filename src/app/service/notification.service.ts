import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NotificationType } from '../model/enum/notification-type.enum';
import { ProblemDetails } from '../model/problem-details.model';

/**
 * @title Snack-bar with configurable position
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private _snackBar: MatSnackBar) {}

  notify(type: NotificationType, message: string) {
    if (!message) {
      message = 'An error occured. Please try again.';
    }
    this._snackBar.open(message, 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [type || NotificationType.DEFAULT],
      duration: 4000,
    });
  }

  public showProblemDetails(problem: ProblemDetails) {
    const message = problem.detail || problem.title;
    this.notify(NotificationType.ERROR, message);

    if (problem.errors) {
      // For validation errors, we could expand the message or show a list.
      // For now, we'll just append the first error if there are any.
      const firstError = Object.values(problem.errors).flat()[0];
      if (firstError) {
        this.notify(NotificationType.ERROR, `Error: ${firstError}`);
      }
    }
  }

  public showServiceFailureMessage(serviceName: string, error: ErrorEvent) {
    const errorMessage = error.message ? error.message : error.error.message;
    const errorLabel = `${serviceName} service has failed: ${errorMessage}`;
    this.notify(NotificationType.ERROR, errorLabel);
  }
}
