import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NotificationType } from '../model/enum/notification-type.enum';

/**
 * @title Snack-bar with configurable position
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private _snackBar: MatSnackBar) {}

  notify(type: NotificationType, message: string) {
    this._snackBar.open(message, 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [type || NotificationType.DEFAULT],
      duration: 4000
    });
  }

  public showServiceFailureMessage(serviceName: string, error: ErrorEvent) {
    const errorMessage = error.message ? error.message : error.error.message;
    const errorLabel = `${serviceName} service has failed: ${errorMessage}`;
    this.notify(NotificationType.ERROR, errorLabel);
  }
}
